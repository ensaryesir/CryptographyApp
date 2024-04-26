const { MongoClient } = require('mongodb');
const crypto = require('crypto');

// ECC anahtar çifti oluşturma
const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'secp256k1', // Kullanılan elliptic curve (eğri)
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
    },
});

// Şifreleme fonksiyonu
function encryptWithECC(data) {
    const encrypted = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
    }, Buffer.from(data, 'utf-8'));
    return encrypted.toString('hex');
}

async function processCollection(uri, dbName, collectionName, columnName) {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Güncelleme sorgusu oluştur
    const updateQuery = { $set: {} };
    updateQuery.$set[columnName] = { $function: {
        body: function(value) { return encryptWithECC(value); },
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
