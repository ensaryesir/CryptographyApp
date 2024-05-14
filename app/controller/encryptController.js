const fs = require('fs').promises;
const path = require('path');

const algorithms = {
  'AES': require('../../algorithms/symmetric/aes'),
  'TDEA': require('../../algorithms/symmetric/tdea'),
  'ECC': require('../../algorithms/asymmetric/ecc'),
  'RSA': require('../../algorithms/asymmetric/rsa'),
};

async function encryptData(jsonDataFileName, encryptionAlgorithm) {
  try {
    console.log('-------- Şifreleme İşlemi Başladı --------');
    console.log('Dosya Adı:', jsonDataFileName.filename);
    console.log('Şifreleme Algoritması:', encryptionAlgorithm);

    const jsonDataBuffer = await fs.readFile(`uploads/${jsonDataFileName.filename}`);
    const jsonString = jsonDataBuffer.toString();
    console.log('Okunan JSON Verisi:', jsonString);

    const jsonData = JSON.parse(jsonString);
    console.log('Parse Edilmiş JSON Verisi:', jsonData);

    const algorithm = algorithms[encryptionAlgorithm];
    if (!algorithm) {
      throw new Error('Geçersiz şifreleme algoritması');
    }

    const result = await algorithm.encrypt(jsonData);
    console.log('Şifrelenmiş Veri:', result.encryptedData.toString('hex')); // Hex formatında konsola yazdır
    console.log('Anahtar:', result.key);
    if (result.iv) {
      console.log('IV:', result.iv);
    }

    const encryptedFilePath = path.join(__dirname, `../../encrypted/${jsonDataFileName.filename}_encrypted.txt`);
    const keyFilePath = path.join(__dirname, `../../encrypted/${jsonDataFileName.filename}_key.txt`);
    const ivFilePath = path.join(__dirname, `../../encrypted/${jsonDataFileName.filename}_iv.txt`);

    await Promise.all([
      fs.writeFile(encryptedFilePath, result.encryptedData.toString('hex'), 'hex'), // Hex encoding ile yaz
      fs.writeFile(keyFilePath, result.key, 'utf-8'), 
      fs.writeFile(ivFilePath, result.iv, 'utf-8'), 
    ]);

    console.log('-------- Şifreleme İşlemi Tamamlandı --------');
    return result.encryptedData;
  } catch (error) {
    console.error('Şifreleme Hatası:', error);
    throw error;
  }
}

module.exports = {
  encryptData
};