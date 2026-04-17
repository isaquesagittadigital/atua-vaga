import { describe, it, expect } from 'vitest';
import {
  formatCPF, isValidCPF,
  formatPhone, formatDate,
  formatCEP, parseDateToISO, formatDateToLocale
} from '@/utils/validators';

// ── formatCPF ──────────────────────────────────────────────────────────────
describe('formatCPF', () => {
  it('formats a full 11-digit string correctly', () => {
    expect(formatCPF('12345678901')).toBe('123.456.789-01');
  });

  it('ignores non-digit characters in input', () => {
    expect(formatCPF('123.456.789-01')).toBe('123.456.789-01');
  });

  it('handles partial input gracefully', () => {
    expect(formatCPF('123')).toBe('123');
    expect(formatCPF('12345')).toBe('123.45');
  });

  it('limits to 11 digits', () => {
    expect(formatCPF('123456789012345')).toBe('123.456.789-01');
  });
});

// ── isValidCPF ─────────────────────────────────────────────────────────────
describe('isValidCPF', () => {
  it('returns true for a known valid CPF', () => {
    expect(isValidCPF('529.982.247-25')).toBe(true);
  });

  it('returns false for all-same-digit CPF', () => {
    expect(isValidCPF('111.111.111-11')).toBe(false);
    expect(isValidCPF('000.000.000-00')).toBe(false);
  });

  it('returns false for CPF with wrong length', () => {
    expect(isValidCPF('123.456')).toBe(false);
  });

  it('returns false for invalid check digits', () => {
    expect(isValidCPF('123.456.789-00')).toBe(false);
  });
});

// ── formatPhone ────────────────────────────────────────────────────────────
describe('formatPhone', () => {
  it('formats a 11-digit mobile number', () => {
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
  });

  it('formats a 10-digit landline number', () => {
    expect(formatPhone('1134567890')).toBe('(11) 3456-7890');
  });

  it('handles partial input', () => {
    const result = formatPhone('11');
    expect(result).toContain('11');
  });
});

// ── formatDate ─────────────────────────────────────────────────────────────
describe('formatDate', () => {
  it('formats 8 digits as DD/MM/YYYY', () => {
    expect(formatDate('01012000')).toBe('01/01/2000');
  });

  it('strips non-digits before formatting', () => {
    expect(formatDate('01/01/2000')).toBe('01/01/2000');
  });

  it('returns empty string for empty input', () => {
    expect(formatDate('')).toBe('');
  });

  it('limits year to 4 digits', () => {
    expect(formatDate('0101200099')).toBe('01/01/2000');
  });
});

// ── formatCEP ──────────────────────────────────────────────────────────────
describe('formatCEP', () => {
  it('formats a full CEP string', () => {
    expect(formatCEP('12345678')).toBe('12345-678');
  });

  it('handles partial input', () => {
    expect(formatCEP('12345')).toBe('12345');
  });

  it('limits to 8 digits', () => {
    expect(formatCEP('123456789')).toBe('12345-678');
  });
});

// ── parseDateToISO ─────────────────────────────────────────────────────────
describe('parseDateToISO', () => {
  it('converts DD/MM/YYYY to ISO YYYY-MM-DD', () => {
    expect(parseDateToISO('15/06/1990')).toBe('1990-06-15');
  });

  it('returns null for empty string', () => {
    expect(parseDateToISO('')).toBeNull();
  });

  it('returns null for invalid format', () => {
    expect(parseDateToISO('invalid')).toBeNull();
    expect(parseDateToISO('15/06')).toBeNull();
  });
});

// ── formatDateToLocale ─────────────────────────────────────────────────────
describe('formatDateToLocale', () => {
  it('converts ISO date to DD/MM/YYYY', () => {
    expect(formatDateToLocale('1990-06-15')).toBe('15/06/1990');
  });

  it('returns already locale-formatted dates unchanged', () => {
    expect(formatDateToLocale('15/06/1990')).toBe('15/06/1990');
  });

  it('returns empty string for empty input', () => {
    expect(formatDateToLocale('')).toBe('');
  });

  it('handles ISO datetime strings with T', () => {
    expect(formatDateToLocale('1990-06-15T00:00:00')).toBe('15/06/1990');
  });
});
