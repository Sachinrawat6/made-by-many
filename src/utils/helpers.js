/**
 * Resolve a person's name from API record using ordered field key lookup.
 * Falls back to defaultName if none found.
 */
export function resolveName(record, fieldKeys, defaultName) {
  if (!record) return defaultName;
  for (const key of fieldKeys) {
    const val = record[key];
    if (val && typeof val === "string" && val.trim().length > 0) {
      return val.trim();
    }
  }
  return defaultName;
}

/**
 * Get initials from a full name (max 2 chars).
 */
export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

/**
 * Delay helper for async flows.
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safely parse orderId — returns string or null.
 */
export function parseOrderId(raw) {
  if (!raw || raw.trim() === "") return null;
  return raw.trim();
}
