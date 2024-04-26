const { MongoClient } = require('mongodb');
const crypto = require('crypto');

// DSA anahtar çifti oluşturma
const { privateKey, publicKey } = crypto.generateKeyPairSync('dsa', {
    modulusLength: 2048,
    namedCurve: 'secp256k1', // Kullanılan elliptic curve (eğri)
});

// Şifreleme fonksiyonu
function encryptWithDSA(data) {
    const sign = crypto.createSign('DSA');
    sign.update(data);
    return sign.sign(privateKey, 'hex');
}

async function processCollection(uri, dbName, collectionName, columnName) {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Güncelleme sorgusu oluştur
    const updateQuery = { $set: {} };
    updateQuery.$set[columnName] = { $function: {
        body: function(value) { return encryptWithDSA(value); },
        args: ["$" + columnName],
        lang: "js"
    }};

    // Güncelleme sorgusunu çalıştır
    const result = await collection.updateMany({}, updateQuery);
    console.log(`${result.modifiedCount} documents encrypted in ${collectionName} column: ${columnName}`);

    await client.close();
}

// Kullanıcıdan veritabanı bilgilerini ve işlemi al
const uri = "mongodb+srv://username:password@your-cluster.mongodb.net/test";
const dbName = "your_database";
const collectionName = "your_collection";
const columnName = "your_column"; // Kullanıcıdan alınacak

// İşlemi başlat
processCollection(uri, dbName, collectionName, columnName)
    .catch(err => console.error(err));
