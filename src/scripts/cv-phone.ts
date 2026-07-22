/**
 * Shared phone parse/validate/format helpers for the CV page.
 *
 * Used both at build time (rendering a `tel` query value into the General
 * information section) and at client time (the share modal turning a typed
 * number into a `tel` query value). Keeping this logic in one pure module
 * guarantees the display shown to a URL recipient matches what the sharer
 * intended.
 *
 * Country code is fixed to Malaysia (`+60`). A valid local number is 9 or 10
 * digits (excluding the `60` country code).
 */

const COUNTRY_CODE = '60';

/** Strip everything but digits, then drop a leading country code if present. */
export function parseLocalDigits(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith(COUNTRY_CODE)) {
    digits = digits.slice(COUNTRY_CODE.length);
  }
  return digits;
}

/** A valid local number (excluding country code) is 9 or 10 digits. */
export function isValidLocal(digits: string): boolean {
  return digits.length === 9 || digits.length === 10;
}

/**
 * Format local digits as a display phone number, e.g. `+6019-123 4567`
 * (10 digits) or `+6012-345 678` (9 digits).
 */
export function format(digits: string): string {
  if (digits.length === 10) {
    return `+${COUNTRY_CODE}${digits.slice(0, 2)}-${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 9) {
    return `+${COUNTRY_CODE}${digits.slice(0, 2)}-${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  return `+${COUNTRY_CODE}${digits}`;
}

/** Build the raw value (before URL-encoding) to place in the `tel` query param. */
export function toTelParam(digits: string): string {
  return `+${COUNTRY_CODE}${digits}`;
}

/**
 * Decode and parse a `tel` query value back into valid local digits, or
 * `null` when absent/invalid.
 */
export function fromTelParam(value: string | null | undefined): string | null {
  if (!value) return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    decoded = value;
  }
  const digits = parseLocalDigits(decoded);
  return isValidLocal(digits) ? digits : null;
}
