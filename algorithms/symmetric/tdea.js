const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');

// 3DES için kullanılacak anahtar (24 byte - 192 bit)
const key = Buffer.from('your_24_byte_key_here', 'utf-8');

// Şifreleme fonksiyonu
function encrypt(data) {
    const cipher = crypto.createCipheriv('des-ede3-cbc', key, Buffer.alloc(8)); // İlklendirme vektörü (IV) için boş bir buffer
    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Çözme fonksiyonu
function decrypt(encryptedData) {
    const decipher = crypto.createDecipheriv('des-ede3-cbc', key, Buffer.alloc(8));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

async function processCollection(uri, dbName, collectionName, fields, action) {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Güncelleme sorgusu oluştur
    const updateQuery = { $set: {} };
    fields.forEach(field => {
        updateQuery.$set[field] = { $function: {
            body: function(value) { return action === 'encrypt' ? encrypt(value) : decrypt(value); },
            args: ["$" + field],
            lang: "js"
        }};
    });

    // Güncelleme sorgusunu çalıştır
    const result = await collection.updateMany({}, updateQuery);
    console.log(`${result.modifiedCount} documents ${action}ed in ${collectionName}`);

    await client.close();
}

// Kullanıcıdan veritabanı bilgilerini ve işlemi al
const uri = "mongodb+srv://username:password@your-cluster.mongodb.net/test";
const dbName = "your_database";
const collectionName = "your_collection";
const fields = ["field1", "field2", "field3"]; // Kullanıcıdan alınacak
const action = "encrypt"; // Kullanıcıdan alınacak

// İşlemi başlat
processCollection(uri, dbName, collectionName, fields, action)
    .catch(err => console.error(err));
