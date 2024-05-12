// aes.js
const crypto = require('crypto');
const fs = require('fs');

async function encrypt(jsonDataFileName) {
  return new Promise((resolve, reject) => {
    try {
      // Rastgele bir initialization vector (IV) oluştur
      const iv = crypto.randomBytes(16);

      // Şifreleme anahtarı (256 bit için 32 bayt)
      const key = crypto.randomBytes(32); 

      // Şifreleyici nesnesini oluştur
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

      // Dosyayı oku ve şifrele
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

async function decrypt(encryptedFileName, key) {
  return new Promise((resolve, reject) => {
    try {
      // Use the same IV and key that were used for encryption
      const iv = crypto.randomBytes(16);

      // Create a Decipheriv object
      const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'base64'), iv);

      // Read and decrypt the file
      const input = fs.createReadStream(`encrypted/${encryptedFileName}`);
      const output = fs.createWriteStream(`decrypted/${encryptedFileName}`);
      input.pipe(decipher).pipe(output);

      output.on('finish', () => {
        // Return the decrypted data
        resolve(fs.readFileSync(`decrypted/${encryptedFileName}`));
      });

      output.on('error', (error) => {
        console.error('Decryption error:', error);
        reject(error);
      });
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