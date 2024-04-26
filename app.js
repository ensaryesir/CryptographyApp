const { MongoClient } = require('mongodb');
const express = require('express');

const app = express();
const port = 3000;

// MongoDB URI'si
const uri = "mongodb://localhost:27017/cryptographyDB";

async function checkMongoDBConnection() {
  try {
    const client = new MongoClient(uri);

    // Bağlantıyı başlat
    await client.connect();

    // Bağlantı durumunu kontrol etmek için bir test sorgusu gönder
    const database = client.db();
    const collections = await database.listCollections().toArray();

    // Bağlantı başarılı ise koleksiyonların listesi konsola yazdırılır
    console.log("MongoDB bağlantısı başarılı. Koleksiyonlar:");
    collections.forEach(collection => {
      console.log(collection.name);
    });

    // Bağlantıyı kapat
    await client.close();
  } catch (error) {
    console.error('MongoDB bağlantısı sırasında bir hata oluştu:', error);
  }
}

// Middleware for MongoDB connection check
app.use(async (req, res, next) => {
  try {
    await checkMongoDBConnection();
    next();
  } catch (error) {
    console.error('MongoDB bağlantısı sırasında bir hata oluştu:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Web uygulamanız ${port} portunda çalışıyor.`);
});
