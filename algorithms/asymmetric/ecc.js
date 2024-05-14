const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('curve25519');

// Generate a static public key
const staticKeyPair = ec.genKeyPair();
const publicKey = staticKeyPair.getPublic();

function encrypt(data) {
  // Create a new private key
  const key = ec.genKeyPair();
  const privateKey = key.getPrivate();

  // Generate a shared secret
  const sharedSecret = key.derive(publicKey);

  // Use the shared secret to encrypt the data using AES
  const cipher = crypto.createCipheriv('aes-256-cbc', sharedSecret.toString('hex').slice(0, 32), '1234567890123456');
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    encryptedData: encrypted,
    privateKey: privateKey.toString('hex'),
  };
}

function decrypt(encryptedData, privateKey) {
  // Get the private key
  const key = ec.keyFromPrivate(privateKey);

  // Generate a shared secret
  const sharedSecret = key.derive(publicKey);

  // Use the shared secret to decrypt the data using AES
  const decipher = crypto.createDecipheriv('aes-256-cbc', sharedSecret.toString('hex').slice(0, 32), '1234567890123456');
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
}

module.exports = {
  encrypt,
  decrypt,
};