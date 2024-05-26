const crypto = require('crypto');
const chacha = require('chacha');
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
function encryptKey(key, kek) {
  const cipher = crypto.createCipheriv('aes-256-cbc', kek, Buffer.alloc(16, 0));
  const encrypted = Buffer.concat([cipher.update(key), cipher.final()]);
  return encrypted.toString('hex');
}

// Function to save the encrypted key to the database
async function saveEncryptedKeyToDB(encryptedKey) {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('cryptographyDB');
  const collection = db.collection('chacha20_keys');

  // Save the encrypted key to the database
  await collection.insertOne({ key: encryptedKey });

  client.close();
}

// Function to encrypt a key and save it to the database
async function encryptAndSaveKey(key) {
  // Retrieve the KEK from the database
  const kek = await getKEKFromDB();

  // Encrypt the key
  const encryptedKey = encryptKey(key, kek);

  // Save the encrypted key to the database
  await saveEncryptedKeyToDB(encryptedKey);
}

// Use the function
const key = Buffer.from('81c4a227017dbd2c4e211979f94c28609413b108088e63660b00c7a79d086ba9', 'hex');
encryptAndSaveKey(key).catch(console.error);
*/

// Function to decrypt the key
function decryptKey(encryptedKey, kek) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', kek, Buffer.alloc(16, 0));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedKey, 'hex')), decipher.final()]);
  return decrypted;
}

// Function to retrieve the encrypted key from the database
async function getEncryptedKeyFromDB() {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('cryptographyDB');
  const collection = db.collection('chacha20_keys');

  // Retrieve the encrypted key from the database
  const result = await collection.findOne({});
  const encryptedKey = result.key;

  client.close();

  return encryptedKey;
}

// Function to retrieve and decrypt the key
async function retrieveAndDecryptKey() {
  // Retrieve the KEK from the database
  const kek = await getKEKFromDB();

  // Retrieve the encrypted key from the database
  const encryptedKey = await getEncryptedKeyFromDB();

  // Decrypt the key
  const key = decryptKey(encryptedKey, kek);

  return key;
}

// Use the function
retrieveAndDecryptKey().then(key => {
  //console.log(key.toString('hex'));
}).catch(console.error);




//const key = Buffer.from('81c4a227017dbd2c4e211979f94c28609413b108088e63660b00c7a79d086ba9', 'hex'); // ChaCha20 için 256 bit anahtar (32 byte)
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

    // Retrieve and decrypt the key
    const key = await retrieveAndDecryptKey();

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
    
    // Retrieve and decrypt the key
    const key = await retrieveAndDecryptKey();

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