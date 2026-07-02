export const formatDate = (value) => {
  if (!value) return "Not set";
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const formatDateTime = (value) => {
  if (!value) return "Not set";
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export const formatDateKey = (value, locale = "en-BD") => {
  const safeValue = String(value || "").trim();
  const match = safeValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "Not set";

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 6, 0, 0));
  if (Number.isNaN(date.getTime())) return "Not set";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
};
