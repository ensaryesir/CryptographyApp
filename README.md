# 🔐 CryptographyApp

A powerful and user-friendly web application for file encryption and decryption using various state-of-the-art cryptographic algorithms.

## 🚀 Features

- 🔄 Symmetric Encryption Support (AES, ChaCha20, TDEA)
- 🔑 Asymmetric Encryption Support (RSA, ECC)
- 📁 Secure File Upload and Download
- 🛡️ Real-time Encryption/Decryption
- 💾 MongoDB Integration for Key Management
- 🔒 Secure Key Generation and Storage
- 📊 Encryption Progress Tracking

## 🛠️ Technologies

- **Backend:** Node.js, Express.js
- **Frontend:** EJS, Bootstrap
- **Database:** MongoDB
- **File Handling:** Multer
- **Cryptography:** Native crypto, ChaCha, Twofish

## 🔐 Encryption Algorithms

### Symmetric Algorithms
- **AES (Advanced Encryption Standard)**
  - Industry-standard block cipher
  - 256-bit key size
  - Secure for most applications
  
- **ChaCha20**
  - Modern stream cipher
  - High performance on software implementations
  - Used in HTTPS and TLS
  
- **TDEA (Triple Data Encryption Algorithm)**
  - Enhanced version of DES
  - Triple encryption for better security
  - Legacy support

### Asymmetric Algorithms
- **RSA (Rivest-Shamir-Adleman)**
  - Public-key cryptosystem
  - Key size: 2048/4096 bits
  - Used for key exchange and digital signatures
  
- **ECC (Elliptic Curve Cryptography)**
  - Modern public-key cryptography
  - Smaller key sizes with equivalent security
  - Efficient for mobile and embedded systems

## 📦 Dependencies

```json
{
  "dependencies": {
    "chacha": "^2.1.0",
    "ejs": "^3.1.10",
    "express": "^4.19.2",
    "mongodb": "^6.6.2",
    "multer": "^1.4.5-lts.1",
    "node-gyp": "^10.1.0",
    "twofish": "^1.0.1"
  }
}
```

## ⚙️ Installation Steps

### 1. Prerequisites

#### MongoDB Installation
1. [Download MongoDB](https://www.mongodb.com/try/download/community)
2. Install and start the MongoDB service
3. Ensure it's running on `mongodb://localhost:27017`

#### Node.js Installation
1. [Download Node.js](https://nodejs.org/)
2. Install Node.js (v14 or higher)
3. Verify installation:
   ```bash
   node -v
   ```

### 2. Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/CryptographyApp.git
   cd CryptographyApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

4. Access the application:
   ```
   http://localhost:3000
   ```

## 📝 Usage Guide

1. **File Encryption:**
   - Select a file to encrypt
   - Choose encryption algorithm (Symmetric or Asymmetric)
   - Set encryption parameters (if required)
   - Click "Encrypt"
   - Download the encrypted file

2. **File Decryption:**
   - Upload an encrypted file
   - Provide the decryption key
   - Click "Decrypt"
   - Download the decrypted file

## 🗂️ Project Structure

```
CryptographyApp/
├── algorithms/          # Encryption implementations
│   ├── symmetric/      # Symmetric algorithms
│   └── asymmetric/     # Asymmetric algorithms
├── app/
│   ├── controller/     # Request handlers
│   ├── model/         # Database models
│   ├── routes/        # API routes
│   └── views/         # EJS templates
├── public/            # Static assets
├── uploads/           # Temporary file storage
├── encrypted/         # Encrypted files
├── decrypted/         # Decrypted files
└── keyManagement/     # Key handling
```

## 🔒 Security Notes

- All encryption keys are securely stored in MongoDB
- Files are encrypted before storage
- Temporary files are automatically deleted
- Secure key generation using crypto-safe random numbers
- Protection against common cryptographic attacks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📜 License

This project is licensed under the MIT License.