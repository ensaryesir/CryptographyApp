const crypto = require('crypto');
const fs = require('fs');

async function encrypt(jsonDataFileName) {
  return new Promise((resolve, reject) => {
    try {
      // Encryption key (24 bytes for 3DES)
      const key = crypto.randomBytes(24); 

      // Create a Cipher object
      const cipher = crypto.createCipheriv('des-ede3-cbc', key, Buffer.alloc(8));

      // Read and encrypt the file
      const input = fs.createReadStream(`uploads/${jsonDataFileName}`);
      let encryptedData = '';
      input.pipe(cipher)
        .on('data', chunk => encryptedData += chunk.toString('hex'))
        .on('end', () => {
          const keyBase64 = key.toString('base64');
          resolve({
            encryptedData: encryptedData,
            key: keyBase64
          });
        })
        .on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

async function decrypt(encryptedFileName, keyBuffer) {
  return new Promise((resolve, reject) => {
    try {
      // Create a Decipher object
      const decipher = crypto.createDecipheriv('des-ede3-cbc', keyBuffer, Buffer.alloc(8));

      // Read and decrypt the file
      const input = fs.createReadStream(`uploads/${encryptedFileName}`);
      let decryptedData = '';
      input.pipe(decipher)
        .on('data', chunk => decryptedData += chunk.toString())
        .on('end', () => {
          // Return the decrypted data
          resolve(decryptedData);
        })
        .on('error', reject);
    } catch (error) {
      console.error('Decryption error:', error);
      reject(error);
    }
  });
}

module.exports = {
  encrypt,
  decrypt
};