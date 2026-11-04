/** Normalises an Indian mobile number to its 10 national digits. */
export function normalizePhoneNumber(rawPhone: string): string {
  let digits = rawPhone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(-10);
}
