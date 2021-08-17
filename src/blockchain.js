const SHA256 = require('crypto-js/sha256')
var EC = require('elliptic').ec;

// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('secp256k1');
class Transactions {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddres = toAddress;
        this.amount = amount;
    }
    calculateHash(){
        return SHA256(this.fromAddress + this.toAddres + this.amount).toString()
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw  new Error('diğer cüzdana gönderme işlemi onaylanmadı ')
        }
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64')
        this.signature =sig.toDER('hex');
    console.log(this.signature)
    }
    isValid(){
        if(this.fromAddress === null) return true;
        if(!this.signature || this.signature.length ===0){
            throw  new Error('işlem imzalanmadı')
        }
        const  publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return  publicKey.verify(this.calculateHash(), this.signature)

    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {

        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previusHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previusHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString()
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
             console.log(this.nonce, this.hash)

        }

    }
        hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return  true;
        }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2021", "Genesis Block", "0")
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendigTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log('block successfully mined!')
        this.chain.push(block);
        this.pendingTransactions = [
            new Transactions(null, miningRewardAddress, this.miningReward)
        ]
    }

    addTransaction(transaction) {
        if(!transaction.fromAddress || !transaction.toAddres){
            throw new Error('Transaction bir alıcı ve gönderici adresi içermelidir')
        }
        if(!transaction.isValid()){
            throw new Error('Transaction geçerli değildir')
        }
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {

                    balance -= trans.amount;
                }
                if (trans.toAddres === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    addBlock(newBlock) {
        newBlock.previusHash = this.getLatestBlock().hash
        newBlock.mineBlock(this.difficulty);
        //newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1]
            if(!currentBlock.hasValidTransactions()){
                return  false;
            }
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previusHash !== previousBlock.calculateHash()) {
               console.log(currentBlock.previusHash, previousBlock.calculateHash())
            }
        }

        return true;
    }


}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transactions