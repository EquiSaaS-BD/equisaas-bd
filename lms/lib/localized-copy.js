const MOJIBAKE_PATTERN = /(ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢.|ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡.|ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦|ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§|ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¥|ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬|ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¿Ãƒâ€šÃ‚Â½|ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦|ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â§|ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¥|ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬|Ã Â¦|Ã Â§|Ã Â¥|Ã¢Å“Â¦)/;
const REPLACEMENT_CHAR_PATTERN = /\uFFFD/;
const CONTROL_CHAR_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/;

export function looksCorruptedLocalizedText(text) {
  return typeof text === "string" && (
    MOJIBAKE_PATTERN.test(text) ||
    REPLACEMENT_CHAR_PATTERN.test(text) ||
    CONTROL_CHAR_PATTERN.test(text)
  );
}

export function normalizeLocalizedText(text) {
  if (typeof text !== "string") return text;

  let nextValue = text;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (!looksCorruptedLocalizedText(nextValue)) {
      return nextValue;
    }

    try {
      const bytes = Uint8Array.from([...nextValue].map((char) => char.charCodeAt(0) & 0xff));
      const decoded = new TextDecoder("utf-8").decode(bytes);
      if (!decoded || decoded === nextValue) {
        return nextValue;
      }
      nextValue = decoded;
    } catch {
      return nextValue;
    }
  }

  return nextValue;
}

export function normalizeLocalizedTree(input) {
  if (Array.isArray(input)) {
    return input.map((item) => normalizeLocalizedTree(item));
  }

  if (input && typeof input === "object") {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, normalizeLocalizedTree(value)]),
    );
  }

  return normalizeLocalizedText(input);
}
