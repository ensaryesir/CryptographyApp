const crypto = require('crypto');
const { performance } = require('perf_hooks');
const os = require('os');

// Create an ECDH key pair for ecdh
const startKeyGen = performance.now();

// Manually defined keys for ecdh
const privateKeyStr = 'b37c4f7a4c92a40e2e8c5c6e2ec3f4d8b1e8f96c5d6b2c4c5e2e8c5c6e2ec3f4';
const ecdh = crypto.createECDH('secp256k1');
ecdh.setPrivateKey(privateKeyStr, 'hex');
const endKeyGen = performance.now();

// Create an ECDH key pair for ecdh2
const startKeyGen2 = performance.now();

// Manually defined keys for ecdh2
const privateKeyStr2 = 'c37c4f7a4c92a40e2e8c5c6e2ec3f4d8b1e8f96c5d6b2c4c5e2e8c5c6e2ec3f5';
const ecdh2 = crypto.createECDH('secp256k1');
ecdh2.setPrivateKey(privateKeyStr2, 'hex');
const endKeyGen2 = performance.now();

// Compute the symmetric key and convert to Buffer
const symmetricKey = ecdh.computeSecret(ecdh2.getPublicKey(), null, 'hex');
const symmetricKeyBuffer = Buffer.from(symmetricKey, 'hex');

// Manually define IV and convert to Buffer
const IVStr = '194fbed636c9d71a222d721f13e6e541';  // This should be a 16-byte value
const IV = Buffer.from(IVStr, 'hex');

console.log(`ECC Key generation took ${endKeyGen - startKeyGen} ms.`);
console.log(`ECC Key generation 2 took ${endKeyGen2 - startKeyGen2} ms.`);

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
  
  function encrypt(jsonData) {
    const start = performance.now();

    const buffer = Buffer.from(JSON.stringify(jsonData), 'utf8');
    const cipher = crypto.createCipheriv('aes-256-cbc', symmetricKeyBuffer, IV);
    let encrypted = cipher.update(buffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    const end = performance.now();
    console.log(`Encryption took ${end - start} milliseconds.`);
    printPerformance();

    return IV.toString('hex') + ':' + encrypted.toString('hex');
  }
  
  function decrypt(encryptedData) {
    const start = performance.now();

    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', symmetricKeyBuffer, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    const end = performance.now();
    console.log(`Decryption took ${end - start} milliseconds.`);
    printPerformance();
    
    return JSON.parse(decrypted.toString());
  }

module.exports = { encrypt, decrypt };