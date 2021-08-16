const SHA256 = require('crypto-js/sha256')

class Transactions {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddres = toAddress;
        this.amount = amount;
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
          //  console.log(this.nonce, this.hash)

        }

    }

}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 2;
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

    createTransaction(transaction) {
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
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previusHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }


}

let savejeeCoin = new Blockchain();

console.log("mining...")

savejeeCoin.createTransaction(new Transactions('address1', 'address2', 100));
savejeeCoin.createTransaction(new Transactions('address2', 'address1', 50))
console.log('\n Start the miner.....');
savejeeCoin.minePendigTransactions('fatih-adresi')
console.log('\n Balance of Fatih is ', savejeeCoin.getBalanceOfAddress('fatih-adresi'))
console.log('\n Start the miner again.....');
savejeeCoin.minePendigTransactions('fatih-adresi')
console.log('\n Balance of Fatih is ', savejeeCoin.getBalanceOfAddress('fatih-adresi'))
savejeeCoin.minePendigTransactions('fatih-adresi')
console.log('\n Balance of Fatih is ', savejeeCoin.getBalanceOfAddress('fatih-adresi'))
savejeeCoin.minePendigTransactions('fatih-adresi')
console.log('\n Balance of Fatih is ', savejeeCoin.getBalanceOfAddress('fatih-adresi'))
/*
console.log("geçerli mi " + savejeeCoin.isChainValid())
savejeeCoin.chain[1].data = {amoun: 200}
console.log(JSON.stringify(savejeeCoin, null, 4))

//console.log("geçerli mi "+ savejeeCoin.isChainValid())
*/
