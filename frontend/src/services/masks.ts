export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function maskCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  let out = digits;
  if (digits.length > 9) {
    out = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  } else if (digits.length > 6) {
    out = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  } else if (digits.length > 3) {
    out = `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }
  return out;
}

export function maskTelefone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function unmask(value: string) {
  return onlyDigits(value);
}

export function formatCpf(value: string) {
  return maskCpf(value);
}