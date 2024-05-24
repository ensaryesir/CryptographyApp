const crypto = require('crypto');
const { performance } = require('perf_hooks');
const os = require('os');

// Define keys
const startKeyGen = performance.now();

const publicKeyStr = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxVSCPUDevRUZLPGGSRbwgjIi3fjJWhU6AS6yONSKEc/IFqhcmEPOJkV1izfXQq9/XterrJM7f5127ay//preixRJiSgTpY7kmqXm125+Pp73sxfKogOgpAiKv22LQV+MqUBsZjKrRmIayJ62KYWsQuK+gvPBI+zWJ1RVp2PaxDVJpu/204e93vRPNBBStevTgKzFaf4cktyqxCfnwZwmgtKCF7q1wbonXtoC4muyxAT3AiQXTNHSQkTLB80LyIRR3Rw3cJk53qs3RCplAMGhdmrvJZW85xSKMQudtMVl3QnUwixWykLcVqWen0LF2kZKjjWzivpgdrTU5WIDJIplKQIDAQAB\n-----END PUBLIC KEY-----';
const privateKeyStr = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFVII9QN69FRks8YZJFvCCMiLd+MlaFToBLrI41IoRz8gWqFyYQ84mRXWLN9dCr39e16uskzt/nXbtrL/+mt6LFEmJKBOljuSapebXbn4+nvezF8qiA6CkCIq/bYtBX4ypQGxmMqtGYhrInrYphaxC4r6C88Ej7NYnVFWnY9rENUmm7/bTh73e9E80EFK169OArMVp/hyS3KrEJ+fBnCaC0oIXurXBuide2gLia7LEBPcCJBdM0dJCRMsHzQvIhFHdHDdwmTneqzdEKmUAwaF2au8llbznFIoxC520xWXdCdTCLFbKQtxWpZ6fQsXaRkqONbOK+mB2tNTlYgMkimUpAgMBAAECggEAY68sV+s0WkqVPDoKv1OCThMrv/yVIxfEBKLlT4Y29YaEqsWEeTsPog/GsHyWFs73Rh8nT3fVP8N5N9nj56euso2eFFaVjjYgT+ttMPlVdybxNJzZNX0lopfaF5gsF+s/8KRl3j7MfTLEGwLqPRGVEvjeiuK+d/qFuLqGxpfQBPuOH9SOmr6rjuVNu+9JsN9nFx/g7epcuFftcfNmvzWi7PgQ2kLvt/mscMipi5ySBauQUSkEQ7myvLHWFWWU6iJWCZEkEXThHvLCfhDsx4Y3+Rdq76cnuvZx7VQeoug2fYfpJftViiFZQ3itSu3bNjuYvP6Tg9Y32cd1nGHnavcYAQKBgQD5FFI9lsyzn/g9W6hgM4TrrSetQdO4Fey3tNCxNSfQTF2dhZ29AZpGbUvR6ASovULwYvgCbxiPmYG/9CjzfqlOeuJ8ISPdiG9iXeH/r6Wt7JPUcsKIgRxykS8Iv/M/+f1r7BjQhJjvmtvSyGa3/1TqYirRtaGyp/L7q8310LTAKQKBgQDK0BmGfImA1cb7L/AUt3whrztDlZAT6O6i9bldNNmVytvgLxOvYprGoFcUR9ur3ae2VlpFrvM2QNUlkv93q88Wn3cvSRxHHMo08kHY9+ouW3E0hE450WFFSWGG7eq7+g6rfcJ17AmExXw7u0653zCDBJLI4pggZUiRpXdJ56kdAQKBgQDLp5rqsq8iu0yMVrIgHl+zFzwWxHjozjxjpFryWYT5Ikd08Xgcvv+2T80rjqqokT73L+SakN2jJB9bpLYLCWhDO+SNG8eobdKsuhh8J9CumX3xufdnBzIMVrr/S3sHt05G/J75d0FYv+S2vpaGISX8ElHyb7ELU5kvv7TCJWh0qQKBgA2IZzufEbnECfv2zelD+QdyXtz6nNuHPm0nQlAi16X0HEnQOlsIlFVOm6DhzpmgN7Gl/24I53emSdKxBVTh5PaYe2ZvVXC1ThTMWXJ10G15cotTjLi07O2noNdVBsW2QMZWpOQjdNskJk8CB5XFe8IySu0WmZoHyBjX1qbay2EBAoGAOpyN0NQPQ4xfV8OBNFVG9RubnZuekF2q+f8pthHypbG6FIpOvpBc/BbIoyKAqBDOge+ZkhM5muWa318iYzfsek0dkC4+Oev7mhT8aO+fwRHWdk+K1vcNcLNc1owj2rzHE5eSlKLp++IzM3jWG4iX3aXJMDkLXTb8JQMCM1hD6HA=\n-----END PRIVATE KEY-----';

// Convert keys to Buffer
const publicKey = Buffer.from(publicKeyStr, 'utf8');
const privateKey = Buffer.from(privateKeyStr, 'utf8');

const endKeyGen = performance.now();

console.log(`RSA Public Key and Private Key generation took ${endKeyGen - startKeyGen} ms.`);

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

    const buffer = Buffer.from(JSON.stringify(jsonData), 'utf8');
    const chunkSize = 200; // Adjust this value based on your key size
    let encrypted = '';

    for (let i = 0; i < buffer.length; i += chunkSize) {
      const chunk = buffer.slice(i, i + chunkSize);
      encrypted += crypto.publicEncrypt(publicKey, chunk).toString('base64');
    }

    const end = performance.now();
    console.log(`RSA Encryption took ${end - start} milliseconds.`);
    printPerformance();

    return encrypted;
  } catch (error) {
    console.error('Şifreleme Hatası:', error);
  }
}

async function decrypt(encryptedData) {
  try {
    const start = performance.now();

    const chunkSize = 344; // Adjust this value based on your key size and base64 encoding
    let decrypted = '';

    for (let i = 0; i < encryptedData.length; i += chunkSize) {
      const chunk = encryptedData.slice(i, i + chunkSize);
      const buffer = Buffer.from(chunk, 'base64');
      decrypted += crypto.privateDecrypt(privateKey, buffer).toString('utf8');
    }

    const end = performance.now();
    console.log(`RSA Decryption took ${end - start} milliseconds.`);
    printPerformance();

    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Deşifreleme Hatası:', error);
  }
}

module.exports = { encrypt, decrypt };