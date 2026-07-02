/**
 * EquiSaaS BD Download Orchestration Helper
 * Ensures consistent file extensions, mime types, and safe filenames.
 */

/**
 * Sanitizes a string for use as a filename
 */
export const sanitizeFilename = (name) => {
  return name
    .replace(/[^a-z0-9.-]/gi, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "");
};

/**
 * Triggers a download for a Blob or Data URL
 */
export const triggerDownload = (blobOrUrl, filename) => {
  const isUrl = typeof blobOrUrl === "string";
  const url = isUrl ? blobOrUrl : window.URL.createObjectURL(blobOrUrl);
  const safeFilename = sanitizeFilename(filename || "download");

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safeFilename;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
  document.body.removeChild(anchor);

  if (!isUrl) {
    // Large certificate files can take a moment before the browser actually starts the download.
    setTimeout(() => window.URL.revokeObjectURL(url), 60000);
  }
};

/**
 * Specifically handles CSV downloads with extension enforcement
 */
export const triggerCsvDownload = (name, rows) => {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const filename = name.toLowerCase().endsWith(".csv") ? name : `${name}.csv`;
  const safeName = sanitizeFilename(filename);

  triggerDownload(blob, safeName);
};
