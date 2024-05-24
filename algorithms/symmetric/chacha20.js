const chacha = require('chacha');
const { performance } = require('perf_hooks');
const os = require('os');

// Define key and nonce as constants
const startKeyGen = performance.now();

const key = Buffer.from('81c4a227017dbd2c4e211979f94c28609413b108088e63660b00c7a79d086ba9', 'hex'); // ChaCha20 için 256 bit anahtar (32 byte)
const nonce = Buffer.from('3a4d17813d319eadd8a6fe7e', 'hex'); // ChaCha20 için 64 bit nonce (8 byte)

const endKeyGen = performance.now();

console.log(`ChaCha20 Key and Nonce generation took ${endKeyGen - startKeyGen} ms.`);

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

    const cipher = chacha.createCipher(key, nonce);
    let encryptedData = cipher.update(Buffer.from(JSON.stringify(jsonData), 'utf8'));
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);

    const end = performance.now();
    console.log(`ChaCha20 Encryption took ${end - start} milliseconds.`);
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

    const decipher = chacha.createDecipher(key, nonce);
    
    // Düzeltme: decipher.final() çağrısını kaldırın
    let decryptedData = Buffer.from(decipher.update(Buffer.from(encryptedData, 'hex'))); // Convert encryptedData from hexadecimal string to Buffer
    decryptedData = Buffer.concat([decryptedData]); // Şifre çözme işlemini tamamla
    
    const end = performance.now();
    console.log(`ChaCha20 Decryption took ${end - start} milliseconds.`);
    printPerformance();

    return JSON.parse(decryptedData.toString('utf8'));
  } catch (error) {
    console.error('Deşifreleme Hatası:', error);
    throw new Error('Deşifreleme işlemi sırasında bir hata oluştu.');     
  }
}

module.exports = { encrypt, decrypt };