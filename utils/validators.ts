
export const formatCPF = (value: string): string => {
  return value
    .replace(/\D/g, '') // Remove non-digits
    .replace(/(\d{3})(\d)/, '$1.$2') // Add first dot
    .replace(/(\d{3})(\d)/, '$1.$2') // Add second dot
    .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Add dash
    .replace(/(-\d{2})\d+?$/, '$1'); // Limit to 11 digits
};


export const isValidCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
};

export const formatPhone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '').substring(0, 11); // Limit to 11 digits

  // (00) 00000-0000 (11 digits)
  if (cleanValue.length > 10) {
    return cleanValue
      .replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }

  // (00) 0000-0000 (10 digits)
  if (cleanValue.length > 2) {
    return cleanValue
      .replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3')
      .replace(/-$/, ''); // Remove trailing dash if incomplete
  }

  if (cleanValue.length > 0) {
    return `(${cleanValue}`;
  }

  return value;
};

