export function normalizeIban(iban: string): string {
  return iban.replace(/\s+/g, "").toUpperCase();
}

export function normalizeBic(bic: string): string {
  return bic.replace(/\s+/g, "").toUpperCase();
}

export function isValidIban(iban: string): boolean {
  const n = normalizeIban(iban);
  return /^[A-Z]{2}[0-9A-Z]{13,32}$/.test(n);
}

export function isValidBic(bic: string): boolean {
  const n = normalizeBic(bic);
  return /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(n);
}
