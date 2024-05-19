const crypto = require('crypto');

async function generateKeyPair() {
  try {
    return new Promise((resolve, reject) => {
      crypto.generateKeyPair('rsa', {
        modulusLength: 4096, // Anahtar boyutu (bit cinsinden)
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      }, (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
        } else {
          resolve({ publicKey, privateKey });
        }
      });
    });
  } catch (error) {
    console.error('Anahtar çifti oluşturma hatası:', error);
    throw new Error('Anahtar çifti oluşturulamadı.');
  }
}

async function encrypt(jsonData, publicKey) {
  try {
    // 1. Simetrik anahtar oluşturma ve JSON dosyasını şifreleme
    const aesKey = crypto.randomBytes(32);
    const aesIv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, aesIv);
    let encryptedData = cipher.update(Buffer.from(JSON.stringify(jsonData), 'utf8'));
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);

    // 2. Simetrik anahtarı RSA ile şifreleme
    const encryptedAesKey = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      aesKey
    );

    return {
      encryptedData: encryptedData.toString('hex'),
      encryptedAesKey: encryptedAesKey.toString('hex'),
      aesIv: aesIv.toString('hex')
    };
  } catch (error) {
    console.error('RSA şifreleme hatası:', error);
    throw new Error('RSA şifreleme işlemi sırasında bir hata oluştu.');
  }
}

async function decrypt(encryptedData, encryptedAesKey, aesIv, privateKey) {
  try {
    // 1. Simetrik anahtarı RSA ile çözme
    const aesKey = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      Buffer.from(encryptedAesKey, 'hex')
    );

    // 2. JSON dosyasını çözme
    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, Buffer.from(aesIv, 'hex'));
    let decryptedData = decipher.update(encryptedData, 'hex');
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);

    return JSON.parse(decryptedData.toString('utf8'));
  } catch (error) {
    console.error('RSA şifre çözme hatası:', error);
    throw new Error('RSA şifre çözme işlemi sırasında bir hata oluştu.');
  }
}

module.exports = {
  generateKeyPair,
  encrypt,
  decrypt
};