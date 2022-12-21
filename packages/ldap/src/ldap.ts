import crypto from 'node:crypto';

export type ChiperType =
  | 'SHA'
  | 'SHA256'
  | 'SHA384'
  | 'SHA512'
  | 'SSHA'
  | 'SSHA256'
  | 'SSHA384'
  | 'SSHA512';

const hashType = (
  cipherType: ChiperType
): { withSalt: boolean; cipher: string } => {
  const hashTypes: Array<ChiperType> = [
    'SHA',
    'SHA256',
    'SHA384',
    'SHA512',
    'SSHA',
    'SSHA256',
    'SSHA384',
    'SSHA512',
  ];
  const ciphers: Record<ChiperType, string> = {
    SHA: 'sha1',
    SHA256: 'sha256',
    SHA384: 'sha384',
    SHA512: 'sha512',
    SSHA: 'sha1',
    SSHA256: 'sha256',
    SSHA384: 'sha384',
    SSHA512: 'sha512',
  };
  const find = hashTypes.find((s) => s.toUpperCase() === cipherType);
  const withSalt = find ? find.startsWith('SS') : false;
  return {
    withSalt,
    cipher: ciphers[cipherType] || 'UNKNOW',
  };
};

const createSHA = (cipher: string, password: string, salt?: Buffer): string => {
  const inputData = salt
    ? Buffer.concat([Buffer.from(password, 'utf8'), salt])
    : password;
  return crypto.createHash(cipher).update(inputData).digest('base64');
};

/**
 * A cryptographic salt is made up of random bits added to each password instance before its hashing
 * @returns
 */
export const createSalt = (): Buffer => {
  return crypto.randomBytes(4);
};

/**
 * Create Ldap Algorithm Authorization token
 * @param password Password
 * @param salt A cryptographic salt is made up of random bits added to each password instance before its hashing
 * @returns Crypto ldap hash string
 */
export const ldapSSHACreate = (
  password: string,
  salt: Buffer | string
): string => {
  // LDAP-SSHA Algorithm formula = {SSHA}base64_encode(sha1(A + salt)+salt)
  const bufferSalt: Buffer =
    typeof salt === 'string' ? Buffer.from(salt) : salt;
  const sha1 = createSHA('SHA1', password, bufferSalt);
  const newBuffer = Buffer.concat([Buffer.from(sha1, 'base64'), bufferSalt]);
  return `{SSHA}${newBuffer.toString('base64')}`;
};

/**
 * Using LDAP to validating user
 * @param password Password
 * @param hash Encryped ldap hash string
 * @returns
 */
export const ldapSHAVerify = (password: string, hash: string): boolean => {
  const pattern = /^\{(\w+)\}/.exec(hash);
  if (!pattern) {
    throw new Error(`no encryption found`);
  }
  const bhash = Buffer.from(hash.replace(pattern[0], ''), 'base64');
  const cipherType = pattern[1] as ChiperType;
  const cipherMapping = hashType(cipherType);
  if (cipherMapping.cipher === 'UNKNOW') {
    // Treat it as a plaintext password
    return Buffer.from(password, 'utf8').toString('base64') === hash;
  }
  // LDAP-SSHA Algorithm formula = {SSHA}base64_encode(sha1(A + salt)+salt)
  // The first 20 digits: C=SHA1(A+salt)
  const shaEncrypt = Buffer.from(
    Uint8Array.prototype.slice.call(bhash, 0, 20)
  ).toString('base64');

  if (cipherMapping.withSalt) {
    // after 20 digits it's random plaintext salt (the length is 4 bit)
    const salt = Buffer.from(Uint8Array.prototype.slice.call(bhash, 20));

    return shaEncrypt === createSHA(cipherMapping.cipher, password, salt);
  } else {
    return shaEncrypt === createSHA(cipherMapping.cipher, password);
  }
};
