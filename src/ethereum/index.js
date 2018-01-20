let Web3 = require('web3');
let fs = require('fs');
let solc = require('solc');

const Blockchain = {
  web3: null,
  contracts: {},
  contractAddr: null,

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      console.log('no provider');
      Blockchain.web3= new Web3();
    } else {
      // set the provider you want from Web3.providers
      console.log('found provider');
      Blockchain.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }
    return Blockchain.initContract();
  },

  initContract: function() {
    console.log(Blockchain.web3.eth.accounts);
    let code = fs.readFileSync('contracts/BayernToken.sol').toString();
    let compiledCode = solc.compile(code);
    let abiDefinition = JSON.parse(compiledCode.contracts[':BayernToken'].interface);
    let BayernContract = Blockchain.web3.eth.contract(abiDefinition);
    // this should be a command line option
    Blockchain.contractAddr = '0x4e4ac39bea77b7d1b4c586c093c47e6769bc4259'; 
    Blockchain.getBalances(BayernContract);
    Blockchain.transfer(BayernContract, 10);
    Blockchain.getBalances(BayernContract);
  },

  transfer: function(contract, amount) {
    console.log('transfer called');
    let contractInstance = contract.at(Blockchain.contractAddr);
    contractInstance.transfer(Blockchain.web3.eth.accounts[1], amount, {from: Blockchain.web3.eth.accounts[0]});
    console.log('transfer done');
  },

  getBalances: function(contract) {
    console.log('getting all balances');
    let contractInstance = contract.at(Blockchain.contractAddr);
    Blockchain.web3.eth.accounts.forEach( addr => {
      console.log(contractInstance.getBalance(addr));
    });
  },
  getBalance: function(contract, addr) {
    console.log('getting balance');
    let contractInstance = contract.at(Blockchain.contractAddr);
    console.log('got instance');
    return contractInstance.getBalance(addr);
  },

  deployContract: function(contract) {
    let code = fs.readFileSync('contracts/BayernToken.sol').toString();
    let compiledCode = solc.compile(code);
    let abiDefinition = JSON.parse(compiledCode.contracts[':BayernToken'].interface);
    let byteCode = compiledCode.contracts[':BayernToken'].bytecode;
    let BayernContract = Blockchain.web3.eth.contract(abiDefinition);
    let deployedContract = BayernContract.new([2000], {
      data: byteCode,
      from: Blockchain.web3.eth.accounts[0],
      gas: 4700000,
      function(err, deployedContract) {
        if (err) {
          console.log('---------ERROR---------');
          console.log(err);
          return;
        }
        console.log(deployedContract);
        Blockchain.contractAddr = deployedContract.address;
        console.log(deployedContract.address);
        console.log(Blockchain.contractAddr);
        Blockchain.transfer(BayernContract, 10);
      }
    });
  }
};

export default Blockchain;
