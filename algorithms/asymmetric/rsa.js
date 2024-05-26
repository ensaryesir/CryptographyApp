const crypto = require('crypto');
const { performance } = require('perf_hooks');
const os = require('os');
const MongoClient = require('mongodb').MongoClient;

const startKeyGen = performance.now();
/*
// Function to generate a KEK and save it to the database
async function generateAndSaveKEK() {
  const kek = crypto.randomBytes(32); // Generate a 256-bit KEK
  await saveKEKToDB(kek); // Save the KEK to the database
}

// Call the function to generate and save the KEK
generateAndSaveKEK().catch(console.error);
*/

/*
// Function to save the KEK to the database
async function saveKEKToDB(kek) {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('cryptographyDB');
  const collection = db.collection('kek');

  // Save the KEK to the database
  await collection.insertOne({ kek: kek.toString('hex') });

  client.close();
}
*/

// Function to retrieve the KEK from the database
async function getKEKFromDB() {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('cryptographyDB');
  const collection = db.collection('kek');

  // Retrieve the KEK from the database
  const result = await collection.findOne({});
  const kekHex = result.kek;

  client.close();

  return Buffer.from(kekHex, 'hex');
}

/*
// Function to encrypt the key
function encryptKey(publicKey, privateKey, kek) {
  const cipherForPublic = crypto.createCipheriv('aes-256-cbc', kek, Buffer.alloc(16, 0));
  const publicEncrypted = Buffer.concat([cipherForPublic.update(publicKey), cipherForPublic.final()]);

  const cipherForPrivate = crypto.createCipheriv('aes-256-cbc', kek, Buffer.alloc(16, 0));
  const privateEncrypted = Buffer.concat([cipherForPrivate.update(privateKey), cipherForPrivate.final()]);

  return {
    publicEncrypted: publicEncrypted.toString('hex'),
    privateEncrypted: privateEncrypted.toString('hex')
  };
}

// Function to save the encrypted keys to the database
async function saveEncryptedKeysToDB(publicEncrypted, privateEncrypted) {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('cryptographyDB');

  const publicCollection = db.collection('rsa_public_keys');
  const privateCollection = db.collection('rsa_private_keys');

  // Save the encrypted keys to the database
  await publicCollection.insertOne({ key: publicEncrypted });
  await privateCollection.insertOne({ key: privateEncrypted });

  client.close();
}

// Function to encrypt a key pair and save them to the database
async function encryptAndSaveKey(publicKey, privateKey) {
  // Retrieve the KEK from the database
  const kek = await getKEKFromDB();

  // Encrypt the key pair
  const { publicEncrypted, privateEncrypted } = encryptKey(publicKey, privateKey, kek);

  // Save the encrypted keys to the database
  await saveEncryptedKeysToDB(publicEncrypted, privateEncrypted);
}

// Use the function
const publicKeyStr = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxVSCPUDevRUZLPGGSRbwgjIi3fjJWhU6AS6yONSKEc/IFqhcmEPOJkV1izfXQq9/XterrJM7f5127ay//preixRJiSgTpY7kmqXm125+Pp73sxfKogOgpAiKv22LQV+MqUBsZjKrRmIayJ62KYWsQuK+gvPBI+zWJ1RVp2PaxDVJpu/204e93vRPNBBStevTgKzFaf4cktyqxCfnwZwmgtKCF7q1wbonXtoC4muyxAT3AiQXTNHSQkTLB80LyIRR3Rw3cJk53qs3RCplAMGhdmrvJZW85xSKMQudtMVl3QnUwixWykLcVqWen0LF2kZKjjWzivpgdrTU5WIDJIplKQIDAQAB\n-----END PUBLIC KEY-----';
const privateKeyStr = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFVII9QN69FRks8YZJFvCCMiLd+MlaFToBLrI41IoRz8gWqFyYQ84mRXWLN9dCr39e16uskzt/nXbtrL/+mt6LFEmJKBOljuSapebXbn4+nvezF8qiA6CkCIq/bYtBX4ypQGxmMqtGYhrInrYphaxC4r6C88Ej7NYnVFWnY9rENUmm7/bTh73e9E80EFK169OArMVp/hyS3KrEJ+fBnCaC0oIXurXBuide2gLia7LEBPcCJBdM0dJCRMsHzQvIhFHdHDdwmTneqzdEKmUAwaF2au8llbznFIoxC520xWXdCdTCLFbKQtxWpZ6fQsXaRkqONbOK+mB2tNTlYgMkimUpAgMBAAECggEAY68sV+s0WkqVPDoKv1OCThMrv/yVIxfEBKLlT4Y29YaEqsWEeTsPog/GsHyWFs73Rh8nT3fVP8N5N9nj56euso2eFFaVjjYgT+ttMPlVdybxNJzZNX0lopfaF5gsF+s/8KRl3j7MfTLEGwLqPRGVEvjeiuK+d/qFuLqGxpfQBPuOH9SOmr6rjuVNu+9JsN9nFx/g7epcuFftcfNmvzWi7PgQ2kLvt/mscMipi5ySBauQUSkEQ7myvLHWFWWU6iJWCZEkEXThHvLCfhDsx4Y3+Rdq76cnuvZx7VQeoug2fYfpJftViiFZQ3itSu3bNjuYvP6Tg9Y32cd1nGHnavcYAQKBgQD5FFI9lsyzn/g9W6hgM4TrrSetQdO4Fey3tNCxNSfQTF2dhZ29AZpGbUvR6ASovULwYvgCbxiPmYG/9CjzfqlOeuJ8ISPdiG9iXeH/r6Wt7JPUcsKIgRxykS8Iv/M/+f1r7BjQhJjvmtvSyGa3/1TqYirRtaGyp/L7q8310LTAKQKBgQDK0BmGfImA1cb7L/AUt3whrztDlZAT6O6i9bldNNmVytvgLxOvYprGoFcUR9ur3ae2VlpFrvM2QNUlkv93q88Wn3cvSRxHHMo08kHY9+ouW3E0hE450WFFSWGG7eq7+g6rfcJ17AmExXw7u0653zCDBJLI4pggZUiRpXdJ56kdAQKBgQDLp5rqsq8iu0yMVrIgHl+zFzwWxHjozjxjpFryWYT5Ikd08Xgcvv+2T80rjqqokT73L+SakN2jJB9bpLYLCWhDO+SNG8eobdKsuhh8J9CumX3xufdnBzIMVrr/S3sHt05G/J75d0FYv+S2vpaGISX8ElHyb7ELU5kvv7TCJWh0qQKBgA2IZzufEbnECfv2zelD+QdyXtz6nNuHPm0nQlAi16X0HEnQOlsIlFVOm6DhzpmgN7Gl/24I53emSdKxBVTh5PaYe2ZvVXC1ThTMWXJ10G15cotTjLi07O2noNdVBsW2QMZWpOQjdNskJk8CB5XFe8IySu0WmZoHyBjX1qbay2EBAoGAOpyN0NQPQ4xfV8OBNFVG9RubnZuekF2q+f8pthHypbG6FIpOvpBc/BbIoyKAqBDOge+ZkhM5muWa318iYzfsek0dkC4+Oev7mhT8aO+fwRHWdk+K1vcNcLNc1owj2rzHE5eSlKLp++IzM3jWG4iX3aXJMDkLXTb8JQMCM1hD6HA=\n-----END PRIVATE KEY-----';
encryptAndSaveKey(publicKeyStr, privateKeyStr).catch(console.error);
*/

// Function to decrypt the keys
function decryptKeys(publicEncrypted, privateEncrypted, kek) {
  const decipherForPublic = crypto.createDecipheriv('aes-256-cbc', kek, Buffer.alloc(16, 0));
  const publicDecrypted = Buffer.concat([decipherForPublic.update(Buffer.from(publicEncrypted, 'hex')), decipherForPublic.final()]);

  const decipherForPrivate = crypto.createDecipheriv('aes-256-cbc', kek, Buffer.alloc(16, 0));
  const privateDecrypted = Buffer.concat([decipherForPrivate.update(Buffer.from(privateEncrypted, 'hex')), decipherForPrivate.final()]);

  return {
    publicDecrypted: publicDecrypted.toString(),
    privateDecrypted: privateDecrypted.toString()
  };
}

// Function to retrieve the encrypted keys from the database
async function getEncryptedKeysFromDB() {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('cryptographyDB');

  const publicCollection = db.collection('rsa_public_keys');
  const privateCollection = db.collection('rsa_private_keys');

  // Retrieve the encrypted keys from the database
  const publicResult = await publicCollection.findOne({});
  const privateResult = await privateCollection.findOne({});

  const publicEncrypted = publicResult.key;
  const privateEncrypted = privateResult.key;

  client.close();

  return { publicEncrypted, privateEncrypted };
}

// Function to retrieve and decrypt the keys
async function retrieveAndDecryptKeys() {
  // Retrieve the KEK from the database
  const kek = await getKEKFromDB();

  // Retrieve the encrypted keys from the database
  const { publicEncrypted, privateEncrypted } = await getEncryptedKeysFromDB();

  // Decrypt the keys
  const { publicDecrypted, privateDecrypted } = decryptKeys(publicEncrypted, privateEncrypted, kek);

  return { publicDecrypted, privateDecrypted };
}

// Use the function
retrieveAndDecryptKeys().then(keys => {
  // Convert keys to Buffer
  const publicKey = Buffer.from(keys.publicDecrypted, 'utf8');
  const privateKey = Buffer.from(keys.privateDecrypted, 'utf8');

  //console.log(keys.publicDecrypted);
  //console.log(keys.privateDecrypted);

}).catch(console.error);




// Define keys
//const publicKeyStr = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxVSCPUDevRUZLPGGSRbwgjIi3fjJWhU6AS6yONSKEc/IFqhcmEPOJkV1izfXQq9/XterrJM7f5127ay//preixRJiSgTpY7kmqXm125+Pp73sxfKogOgpAiKv22LQV+MqUBsZjKrRmIayJ62KYWsQuK+gvPBI+zWJ1RVp2PaxDVJpu/204e93vRPNBBStevTgKzFaf4cktyqxCfnwZwmgtKCF7q1wbonXtoC4muyxAT3AiQXTNHSQkTLB80LyIRR3Rw3cJk53qs3RCplAMGhdmrvJZW85xSKMQudtMVl3QnUwixWykLcVqWen0LF2kZKjjWzivpgdrTU5WIDJIplKQIDAQAB\n-----END PUBLIC KEY-----';
//const privateKeyStr = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFVII9QN69FRks8YZJFvCCMiLd+MlaFToBLrI41IoRz8gWqFyYQ84mRXWLN9dCr39e16uskzt/nXbtrL/+mt6LFEmJKBOljuSapebXbn4+nvezF8qiA6CkCIq/bYtBX4ypQGxmMqtGYhrInrYphaxC4r6C88Ej7NYnVFWnY9rENUmm7/bTh73e9E80EFK169OArMVp/hyS3KrEJ+fBnCaC0oIXurXBuide2gLia7LEBPcCJBdM0dJCRMsHzQvIhFHdHDdwmTneqzdEKmUAwaF2au8llbznFIoxC520xWXdCdTCLFbKQtxWpZ6fQsXaRkqONbOK+mB2tNTlYgMkimUpAgMBAAECggEAY68sV+s0WkqVPDoKv1OCThMrv/yVIxfEBKLlT4Y29YaEqsWEeTsPog/GsHyWFs73Rh8nT3fVP8N5N9nj56euso2eFFaVjjYgT+ttMPlVdybxNJzZNX0lopfaF5gsF+s/8KRl3j7MfTLEGwLqPRGVEvjeiuK+d/qFuLqGxpfQBPuOH9SOmr6rjuVNu+9JsN9nFx/g7epcuFftcfNmvzWi7PgQ2kLvt/mscMipi5ySBauQUSkEQ7myvLHWFWWU6iJWCZEkEXThHvLCfhDsx4Y3+Rdq76cnuvZx7VQeoug2fYfpJftViiFZQ3itSu3bNjuYvP6Tg9Y32cd1nGHnavcYAQKBgQD5FFI9lsyzn/g9W6hgM4TrrSetQdO4Fey3tNCxNSfQTF2dhZ29AZpGbUvR6ASovULwYvgCbxiPmYG/9CjzfqlOeuJ8ISPdiG9iXeH/r6Wt7JPUcsKIgRxykS8Iv/M/+f1r7BjQhJjvmtvSyGa3/1TqYirRtaGyp/L7q8310LTAKQKBgQDK0BmGfImA1cb7L/AUt3whrztDlZAT6O6i9bldNNmVytvgLxOvYprGoFcUR9ur3ae2VlpFrvM2QNUlkv93q88Wn3cvSRxHHMo08kHY9+ouW3E0hE450WFFSWGG7eq7+g6rfcJ17AmExXw7u0653zCDBJLI4pggZUiRpXdJ56kdAQKBgQDLp5rqsq8iu0yMVrIgHl+zFzwWxHjozjxjpFryWYT5Ikd08Xgcvv+2T80rjqqokT73L+SakN2jJB9bpLYLCWhDO+SNG8eobdKsuhh8J9CumX3xufdnBzIMVrr/S3sHt05G/J75d0FYv+S2vpaGISX8ElHyb7ELU5kvv7TCJWh0qQKBgA2IZzufEbnECfv2zelD+QdyXtz6nNuHPm0nQlAi16X0HEnQOlsIlFVOm6DhzpmgN7Gl/24I53emSdKxBVTh5PaYe2ZvVXC1ThTMWXJ10G15cotTjLi07O2noNdVBsW2QMZWpOQjdNskJk8CB5XFe8IySu0WmZoHyBjX1qbay2EBAoGAOpyN0NQPQ4xfV8OBNFVG9RubnZuekF2q+f8pthHypbG6FIpOvpBc/BbIoyKAqBDOge+ZkhM5muWa318iYzfsek0dkC4+Oev7mhT8aO+fwRHWdk+K1vcNcLNc1owj2rzHE5eSlKLp++IzM3jWG4iX3aXJMDkLXTb8JQMCM1hD6HA=\n-----END PRIVATE KEY-----';

// Convert keys to Buffer
//const publicKey = Buffer.from(publicKeyStr, 'utf8');
//const privateKey = Buffer.from(privateKeyStr, 'utf8');

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

    const keys = await retrieveAndDecryptKeys();
    const publicKey = Buffer.from(keys.publicDecrypted, 'utf8');

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

    const keys = await retrieveAndDecryptKeys();
    const privateKey = Buffer.from(keys.privateDecrypted, 'utf8');

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