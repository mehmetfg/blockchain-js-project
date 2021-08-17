const {Blockchain, Transaction} = require('./blockchain')
var EC = require('elliptic').ec;

// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('secp256k1');
const meyKey = ec.keyFromPrivate('E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262')
const  mywallet = meyKey.getPublic('hex');
let savejeeCoin = new Blockchain();

console.log("mining...")

const tx1 = new Transaction(mywallet, 'address1', 10);
tx1.signTransaction(meyKey)

savejeeCoin.addTransaction(tx1);

console.log('\n Start the miner.....');
savejeeCoin.minePendigTransactions(mywallet)

console.log('\n Start the miner again.....');
savejeeCoin.minePendigTransactions(mywallet)
console.log('\n Bana ödenen mining ücreti ', savejeeCoin.getBalanceOfAddress(mywallet))
//savejeeCoin.chain[1].transactions[0].amount=1;
console.log('\n is Cahin valid', savejeeCoin.isChainValid())
/*console.log('\n Balance of Fatih is ', savejeeCoin.getBalanceOfAddress(mywallet))
console.log("geçerli mi " + savejeeCoin.isChainValid())
savejeeCoin.chain[1].data = {amoun: 200}
console.log(JSON.stringify(savejeeCoin, null, 4))

//console.log("geçerli mi "+ savejeeCoin.isChainValid())
*/
