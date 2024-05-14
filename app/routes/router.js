const express = require('express');
const multer = require('multer');
const encryptController = require('../controller/encryptController');
const decryptController = require('../controller/decryptController');
const path = require('path');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

// Ana sayfa için GET isteği
router.get('/', (req, res) => {
  res.render('index');
});

// Şifrelenmiş dosyanın indirilmesi için GET isteği
router.get('/download-encrypted/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../encrypted', `${filename}_encrypted.txt`);
  res.download(filePath);
});

// Anahtar dosyasının indirilmesi için GET isteği
router.get('/download-key/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../encrypted', `${filename}_key.txt`);
  res.download(filePath);
});

// Decrypted dosyanın indirilmesi için GET isteği
router.get('/download-decrypted/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../decrypted', `${filename}_decrypted.txt`);
  res.download(filePath);
});

// IV dosyasının indirilmesi için GET isteği
router.get('/download-iv/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../encrypted', `${filename}_iv.txt`);
  res.download(filePath);
});

// JSON dosyasındaki verilerin şifrelenmesi için POST isteği
router.post('/encrypt-collection', upload.single('databaseFile'), async (req, res) => {
  try {
    const jsonDataFileName = req.file; // Dosya adını al
    const encryptionAlgorithm = req.body.encryptionAlgorithm; // Algoritmayı al

    // encryptController üzerinden doğru parametrelerle encryptData fonksiyonunu çağır
    await encryptController.encryptData(jsonDataFileName, encryptionAlgorithm);
    
    // Dosyanın adını yanıt olarak gönder
    res.json({ filename: jsonDataFileName.filename });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// JSON dosyasındaki şifrelenmiş verilerin çözülmesi için POST isteği
router.post('/decrypt-collection', upload.single('encryptedFile'), async (req, res) => {
  try {
    const encryptedFileName = req.file; // Şifreli dosya yolunu al
    const decryptionKey = req.body.decryptionKey; // Şifre çözme anahtarını al
    const decryptionIV = req.body.decryptionIV; // Şifre çözme IV değerini al
    const decryptionAlgorithm = req.body.decryptionAlgorithm; // Şifre çözme algoritmasını al

    // decryptController üzerinden doğru parametrelerle decryptData fonksiyonunu çağır
    await decryptController.decryptData(encryptedFileName, decryptionAlgorithm, decryptionKey, decryptionIV);
    
    // Decrypted dosyanın adını yanıt olarak gönder
    res.json({ filename: decryptController.filename });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;