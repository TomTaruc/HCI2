import { describe, it, expect } from 'vitest';
// Replicating basic validation rules used in the app components

describe('Validation Logic', () => {
  it('validates mobile number format (11 digits, starts with 09)', () => {
    const isValid = (num: string) => /^09\d{9}$/.test(num);
    
    expect(isValid('09171234567')).toBe(true);
    expect(isValid('09998887777')).toBe(true);
    
    expect(isValid('08171234567')).toBe(false); // wrong prefix
    expect(isValid('0917123456')).toBe(false); // too short
    expect(isValid('091712345678')).toBe(false); // too long
    expect(isValid('abc91234567')).toBe(false); // non-numeric
  });

  it('validates OTP length (6 digits)', () => {
    const isValid = (otp: string) => /^\d{6}$/.test(otp);
    
    expect(isValid('123456')).toBe(true);
    expect(isValid('000000')).toBe(true);
    
    expect(isValid('12345')).toBe(false);
    expect(isValid('1234567')).toBe(false);
    expect(isValid('abcdef')).toBe(false);
  });

  it('validates MPIN format (6 digits)', () => {
    const isValid = (mpin: string) => /^\d{6}$/.test(mpin);
    
    expect(isValid('111111')).toBe(true);
    expect(isValid('123')).toBe(false);
  });
  
  it('validates PCN format (12 digits)', () => {
    // In our app, PCN is entered with spaces but we validate the unmasked value
    const unmask = (val: string) => val.replace(/\D/g, '');
    const isValid = (pcn: string) => unmask(pcn).length === 12;
    
    expect(isValid('1234 5678 9012')).toBe(true);
    expect(isValid('123456789012')).toBe(true);
    expect(isValid('1234 5678 901')).toBe(false);
  });
});
