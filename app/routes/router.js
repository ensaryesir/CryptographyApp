const fs = require('fs').promises;
const express = require('express');
const multer = require('multer');
const encryptController = require('../controller/encryptController');
const decryptController = require('../controller/decryptController');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

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

// Decrypted dosyanın indirilmesi için GET isteği
router.get('/download-decrypted/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../decrypted', `${filename}_decrypted.json`);
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
    const encryptedFile = req.file; // Get encrypted file info
    const decryptionAlgorithm = req.body.decryptionAlgorithm; // Get decryption algorithm

    // Call decryptData function from decryptController with correct parameters
    const decryptedData = await decryptController.decryptData(encryptedFile, decryptionAlgorithm);
    
    // Send the name of the decrypted file as a response
    res.json({ filename: encryptedFile.filename });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;