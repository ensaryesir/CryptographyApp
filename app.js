const { MongoClient } = require('mongodb');
const express = require('express');
const router = require('./app/routes/router');
const path = require('path');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB URI'si
const uri = "mongodb://localhost:27017/cryptographyDB";

// MongoDB bağlantısını başlat
const client = new MongoClient(uri);

let connected = false;

client.connect()
  .then(() => {
    console.log("MongoDB bağlantısı başarılı.");
    connected = true;
  })
  .catch((error) => {
    console.error('MongoDB bağlantısı sırasında bir hata oluştu:', error);
  });

// Middleware for MongoDB connection check
app.use(async (req, res, next) => {
  try {
    if (!connected) {
      console.error('MongoDB bağlantısı başarısız.');
      res.status(500).send('Internal Server Error');
    } else {
      next();
    }
  } catch (error) {
    console.error('MongoDB bağlantısı sırasında bir hata oluştu:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use('/', router);

app.set("view engine", "ejs"); // Defining the image engine
app.set("views", path.join(__dirname, "app", "views")); // Specifying the folder where the images will be located

app.use("/public", express.static(path.join(__dirname, "public"))); // Accessing the Public folder (this process is called mapping)

// Start the server
app.listen(port, () => {
  console.log(`Web uygulamanız ${port} portunda çalışıyor.`);
});
