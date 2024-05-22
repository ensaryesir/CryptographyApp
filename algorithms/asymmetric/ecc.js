// const crypto = require('crypto');

// // Define keys
// console.time('ECC Public-Private Key and IV Generation Time');

// const privateKeyStr = `
// -----BEGIN EC PRIVATE KEY-----
// MHQCAQEEIPRyBvvEFg7uZcQhESeN5U3z32DsgCODLkKSVfpwmcPBoAcGBSuBBAAK
// oUQDQgAEwPXoC7IWbMEpBW1RnU/35upWxAgGe7mp4b7jv5BTWOrhzMWBXdiLFZIO
// 5e+Anc03DWNytPuGZuSIO9iiEE+KvA==
// -----END EC PRIVATE KEY-----
// `;

// const publicKeyStr = `
// -----BEGIN PUBLIC KEY-----
// MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEwPXoC7IWbMEpBW1RnU/35upWxAgGe7mp
// 4b7jv5BTWOrhzMWBXdiLFZIO5e+Anc03DWNytPuGZuSIO9iiEE+KvA==
// -----END PUBLIC KEY-----
// `;

// // Create an ECDH key pair
// const ecdh = crypto.createECDH('secp256k1');
// ecdh.setPrivateKey(privateKeyStr, 'base64');

// // Compute the symmetric key and convert to Buffer
// const symmetricKey = ecdh.computeSecret(publicKeyStr, 'base64', 'hex');
// const symmetricKeyBuffer = Buffer.from(symmetricKey, 'hex');

// // Define IV and convert to Buffer
// const IVStr = '194fbed636c9d71a222d721f13e6e541';  // This should be a 16-byte value
// const IV = Buffer.from(IVStr, 'hex');
// console.timeEnd('ECC Public-Private Key and IV Generation Time');

// function encrypt(jsonData) {
//   console.time('Encryption Time');
//   const initialMemoryUsage = process.memoryUsage().heapUsed;
//   const startCpuUsage = process.cpuUsage();

//   const buffer = Buffer.from(JSON.stringify(jsonData), 'utf8');
//   const cipher = crypto.createCipheriv('aes-256-cbc', symmetricKeyBuffer, IV);
//   let encrypted = cipher.update(buffer);
//   encrypted = Buffer.concat([encrypted, cipher.final()]);

//   console.timeEnd('Encryption Time');
//   console.log('Encryption Memory Usage:', process.memoryUsage().heapUsed - initialMemoryUsage, 'bytes');
//   const cpuUsage = process.cpuUsage(startCpuUsage);
//   console.log('Encryption CPU Usage:', cpuUsage.user + cpuUsage.system, 'microseconds');

//   return IV.toString('hex') + ':' + encrypted.toString('hex');
// }

// function decrypt(encryptedData) {
//   console.time('Decryption Time');
//   const initialMemoryUsage = process.memoryUsage().heapUsed;
//   const startCpuUsage = process.cpuUsage();

//   const textParts = encryptedData.split(':');
//   const iv = Buffer.from(textParts.shift(), 'hex');
//   const encryptedText = Buffer.from(textParts.join(':'), 'hex');
//   const decipher = crypto.createDecipheriv('aes-256-cbc', symmetricKeyBuffer, iv);
//   let decrypted = decipher.update(encryptedText);
//   decrypted = Buffer.concat([decrypted, decipher.final()]);

//   console.timeEnd('Decryption Time');
//   console.log('Decryption Memory Usage:', process.memoryUsage().heapUsed - initialMemoryUsage, 'bytes');
//   const cpuUsage = process.cpuUsage(startCpuUsage);
//   console.log('Decryption CPU Usage:', cpuUsage.user + cpuUsage.system, 'microseconds');

//   return JSON.parse(decrypted.toString());
// }

// module.exports = {
//   encrypt,
//   decrypt
// };