const fs = require('fs').promises;
const path = require('path');

const algorithms = {
  'AES': require('../../algorithms/symmetric/aes'),
  'TDEA': require('../../algorithms/symmetric/tdea'),
  'ECC': require('../../algorithms/asymmetric/ecc'),
  'RSA': require('../../algorithms/asymmetric/rsa'),
  'CHACHA20': require('../../algorithms/symmetric/chacha20')
};

async function encryptData(jsonDataFileName, encryptionAlgorithm) {
  try {
    console.log('\n-------- Şifreleme İşlemi Başladı --------\n');
    console.log('Dosya Adı:', jsonDataFileName.filename + "\n");
    console.log('Şifreleme Algoritması:', encryptionAlgorithm + "\n");

    const jsonDataBuffer = await fs.readFile(path.join(__dirname, `../../uploads/${jsonDataFileName.filename}`));
    const jsonString = jsonDataBuffer.toString();
    console.log('Okunan JSON Verisi:', jsonString); // Dosyadan okunan ham veriyi konsola yazdır

    const jsonData = JSON.parse(jsonString);
    // console.log('Parse Edilmiş JSON Verisi:', jsonData + "\n"); // Parse edilmiş (JS nesnesine dönüştürülmüş) veriyi konsola yazdır.

    const algorithm = algorithms[encryptionAlgorithm];
    if (!algorithm) {
      throw new Error('Geçersiz şifreleme algoritması');
    }

    const encryptedData = await algorithm.encrypt(jsonData);
    console.log('Şifrelenmiş Veri:', encryptedData); // Hex formatında konsola yazdır

    const encryptedFilePath = path.join(__dirname, `../../encrypted/${jsonDataFileName.filename}_encrypted.txt`);

    await fs.writeFile(encryptedFilePath, encryptedData); // Hex encoding ile yaz

    console.log('\n-------- Şifreleme İşlemi Tamamlandı --------\n');
    return encryptedData;
  } catch (error) {
    console.error('Şifreleme Hatası:', error);
    throw error;
  }
}

module.exports = {
  encryptData
};