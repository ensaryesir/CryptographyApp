const crypto = require('crypto');
const fs = require('fs');

let publicKey;

function generateKeyPair() {
  const { publicKey: pubKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });

  publicKey = pubKey.export({ type: 'pkcs1', format: 'pem' });

  return {
    publicKey,
    privateKey: privateKey.export({ type: 'pkcs1', format: 'pem' }),
  };
}

function getPublicKey() {
  return publicKey;
}

function encrypt(text) {
  const buffer = Buffer.from(text, 'utf8');
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
}

function decrypt(encryptedText, privateKey) {
  const buffer = Buffer.from(encryptedText, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    buffer,
  );
  return decrypted.toString('utf8');
}

module.exports = {
  generateKeyPair,
  getPublicKey,
  encrypt,
  decrypt,
};