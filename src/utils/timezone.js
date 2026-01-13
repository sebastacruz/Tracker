/**
 * Timezone utilities - uses device's local time
 */

/**
 * Get current time from device as ISO-like string (local timezone)
 * @returns {string} ISO 8601 format timestamp in device's local time
 */
export function getCurrentLocalTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
