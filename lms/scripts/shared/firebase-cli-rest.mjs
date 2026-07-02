import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { GoogleAuth } from "google-auth-library";

const projectId = process.env.FIREBASE_PROJECT_ID || "equisaas-bd";
const firebaseCliConfigPath = path.join(os.homedir(), ".config", "configstore", "firebase-tools.json");
const require = createRequire(import.meta.url);
const firebaseToolsAuth = require("firebase-tools/lib/auth.js");
const firebaseToolsApi = require("firebase-tools/lib/api.js");

const readFirebaseCliConfig = async () => {
  const raw = await readFile(firebaseCliConfigPath, "utf8");
  return JSON.parse(raw);
};

export const getProjectId = () => projectId;

export const getAccessToken = async () => {
  const config = await readFirebaseCliConfig();
  if (!config?.tokens?.refresh_token && !config?.tokens?.access_token) {
    throw new Error("Firebase CLI access token not found. Run firebase login first.");
  }

  try {
    if (config.tokens.refresh_token) {
      const auth = new GoogleAuth({
        credentials: {
          type: "authorized_user",
          client_id: firebaseToolsApi.clientId(),
          client_secret: firebaseToolsApi.clientSecret(),
          refresh_token: config.tokens.refresh_token,
        },
        scopes: [
          "https://www.googleapis.com/auth/cloud-platform",
          "https://www.googleapis.com/auth/firebase",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
      });
      const client = await auth.getClient();
      const tokenResponse = await client.getAccessToken();
      const token = typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;
      if (token) {
        return token;
      }
    }
  } catch (error) {
    try {
      if (config.tokens.refresh_token) {
        const refreshed = await firebaseToolsAuth.getAccessToken(config.tokens.refresh_token);
        if (refreshed?.access_token) {
          return refreshed.access_token;
        }
      }
    } catch (refreshError) {
      // Fall back to the stored token if refresh fails for any reason.
    }
  }

  return config.tokens.access_token;
};

const requestJson = async (method, url, body) => {
  const token = await getAccessToken();
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${method} ${url} failed: ${response.status} ${response.statusText}\n${errorText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const isPlainObject = (value) => Object.prototype.toString.call(value) === "[object Object]";

export const toFirestoreValue = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return { nullValue: null };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    if (!value.length) return { arrayValue: {} };
    return { arrayValue: { values: value.map(toFirestoreValue).filter(Boolean) } };
  }
  if (isPlainObject(value)) {
    if (value.__type === "timestamp" && value.value) {
      return { timestampValue: new Date(value.value).toISOString() };
    }
    const fields = Object.fromEntries(
      Object.entries(value)
        .map(([key, nested]) => [key, toFirestoreValue(nested)])
        .filter(([, nested]) => nested !== undefined),
    );
    return { mapValue: { fields } };
  }
  throw new Error(`Unsupported Firestore value: ${value}`);
};

const fromFirestoreValue = (value) => {
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(fromFirestoreValue);
  if ("mapValue" in value) {
    return Object.fromEntries(
      Object.entries(value.mapValue.fields || {}).map(([key, nested]) => [key, fromFirestoreValue(nested)]),
    );
  }
  return value;
};

export const fromFirestoreDocument = (document) => {
  if (!document?.name) return null;
  const id = document.name.split("/").pop();
  return {
    id,
    ...Object.fromEntries(
      Object.entries(document.fields || {}).map(([key, value]) => [key, fromFirestoreValue(value)]),
    ),
  };
};

export const patchDocument = async (documentPath, data) => {
  const fieldPaths = Object.keys(data);
  const params = fieldPaths.length
    ? `?${fieldPaths.map((fieldPath) => `updateMask.fieldPaths=${encodeURIComponent(fieldPath)}`).join("&")}`
    : "";
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${documentPath}${params}`;
  const body = {
    name: `projects/${projectId}/databases/(default)/documents/${documentPath}`,
    fields: Object.fromEntries(
      Object.entries(data)
        .map(([key, value]) => [key, toFirestoreValue(value)])
        .filter(([, value]) => value !== undefined),
    ),
  };
  const response = await requestJson("PATCH", url, body);
  return fromFirestoreDocument(response);
};

export const getDocument = async (documentPath) => {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${documentPath}`;
  try {
    const response = await requestJson("GET", url);
    return fromFirestoreDocument(response);
  } catch (error) {
    if (String(error.message || "").includes("404")) {
      return null;
    }
    throw error;
  }
};

export const deleteDocument = async (documentPath) => {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${documentPath}`;
  try {
    await requestJson("DELETE", url);
  } catch (error) {
    if (String(error.message || "").includes("404")) {
      return;
    }
    throw error;
  }
};

export const listDocuments = async (collectionId, pageSize = 100) => {
  const documents = [];
  let pageToken = "";

  do {
    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionId}`,
    );
    url.searchParams.set("pageSize", String(pageSize));
    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }
    const response = await requestJson("GET", url.toString());
    documents.push(...(response.documents || []).map(fromFirestoreDocument));
    pageToken = response.nextPageToken || "";
  } while (pageToken);

  return documents;
};

export const runQuery = async (structuredQuery) => {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
  const response = await requestJson("POST", url, { structuredQuery });
  return response.map((item) => fromFirestoreDocument(item.document)).filter(Boolean);
};

export const lookupAuthUserByEmail = async (email) => {
  const url = `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:lookup`;
  const response = await requestJson("POST", url, { email: [email] });
  return response.users?.[0] || null;
};

export const updateAuthUser = async ({ localId, customAttributes, displayName, disableUser }) => {
  const url = `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update`;
  const body = { localId };
  if (customAttributes) {
    body.customAttributes = JSON.stringify(customAttributes);
  }
  if (displayName) {
    body.displayName = displayName;
  }
  if (typeof disableUser === "boolean") {
    body.disableUser = disableUser;
  }
  return requestJson("POST", url, body);
};

export const deleteAuthUser = async (localId) => {
  const url = `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:delete`;
  return requestJson("POST", url, { localId });
};
