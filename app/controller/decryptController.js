const fs = require('fs').promises;
const path = require('path');

const algorithms = {
  'AES': require('../../algorithms/symmetric/aes'),
  'TDEA': require('../../algorithms/symmetric/tdea'),
  'ECC': require('../../algorithms/asymmetric/ecc'),
  'RSA': require('../../algorithms/asymmetric/rsa'),
};

async function decryptData(encryptedFileName, decryptionAlgorithm, decryptionKey, decryptionIV) {
  try {
    console.log('-------- Şifre Çözme İşlemi Başladı --------');
    console.log('Dosya Adı:', encryptedFileName.filename);
    console.log('Şifre Çözme Algoritması:', decryptionAlgorithm);
    console.log('Anahtar:', decryptionKey);
    console.log('IV:', decryptionIV);

    const encryptedFilePath = path.join(__dirname, `../../uploads/${encryptedFileName.filename}`);
    const encryptedDataBuffer = await fs.readFile(encryptedFilePath, 'utf8');
    const encryptedData = Buffer.from(encryptedDataBuffer, 'hex'); // Hex'ten Buffer'a dönüştür

    const algorithm = algorithms[decryptionAlgorithm];
    if (!algorithm) {
      throw new Error('Geçersiz şifre çözme algoritması');
    }

    const decryptedData = await algorithm.decrypt(encryptedData, decryptionKey, decryptionIV);
    console.log('Çözülmüş Veri:', decryptedData);

    // Çözülmüş veriyi istediğiniz şekilde kullanabilirsiniz.
    // Örneğin, JSON dosyasına kaydedebilirsiniz:
    const decryptedFilePath = path.join(__dirname, `../../decrypted/${encryptedFileName.filename}_decrypted.json`);
    await fs.writeFile(decryptedFilePath, JSON.stringify(decryptedData, null, 2), 'utf-8');

    console.log('-------- Şifre Çözme İşlemi Tamamlandı --------');
    return decryptedData;
  } catch (error) {
    console.error('Şifre Çözme Hatası:', error);
    throw error;
  }
}

module.exports = {
  decryptData
};