const { SHA256 } = require("../utils/sha256");

class Block {
  constructor(index = 0, timestamp = Date.now().toString(), transactions = []) {
    this.index = index;
    this.prevHash = "";
    this.timestamp = timestamp;
    this.nonce = 0;
    this.transactions = transactions;
    this.hash = Block.getHash(this);
  }

  static getHash(block) {
    return SHA256(
      block.index +
        block.prevHash +
        block.timestamp +
        JSON.stringify(block.transactions) +
        block.nonce
    );
  }

  mine(difficulty) {
    const target = "0".repeat(difficulty);
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = Block.getHash(this);
    }
  } 
  static isValidProof(hash, difficulty) {
    const prefix = "0".repeat(difficulty);
    return hash.startsWith(prefix);
  }

  static isValidNewBlock(newBlock, previousBlock, difficulty) {
    if (previousBlock.index + 1 !== newBlock.index) {
      console.log("invalid index");
      return false;
    } else if (previousBlock.hash !== newBlock.prevHash) {
      console.log("invalid previoushash");
      return false;
    } else if (Block.getHash(newBlock) !== newBlock.hash) {
      console.log("invalid hash");
      return false;
    } else if (!this.isValidProof(newBlock.hash, difficulty)) {
      console.log("invalid proof-of-work");
      return false;
    }
    return true;
  }
}

module.exports = Block;
