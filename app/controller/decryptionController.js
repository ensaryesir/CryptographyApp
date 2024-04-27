const aes = require('../algorithms/symmetric/aes');
const tdea = require('../algorithms/symmetric/tdea');
const dsa = require('../algorithms/asymmetric/dsa');
const ecc = require('../algorithms/asymmetric/ecc');
const rsa = require('../algorithms/asymmetric/rsa');
const { connectToMongoDB, getAsymmetricCollection, getSymmetricCollection, getUsersCollection } = require('../model/databaseModel');


// Simetrik algoritma kullanarak veriyi şifreyi çözme
async function decryptDataSymmetric(data, algorithm) {
  let decryptedData;
  if (algorithm === 'aes') {
    decryptedData = aes.decrypt(data);
  } else if (algorithm === 'tdea') {
    decryptedData = tdea.decrypt(data);
  } else {
    throw new Error('Geçersiz simetrik şifreleme algoritması');
  }
  return decryptedData;
}

// Asimetrik algoritma kullanarak veriyi şifreyi çözme
async function decryptDataAsymmetric(data, algorithm) {
  let decryptedData;
  if (algorithm === 'dsa') {
    decryptedData = dsa.decrypt(data);
  } else if (algorithm === 'ecc') {
    decryptedData = ecc.decrypt(data);
  } else if (algorithm === 'rsa') {
    decryptedData = rsa.decrypt(data);
  } else {
    throw new Error('Geçersiz asimetrik şifreleme algoritması');
  }
  return decryptedData;
}

// Veriyi şifreyi çözmek için uygun algoritmayı seçip işlemi gerçekleştirme
async function decryptData(data, algorithm) {
  let decryptedData;
  if (algorithm === 'symmetric') {
    decryptedData = await decryptDataSymmetric(data, algorithm);
  } else if (algorithm === 'asymmetric') {
    decryptedData = await decryptDataAsymmetric(data, algorithm);
  } else {
    throw new Error('Geçersiz şifreleme algoritması');
  }
  return decryptedData;
}

module.exports = {
  decryptData,
};
