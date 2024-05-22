// const crypto = require('crypto');

// // Generate key pair
// const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
//   modulusLength: 2048,  // the length of your key in bits
//   publicKeyEncoding: {
//     type: 'spki',       // recommended to be 'spki'
//     format: 'pem'       // recommended to be 'pem'
//   },
//   privateKeyEncoding: {
//     type: 'pkcs8',      // recommended to be 'pkcs8'
//     format: 'pem'       // recommended to be 'pem'
//   }
// });

// console.log('Public Key:', publicKey);
// console.log('Private Key:', privateKey);


////////////////////////////////////////////////////////////////////////


// const crypto = require('crypto');

// // Generate key pair
// const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
//   namedCurve: 'secp256k1',   // Popular curve used for ECC
//   publicKeyEncoding: {
//     type: 'spki',
//     format: 'pem'
//   },
//   privateKeyEncoding: {
//     type: 'pkcs8',
//     format: 'pem'
//   }
// });

// console.log('Public Key:', publicKey);
// console.log('Private Key:', privateKey);


////////////////////////////////////////////////////////////////////////

// const crypto = require('crypto');

// const IV = crypto.randomBytes(16);
// console.log(IV.toString('hex'));

////////////////////////////////////////////////////////////////////////

// const crypto = require('crypto');

// const key = crypto.randomBytes(32);
// const nonce = crypto.randomBytes(8);

// console.log('Key:', key.toString('hex'));
// console.log('Nonce:', nonce.toString('hex'));

////////////////////////////////////////////////////////////////////////