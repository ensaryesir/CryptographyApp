const { MongoClient } = require('mongodb');

// MongoDB URI'si
const uri = "mongodb://localhost:27017/cryptographyDB";

// Koleksiyon isimleri
const collectionNames = {
  asymmetric: 'asymmetric',
  symmetric: 'symmetric',
  users: 'users'
};

// MongoClient nesnesi oluştur
const client = new MongoClient(uri);

// Bağlantıyı sağlamak için bir fonksiyon
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("MongoDB bağlantısı başarılı.");
  } catch (error) {
    console.error('MongoDB bağlantısı sırasında bir hata oluştu:', error);
  }
}

// Koleksiyonlara erişmek için fonksiyonlar
function getAsymmetricCollection() {
  return client.db().collection(collectionNames.asymmetric);
}

function getSymmetricCollection() {
  return client.db().collection(collectionNames.symmetric);
}

function getUsersCollection() {
  return client.db().collection(collectionNames.users);
}

// Modeli export et
module.exports = {
  connectToMongoDB,
  getAsymmetricCollection,
  getSymmetricCollection,
  getUsersCollection
};
