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
function encryptKey(private1Key, private2Key, kek) {
  const cipherForPV1 = crypto.createCipheriv('aes-256-cbc', kek, Buffer.alloc(16, 0));
  const private1Encrypted = Buffer.concat([cipherForPV1.update(private1Key), cipherForPV1.final()]);

  const cipherForPV2 = crypto.createCipheriv('aes-256-cbc', kek, Buffer.alloc(16, 0));
  const private2Encrypted = Buffer.concat([cipherForPV2.update(private2Key), cipherForPV2.final()]);

  return {
    private1Encrypted: private1Encrypted.toString('hex'),
    private2Encrypted: private2Encrypted.toString('hex')
  };
}

// Function to save the encrypted keys to the database
async function saveEncryptedKeysToDB(privateEncrypted, collectionName) {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('cryptographyDB');

  const collection = db.collection(collectionName);

  // Save the encrypted key to the database
  await collection.insertOne({ key: privateEncrypted });

  client.close();
}

// Function to encrypt a key and save it to the database
async function encryptAndSaveKey(privateKey1, privateKey2) {
  // Retrieve the KEK from the database
  const kek = await getKEKFromDB();

  // Encrypt the keys
  const { private1Encrypted, private2Encrypted } = encryptKey(privateKey1, privateKey2, kek);

  // Save the encrypted keys to the database
  await saveEncryptedKeysToDB(private1Encrypted, 'ecc_private_1_keys');
  await saveEncryptedKeysToDB(private2Encrypted, 'ecc_private_2_keys');
}

// Use the function
const privateKey1Str = 'b37c4f7a4c92a40e2e8c5c6e2ec3f4d8b1e8f96c5d6b2c4c5e2e8c5c6e2ec3f4';
const privateKey2Str = 'c37c4f7a4c92a40e2e8c5c6e2ec3f4d8b1e8f96c5d6b2c4c5e2e8c5c6e2ec3f5';
encryptAndSaveKey(privateKey1Str, privateKey2Str).catch(console.error);
*/

// Function to decrypt the keys
function decryptKeys(private1Encrypted, private2Encrypted, kek) {
  try {
    const decipherForPrivate1 = crypto.createDecipheriv('aes-256-cbc', kek, Buffer.alloc(16, 0));
    const private1Decrypted = Buffer.concat([decipherForPrivate1.update(Buffer.from(private1Encrypted, 'hex')), decipherForPrivate1.final()]);

    const decipherForPrivate2 = crypto.createDecipheriv('aes-256-cbc', kek, Buffer.alloc(16, 0));
    const private2Decrypted = Buffer.concat([decipherForPrivate2.update(Buffer.from(private2Encrypted, 'hex')), decipherForPrivate2.final()]);

    return {
      private1Decrypted: private1Decrypted.toString(),
      private2Decrypted: private2Decrypted.toString()
    };
  } catch (error) {
    console.error('Failed to decrypt keys:', error);
  }
}

// Function to retrieve the encrypted keys from the database
async function getEncryptedKeysFromDB() {
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    const db = client.db('cryptographyDB');

    const private1Collection = db.collection('ecc_private_1_keys');
    const private2Collection = db.collection('ecc_private_2_keys');

    // Retrieve the encrypted keys from the database
    const private1Result = await private1Collection.findOne({});
    const private2Result = await private2Collection.findOne({});

    const private1Encrypted = private1Result.key;
    const private2Encrypted = private2Result.key;

    client.close();

    return { private1Encrypted, private2Encrypted };
  } catch (error) {
    console.error('Failed to retrieve keys from database:', error);
  }
}

// Function to retrieve and decrypt the keys
async function retrieveAndDecryptKeys() {
  try {
    // Retrieve the KEK from the database
    const kek = await getKEKFromDB();

    // Retrieve the encrypted keys from the database
    const { private1Encrypted, private2Encrypted } = await getEncryptedKeysFromDB();

    // Decrypt the keys
    const { private1Decrypted, private2Decrypted } = decryptKeys(private1Encrypted, private2Encrypted, kek);

    return { private1Decrypted, private2Decrypted };
  } catch (error) {
    console.error('Failed to retrieve and decrypt keys:', error);
  }
}

// Use the function
retrieveAndDecryptKeys().then(keys => {
  // Convert keys to Buffer
  const privateKey1 = Buffer.from(keys.private1Decrypted, 'utf8');
  const privateKey2 = Buffer.from(keys.private2Decrypted, 'utf8');

  //console.log(keys.private1Decrypted);
  //console.log(keys.private2Decrypted);

}).catch(console.error);


// Create an ECDH key pair for ecdh
// Manually defined keys for ecdh
//const privateKeyStr = 'b37c4f7a4c92a40e2e8c5c6e2ec3f4d8b1e8f96c5d6b2c4c5e2e8c5c6e2ec3f4';
// Manually defined keys for ecdh2
//const privateKeyStr2 = 'c37c4f7a4c92a40e2e8c5c6e2ec3f4d8b1e8f96c5d6b2c4c5e2e8c5c6e2ec3f5';

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

// Use the function to retrieve and decrypt keys
let symmetricKeyBuffer;
let IV;

retrieveAndDecryptKeys().then(keys => {
  // Convert keys to Buffer
  const privateKey1 = Buffer.from(keys.private1Decrypted, 'hex');
  const privateKey2 = Buffer.from(keys.private2Decrypted, 'hex');

  // Create an ECDH key pair for ecdh
  const ecdh = crypto.createECDH('secp256k1');
  ecdh.setPrivateKey(privateKey1);

  // Create an ECDH key pair for ecdh2
  const ecdh2 = crypto.createECDH('secp256k1');
  ecdh2.setPrivateKey(privateKey2);

  // Compute the symmetric key and convert to Buffer
  const symmetricKey = ecdh.computeSecret(ecdh2.getPublicKey(), null, 'hex');
  symmetricKeyBuffer = Buffer.from(symmetricKey, 'hex');

  // Manually define IV and convert to Buffer
  const IVStr = '194fbed636c9d71a222d721f13e6e541';  // This should be a 16-byte value
  IV = Buffer.from(IVStr, 'hex');

  const endKeyGen = performance.now();
  console.log(`ECC Key generation took ${endKeyGen - startKeyGen} ms.`);
}).catch(console.error);

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