const fs = require('fs');
const path = require('path');
const aes = require('../../algorithms/symmetric/aes');
const tdea = require('../../algorithms/symmetric/tdea');
const dsa = require('../../algorithms/asymmetric/dsa');
const ecc = require('../../algorithms/asymmetric/ecc');
const rsa = require('../../algorithms/asymmetric/rsa');

// Veriyi şifrelemek için seçilen algoritmayı kullan
async function encryptData(jsonDataFileName, encryptionAlgorithm) {
  let encryptedData;
  
  console.log("JSON Dosyası: ", jsonDataFileName);
  console.log("Şifreleme Algoritması: ", encryptionAlgorithm);

  // Dosyayı oku
  const jsonDataBuffer = fs.readFileSync(`uploads/${jsonDataFileName.filename}`);
  // Buffer'ı string'e dönüştür
  const jsonString = jsonDataBuffer.toString();
  // String'i JSON'a dönüştür
  const jsonData = JSON.parse(jsonString);

  switch (encryptionAlgorithm) {
    case 'AES':
      console.log("AES seçildi.");
      const result = await aes.encrypt(jsonDataFileName.filename);
      encryptedData = result.encryptedData;
      console.log("Şifrelenmiş Veri: ", encryptedData);
      console.log("Anahtar: ", result.key);

      // Şifrelenmiş veriyi ve anahtarı dosyaya yaz
      fs.writeFileSync(path.join(__dirname, `../../encrypted/${jsonDataFileName.filename}_encrypted.txt`), encryptedData);
      fs.writeFileSync(path.join(__dirname, `../../encrypted/${jsonDataFileName.filename}_key.txt`), result.key);
      break;

    case 'TDEA':
      console.log("TDEA seçildi.");
      encryptedData = await tdea.encrypt(jsonData);
      console.log("Şifrelenmiş Veri: ", encryptedData);
      break;

    case 'DSA':
      console.log("DSA seçildi.");
      encryptedData = await dsa.encrypt(jsonData);
      console.log("Şifrelenmiş Veri: ", encryptedData);
      break;

    case 'ECC':
      console.log("ECC seçildi.");
      encryptedData = await ecc.encrypt(jsonData);
      console.log("Şifrelenmiş Veri: ", encryptedData);
      break;
      
    case 'RSA':
      console.log("RSA seçildi.");
      encryptedData = await rsa.encrypt(jsonData);
      console.log("Şifrelenmiş Veri: ", encryptedData);
      break;
  }

  return encryptedData;
}

module.exports = {
  encryptData
};