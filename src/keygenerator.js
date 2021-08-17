var EC = require('elliptic').ec;

// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('secp256k1');

var key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const  privateKey = key.getPrivate('hex');
console.log();
console.log('Public Key:', publicKey)
console.log('Private Key:', privateKey)