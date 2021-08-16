const SHA256 = require('crypto-js/sha256')
class Block{
    constructor(index, timestamp, data, previousHash='') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previusHash = previousHash;
        this.hash= this.calculateHash();
        this.nonce = 0;
    }
    calculateHash(){
        return SHA256(this.index+this.previusHash+this.timestamp+JSON.stringify(this.data)+this.nonce).toString()
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !==  Array(difficulty + 1 ).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("block mined:" + Array(difficulty + 1 ).join("0"))
        console.log("block mined hash:"+ this.hash.substring(0, difficulty))
    }
 }

 class Blockchain{
    constructor() {
        this.chain =[this.createGenesisBlock()]
        this.difficulty = 5;
    }
     createGenesisBlock(){
        return new Block(0,"01/01/2021", "Genesis Block", "0")
     }
     getLatestBlock(){
        return this.chain[this.chain.length-1];
     }
     addBlock(newBlock){
        newBlock.previusHash=this.getLatestBlock().hash
        newBlock.mineBlock(this.difficulty);
         //newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
     }

   isChainValid() {
        for(let i=1; i<this.chain.length; i++){
            const currentBlock =this.chain[i];
            const previousBlock = this.chain[i-1]
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previusHash !== previousBlock.hash){
                return false;
            }
        }

        return  true;
    }


 }

 let savejeeCoin= new Blockchain();

console.log("mining...")
savejeeCoin.addBlock(new Block(1, "10/02/2021", {amount : 4}))

console.log("geçerli mi "+ savejeeCoin.isChainValid())
savejeeCoin.chain[1].data = {amoun :200}
console.log(JSON.stringify(savejeeCoin, null, 4))

//console.log("geçerli mi "+ savejeeCoin.isChainValid())
