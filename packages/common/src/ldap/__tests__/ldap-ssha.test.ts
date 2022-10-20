import { ldapSSHACreate, ldapSHAVerify, createSalt } from '../ldap.js';

describe('ldap ssha verify', () => {
  it('ldap.createSHA', () => {
    // salt: 'wQAWVA=='
    const ssha = ldapSSHACreate('test.lr', createSalt());
    const verify = ldapSHAVerify('test.lr', ssha);
    expect(verify).toBe(true);
  });

  it('ldap.verifySSHA', () => {
    const verify = ldapSHAVerify(
      'test.lr$',
      '{SSHA}Wi/FFD3Sr4r6tOdLrNZnLsPgB1QzL+VB'
    );
    const verify1 = ldapSHAVerify(
      'test.lr$',
      '{SSHA}Su+bBcct6OIdsFSfj4KZChehOHqXvBFH'
    );
    expect(verify).toBe(true);
    expect(verify1).toBe(true);
  });
});
