const chacha = require('chacha-native');
const crypto = require('crypto');

// Define key and nonce as constants
console.time('ChaCha20 Key and Nonce Generation Time');
const key = Buffer.from('81c4a227017dbd2c4e211979f94c28609413b108088e63660b00c7a79d086ba9', 'hex'); // ChaCha20 için 256 bit anahtar (32 byte)
const nonce = Buffer.from('3a4d17813d319eadd8a6fe7e', 'hex'); // ChaCha20 için 64 bit nonce (8 byte)
console.timeEnd('ChaCha20 Key and Nonce Generation Time');

async function encrypt(jsonData) {
  try {
    console.time('ChaCha20 Encryption Time');
    const initialMemoryUsage = process.memoryUsage().heapUsed;
    const startCpuUsage = process.cpuUsage();

    const cipher = chacha.createCipher(key, nonce);
    let encryptedData = cipher.update(Buffer.from(JSON.stringify(jsonData), 'utf8'));
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);

    console.timeEnd('ChaCha20 Encryption Time');
    console.log('ChaCha20 Encryption Memory Usage:', process.memoryUsage().heapUsed - initialMemoryUsage, 'bytes');
    const cpuUsage = process.cpuUsage(startCpuUsage);
    console.log('ChaCha20 Encryption CPU Usage:', cpuUsage.user + cpuUsage.system, 'microseconds');

    return encryptedData.toString('hex'); // Convert encryptedData to hexadecimal string
  } catch (error) {
    console.error('Şifreleme Hatası:', error);
    throw new Error('Şifreleme işlemi sırasında bir hata oluştu.');   
  }
}

async function decrypt(encryptedData) {
  try {
    console.time('ChaCha20 Decryption Time');
    const initialMemoryUsage = process.memoryUsage().heapUsed;
    const startCpuUsage = process.cpuUsage();
    const decipher = chacha.createDecipher(key, nonce);
    
    // Düzeltme: decipher.final() çağrısını kaldırın
    let decryptedData = Buffer.from(decipher.update(Buffer.from(encryptedData, 'hex'))); // Convert encryptedData from hexadecimal string to Buffer
    decryptedData = Buffer.concat([decryptedData]); // Şifre çözme işlemini tamamla
    
    console.timeEnd('ChaCha20 Decryption Time');
    console.log('ChaCha20 Decryption Memory Usage:', process.memoryUsage().heapUsed - initialMemoryUsage, 'bytes');
    const cpuUsage = process.cpuUsage(startCpuUsage);
    console.log('ChaCha20 Decryption CPU Usage:', cpuUsage.user + cpuUsage.system, 'microseconds');
    return JSON.parse(decryptedData.toString('utf8'));
  } catch (error) {
    console.error('Deşifreleme Hatası:', error);
    throw new Error('Deşifreleme işlemi sırasında bir hata oluştu.');     
  }
}

module.exports = {
  encrypt,
  decrypt
};