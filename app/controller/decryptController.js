const fs = require('fs');
const aes = require('../../algorithms/symmetric/aes');
const tdea = require('../../algorithms/symmetric/tdea');
const dsa = require('../../algorithms/asymmetric/dsa');
const ecc = require('../../algorithms/asymmetric/ecc');
const rsa = require('../../algorithms/asymmetric/rsa');

// Veriyi şifre çözmek için seçilen algoritmayı kullan
async function decryptData(encryptedFileName, decryptionKey) {
  let decryptedData;
  
  console.log("Şifreli Dosya: ", encryptedFileName);
  console.log("Şifre Çözme Anahtarı: ", decryptionKey);

  // Dosyayı oku
  const encryptedData = fs.readFileSync(`encrypted/${encryptedFileName}`);

  switch (decryptionKey) {
    case 'AES':
      console.log("AES seçildi.");
      decryptedData = await aes.decrypt(encryptedData);
      break;
    case 'TDEA':
      console.log("TDEA seçildi.");
      decryptedData = await tdea.decrypt(encryptedData);
      break;
    case 'DSA':
      console.log("DSA seçildi.");
      decryptedData = await dsa.decrypt(encryptedData);
      break;
    case 'ECC':
      console.log("ECC seçildi.");
      decryptedData = await ecc.decrypt(encryptedData);
      break;
    case 'RSA':
      console.log("RSA seçildi.");
      decryptedData = await rsa.decrypt(encryptedData);
      break;
  }

  return decryptedData;
}

module.exports = {
  decryptData
};