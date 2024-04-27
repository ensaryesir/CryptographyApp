const aes = require('../algorithms/symmetric/aes');
const tdea = require('../algorithms/symmetric/tdea');
const dsa = require('../algorithms/asymmetric/dsa');
const ecc = require('../algorithms/asymmetric/ecc');
const rsa = require('../algorithms/asymmetric/rsa');
const { connectToMongoDB, getAsymmetricCollection, getSymmetricCollection, getUsersCollection } = require('../model/databaseModel');


// Kullanıcıdan gelen veriyi şifrelemek için simetrik algoritmayı kullan
async function encryptDataSymmetric(data, algorithm) {
  // Simetrik algoritma seçimi ve şifreleme işlemi
  let encryptedData;
  if (algorithm === 'aes') {
    encryptedData = aes.encrypt(data);
  } else if (algorithm === 'tdea') {
    encryptedData = tdea.encrypt(data);
  } else {
    throw new Error('Geçersiz simetrik şifreleme algoritması');
  }
  return encryptedData;
}

// Kullanıcıdan gelen veriyi şifrelemek için asimetrik algoritmayı kullan
async function encryptDataAsymmetric(data, algorithm) {
  // Asimetrik algoritma seçimi ve şifreleme işlemi
  let encryptedData;
  if (algorithm === 'dsa') {
    encryptedData = dsa.encrypt(data);
  } else if (algorithm === 'ecc') {
    encryptedData = ecc.encrypt(data);
  } else if (algorithm === 'rsa') {
    encryptedData = rsa.encrypt(data);
  } else {
    throw new Error('Geçersiz asimetrik şifreleme algoritması');
  }
  return encryptedData;
}

// Kullanıcıdan gelen veriyi şifrelemek için uygun algoritmayı seçip şifreleme işlemini gerçekleştir
async function encryptData(data, algorithm) {
  let encryptedData;
  if (algorithm === 'symmetric') {
    encryptedData = await encryptDataSymmetric(data, algorithm);
  } else if (algorithm === 'asymmetric') {
    encryptedData = await encryptDataAsymmetric(data, algorithm);
  } else {
    throw new Error('Geçersiz şifreleme algoritması');
  }
  return encryptedData;
}

module.exports = {
  encryptData,
};
