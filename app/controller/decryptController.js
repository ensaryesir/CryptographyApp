const fs = require('fs').promises;
const path = require('path');

const algorithms = {
  'AES': require('../../algorithms/symmetric/aes'),
  'TDEA': require('../../algorithms/symmetric/tdea'),
  'ECC': require('../../algorithms/asymmetric/ecc'),
  'RSA': require('../../algorithms/asymmetric/rsa'),
  'CHACHA20': require('../../algorithms/symmetric/chacha20'),
  'TWOFISH': require('../../algorithms/symmetric/twofish')
};

async function decryptData(encryptedFileName, decryptionAlgorithm) {
  try {
    console.log('\n-------- Şifre Çözme İşlemi Başladı --------\n');
    console.log('Dosya Adı:', encryptedFileName.filename + "\n");
    console.log('Şifre Çözme Algoritması:', decryptionAlgorithm + "\n");

    const encryptedFilePath = path.join(__dirname, `../../uploads/${encryptedFileName.filename}`);
    const encryptedData = await fs.readFile(encryptedFilePath, 'utf8'); // Read as 'utf8' to get a string

    const algorithm = algorithms[decryptionAlgorithm];
    if (!algorithm) {
      throw new Error('Geçersiz şifre çözme algoritması');
    }

    const decryptedData = await algorithm.decrypt(encryptedData);
    console.log('\nÇözülmüş Veri:', decryptedData);

    // Çözülmüş veriyi istediğiniz şekilde kullanabilirsiniz.
    // Örneğin, JSON dosyasına kaydedebilirsiniz:
    const decryptedFilePath = path.join(__dirname, `../../decrypted/${encryptedFileName.filename}_decrypted.json`);
    await fs.writeFile(decryptedFilePath, JSON.stringify(decryptedData, null, 2), 'utf8');

    console.log('\n-------- Şifre Çözme İşlemi Tamamlandı --------\n');
    return decryptedData;
  } catch (error) {
    console.error('Şifre Çözme Hatası:', error);
    throw error;
  }
}

module.exports = {
  decryptData
};