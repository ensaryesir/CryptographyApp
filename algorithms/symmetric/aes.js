const crypto = require('crypto');
const fs = require('fs').promises;

async function encrypt(jsonData) {
  try {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedData = cipher.update(Buffer.from(JSON.stringify(jsonData), 'utf8'));
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);

    return {
      // encryptedData'yı hex string'e dönüştürün
      encryptedData: encryptedData.toString('hex'),
      key: key.toString('base64'),
      iv: iv.toString('hex')
    };
  } catch (error) {
    console.error('Şifreleme Hatası:', error);
    throw new Error('Şifreleme işlemi sırasında bir hata oluştu.');   
  }
}

async function decrypt(encryptedData, keyBase64, ivHex) {
  try {
    const key = Buffer.from(keyBase64, 'base64');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decryptedData = decipher.update(encryptedData);
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);

    return JSON.parse(decryptedData.toString('utf8')); // JSON'a dönüştür
  } catch (error) {
    console.error('Şifre Çözme Hatası:', error);
    throw new Error('Şifre çözme işlemi sırasında bir hata oluştu.');
  }
}

module.exports = {
  encrypt,
  decrypt
};