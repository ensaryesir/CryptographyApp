const crypto = require('crypto');
const fs = require('fs').promises;

// Define key and iv as constants
console.time('AES Key and IV Generation Time');
const key = Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex'); // AES için 256 bit anahtar (32 byte)
const iv = Buffer.from('0123456789abcdef0123456789abcdef', 'hex'); // AES için 128 bit IV (16 byte)
console.timeEnd('AES Key and IV Generation Time');

async function encrypt(jsonData) {
  try {
    console.time('AES Encryption Time');
    const initialMemoryUsage = process.memoryUsage().heapUsed;
    const startCpuUsage = process.cpuUsage();

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedData = cipher.update(Buffer.from(JSON.stringify(jsonData), 'utf8'));
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);

    console.timeEnd('AES Encryption Time');
    console.log('AES Encryption Memory Usage:', process.memoryUsage().heapUsed - initialMemoryUsage, 'bytes');
    const cpuUsage = process.cpuUsage(startCpuUsage);
    console.log('AES Encryption CPU Usage:', cpuUsage.user + cpuUsage.system, 'microseconds' + "\n");

    return encryptedData.toString('hex'); // Convert encryptedData to hexadecimal string
  } catch (error) {
    console.error('Şifreleme Hatası:', error);
    throw new Error('Şifreleme işlemi sırasında bir hata oluştu.');   
  }
}

async function decrypt(encryptedData) {
  try {
    console.time('AES Decryption Time');
    const initialMemoryUsage = process.memoryUsage().heapUsed;
    const startCpuUsage = process.cpuUsage();

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decryptedData = decipher.update(Buffer.from(encryptedData, 'hex')); // Convert encryptedData from hexadecimal string to Buffer
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);

    console.timeEnd('AES Decryption Time');
    console.log('AES Decryption Memory Usage:', process.memoryUsage().heapUsed - initialMemoryUsage, 'bytes');
    const cpuUsage = process.cpuUsage(startCpuUsage);
    console.log('AES Decryption CPU Usage:', cpuUsage.user + cpuUsage.system, 'microseconds');

    return JSON.parse(decryptedData.toString('utf8')); // Convert to JSON object
  } catch (error) {
    console.error('Şifre Çözme Hatası:', error);
    if (error.code === 'ERR_OSSL_EVP_BAD_DECRYPT') {
      throw new Error('Geçersiz anahtar veya IV.');
    } else {
      throw new Error('Şifre çözme işlemi sırasında bir hata oluştu.');
    }
  }
}

module.exports = {
  encrypt,
  decrypt
};