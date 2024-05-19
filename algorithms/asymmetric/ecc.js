// const crypto = require('crypto');
// const { MongoClient } = require('mongodb');
// const elliptic = require('elliptic');
// const ec = new elliptic.ec('secp256k1'); 

// const uri = "mongodb://localhost:27017/cryptographyDB"; 
// const dbName = 'cryptographyDB';
// const collectionName = 'private_keys';
// const encryptionPassword = process.env.ECC_KEY_ENCRYPTION_PASSWORD; 

// if (!encryptionPassword) {
//   throw new Error("ECC_KEY_ENCRYPTION_PASSWORD ortam değişkeni tanımlanmamış!");
// }

// async function generateKeyPairAndStore() {
//   try {
//     const keyPair = ec.genKeyPair();
//     const privateKey = keyPair.getPrivate('hex');
//     const publicKey = keyPair.getPublic('hex');

//     // Rastgele IV oluştur
//     const iv = crypto.randomBytes(16);

//     // Özel anahtarı şifrele (IV'yi kullanarak)
//     const encryptedPrivateKey = encryptPrivateKey(privateKey, iv); 

//     const client = new MongoClient(uri);
//     await client.connect();
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);

//     // Anahtar çiftini ve IV'yi veritabanına kaydet
//     await collection.insertOne({
//       publicKey: publicKey,
//       privateKey: encryptedPrivateKey,
//       iv: iv.toString('hex') // IV'yi hex formatında kaydet
//     });

//     await client.close();
//     return { privateKey, publicKey };
//   } catch (error) {
//     console.error('Anahtar çifti oluşturma ve kaydetme hatası:', error);
//     throw new Error('Anahtar çifti oluşturulamadı veya kaydedilemedi.');
//   }
// }

// async function getPrivateKey(publicKey) {
//   try {
//     const client = new MongoClient(uri);
//     await client.connect();
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);

//     // Genel anahtarla eşleşen belgeyi bul
//     const document = await collection.findOne({ publicKey: publicKey });
//     await client.close();

//     if (!document) {
//       throw new Error('Belirtilen genel anahtar için özel anahtar bulunamadı.');
//     }

//     // Şifrelenmiş özel anahtarı çöz (kaydedilen IV'yi kullanarak)
//     const decryptedPrivateKey = decryptPrivateKey(document.privateKey, document.iv); 
//     return decryptedPrivateKey;
//   } catch (error) {
//     console.error('Özel anahtar alma hatası:', error);
//     throw new Error('Özel anahtar alınamadı.');
//   }
// }

// async function encrypt(jsonData, publicKeyHex) {
//   try {
//     // 1. Simetrik anahtar oluşturma ve JSON dosyasını şifreleme
//     const aesKey = crypto.randomBytes(32);
//     const aesIv = crypto.randomBytes(16);
//     const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, aesIv);
//     let encryptedData = cipher.update(Buffer.from(JSON.stringify(jsonData), 'utf8'));
//     encryptedData = Buffer.concat([encryptedData, cipher.final()]);

//     // 2. Simetrik anahtarı ECC ile şifreleme
//     const publicKey = ec.keyFromPublic(publicKeyHex, 'hex');
//     const encryptedAesKey = publicKey.encrypt(aesKey);

//     return {
//       encryptedData: encryptedData.toString('hex'),
//       encryptedAesKey: encryptedAesKey.toString('hex'),
//       aesIv: aesIv.toString('hex')
//     };
//   } catch (error) {
//     console.error('ECC şifreleme hatası:', error);
//     throw new Error('ECC şifreleme işlemi sırasında bir hata oluştu.');
//   }
// }

// async function decrypt(encryptedData, encryptedAesKey, aesIv, publicKeyHex) {
//   try {
//     // 1. Özel anahtarı veritabanından al
//     const privateKeyHex = await getPrivateKey(publicKeyHex);

//     // 2. Simetrik anahtarı ECC ile çözme
//     const privateKey = ec.keyFromPrivate(privateKeyHex, 'hex');
//     const aesKey = privateKey.decrypt(Buffer.from(encryptedAesKey, 'hex'));

//     // 3. JSON dosyasını çözme
//     const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, Buffer.from(aesIv, 'hex'));
//     let decryptedData = decipher.update(Buffer.from(encryptedData, 'hex')); // Buffer'dan şifre çöz
//     decryptedData = Buffer.concat([decryptedData, decipher.final()]);

//     return JSON.parse(decryptedData.toString('utf8')); 
//   } catch (error) {
//     console.error('ECC şifre çözme hatası:', error);
//     throw new Error('ECC şifre çözme işlemi sırasında bir hata oluştu.');
//   }
// }

// function encryptPrivateKey(privateKey, iv) { 
//   const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionPassword), iv);
//   let encrypted = cipher.update(privateKey, 'utf8', 'hex');
//   encrypted += cipher.final('hex');
//   return encrypted;
// }

// function decryptPrivateKey(encryptedPrivateKey, ivHex) { 
//   const iv = Buffer.from(ivHex, 'hex'); // IV'yi hex'ten Buffer'a dönüştür
//   const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionPassword), iv);
//   let decrypted = decipher.update(encryptedPrivateKey, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
//   return decrypted;
// }

// module.exports = {
//   generateKeyPairAndStore,
//   getPrivateKey,
//   encrypt,
//   decrypt
// };