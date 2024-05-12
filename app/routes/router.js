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
    const encryptedFileName = req.file; // Şifreli dosya adını al
    const decryptionKey = req.body.decryptionKey; // Anahtarı al

    // decryptController üzerinden doğru parametrelerle decryptData fonksiyonunu çağır
    const decryptedData = await decryptController.decryptData(encryptedFileName, decryptionKey);
    
    res.send(decryptedData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;