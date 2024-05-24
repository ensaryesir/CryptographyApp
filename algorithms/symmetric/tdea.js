const crypto = require('crypto');
const { performance } = require('perf_hooks');
const os = require('os');

// Define key and iv as constants
const startKeyGen = performance.now();

const key = Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef', 'hex'); // TDEA için 192 bit anahtar (24 byte)
const iv = Buffer.from('0123456789abcdef', 'hex'); // TDEA için 64 bit IV (8 byte)

const endKeyGen = performance.now();

console.log(`TDEA Key and IV generation took ${endKeyGen - startKeyGen} ms.`);

function printPerformance() {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Memory usage: ${Math.round(used * 100) / 100} MB`);

    const cpus = os.cpus();
    let totalIdle = 0, totalTick = 0;
    for (let cpu of cpus) {
      for (let type in cpu.times) {
        totalTick += cpu.times[type];
      } 
      totalIdle += cpu.times.idle;
    }
    const cpuUsage = 1 - totalIdle / totalTick;
    console.log(`CPU usage: ${(cpuUsage * 100).toFixed(2)}%\n`);
}

async function encrypt(jsonData) {
  try {
    const start = performance.now();

    const cipher = crypto.createCipheriv('des-ede3-cbc', key, iv);
    let encryptedData = cipher.update(Buffer.from(JSON.stringify(jsonData), 'utf8'));
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);

    const end = performance.now();
    console.log(`TDEA Encryption took ${end - start} milliseconds.`);
    printPerformance();

    return encryptedData.toString('hex'); // Convert encryptedData to hexadecimal string
  } catch (error) {
    console.error('Şifreleme Hatası:', error);
    throw new Error('Şifreleme işlemi sırasında bir hata oluştu.');
  }
}

async function decrypt(encryptedData) {
  try {
    const start = performance.now();

    const decipher = crypto.createDecipheriv('des-ede3-cbc', key, iv);
    let decryptedData = decipher.update(Buffer.from(encryptedData, 'hex')); // Convert encryptedData from hexadecimal string to Buffer
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);

    const end = performance.now();
    console.log(`TDEA Decryption took ${end - start} milliseconds.`);
    printPerformance();

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

module.exports = { encrypt, decrypt };