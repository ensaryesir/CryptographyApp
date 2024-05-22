// const crypto = require('crypto');
// const twofish = require('twofish');

// const key = Buffer.from('y43d19b66e25b65607b852724758c050a1a85851a4cdfa01298bbc932ea02c262', 'hex'); // 32 bytes key
// const BLOCK_SIZE = 16; // Twofish blok boyutu

// function pad(data) {
//   const paddingNeeded = BLOCK_SIZE - (data.length % BLOCK_SIZE);
//   const padding = Buffer.alloc(paddingNeeded, paddingNeeded);
//   return Buffer.concat([data, padding]);
// }

// function unpad(data) {
//   const paddingLength = data[data.length - 1];
//   return data.slice(0, data.length - paddingLength);
// }

// async function encrypt(jsonData) {
//   try {
//     console.time('Twofish Encryption Time');
//     const initialMemoryUsage = process.memoryUsage().heapUsed;
//     const startCpuUsage = process.cpuUsage();

//     const cipher = twofish(key);
//     const paddedData = pad(Buffer.from(JSON.stringify(jsonData), 'utf8')); // Padding ekleyin
//     let encryptedData = cipher.encrypt(paddedData);
//     encryptedData = Buffer.concat([encryptedData, cipher.final()]);

//     console.timeEnd('Twofish Encryption Time');
//     console.log('Twofish Encryption Memory Usage:', process.memoryUsage().heapUsed - initialMemoryUsage, 'bytes');
//     const cpuUsage = process.cpuUsage(startCpuUsage);
//     console.log('Twofish Encryption CPU Usage:', cpuUsage.user + cpuUsage.system, 'microseconds');

//     return encryptedData.toString('hex');
//   } catch (error) {
//     console.error('Şifreleme Hatası:', error);
//     throw new Error('Şifreleme işlemi sırasında bir hata oluştu.');   
//   }
// }

// async function decrypt(encryptedData) {
//   try {
//     console.time('Twofish Decryption Time');
//     const initialMemoryUsage = process.memoryUsage().heapUsed;
//     const startCpuUsage = process.cpuUsage();

//     const decipher = twofish(key);
//     let decryptedData = decipher.decrypt(Buffer.from(encryptedData, 'hex'));
//     decryptedData = Buffer.concat([decryptedData, decipher.final()]);
//     decryptedData = unpad(decryptedData); // Padding kaldırın

//     console.timeEnd('Twofish Decryption Time');
//     console.log('Twofish Decryption Memory Usage:', process.memoryUsage().heapUsed - initialMemoryUsage, 'bytes');
//     const cpuUsage = process.cpuUsage(startCpuUsage);
//     console.log('Twofish Decryption CPU Usage:', cpuUsage.user + cpuUsage.system, 'microseconds');

//     return JSON.parse(decryptedData.toString('utf8'));
//   } catch (error) {
//     console.error('Deşifreleme Hatası:', error);
//     throw new Error('Deşifreleme işlemi sırasında bir hata oluştu.');  
//   }
// }

// module.exports = {
//   encrypt,
//   decrypt
// };