const crypto = require('crypto');

// Define key and iv as constants
const key = Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef', 'hex'); // TDEA için 192 bit anahtar (24 byte)
const iv = Buffer.from('0123456789abcdef', 'hex'); // TDEA için 64 bit IV (8 byte)

async function encrypt(jsonData) {
  try {
    console.time('TDEA Encryption Time');
    const initialMemoryUsage = process.memoryUsage().heapUsed;
    const startCpuUsage = process.cpuUsage();

    const cipher = crypto.createCipheriv('des-ede3-cbc', key, iv);
    let encryptedData = cipher.update(Buffer.from(JSON.stringify(jsonData), 'utf8'));
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);

    console.timeEnd('TDEA Encryption Time');
    console.log('TDEA Encryption Memory Usage:', process.memoryUsage().heapUsed - initialMemoryUsage, 'bytes');
    const cpuUsage = process.cpuUsage(startCpuUsage);
    console.log('TDEA Encryption CPU Usage:', cpuUsage.user + cpuUsage.system, 'microseconds' + "\n");

    return encryptedData.toString('hex'); // Convert encryptedData to hexadecimal string
  } catch (error) {
    console.error('Şifreleme Hatası:', error);
    throw new Error('Şifreleme işlemi sırasında bir hata oluştu.');
  }
}

async function decrypt(encryptedData) {
  try {
    console.time('TDEA Decryption Time');
    const initialMemoryUsage = process.memoryUsage().heapUsed;
    const startCpuUsage = process.cpuUsage();

    const decipher = crypto.createDecipheriv('des-ede3-cbc', key, iv);
    let decryptedData = decipher.update(Buffer.from(encryptedData, 'hex')); // Convert encryptedData from hexadecimal string to Buffer
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);

    console.timeEnd('TDEA Decryption Time');
    console.log('TDEA Decryption Memory Usage:', process.memoryUsage().heapUsed - initialMemoryUsage, 'bytes');
    const cpuUsage = process.cpuUsage(startCpuUsage);
    console.log('TDEA Decryption CPU Usage:', cpuUsage.user + cpuUsage.system, 'microseconds');

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