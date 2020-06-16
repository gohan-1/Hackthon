const Web3 = require('web3');
const fs = require('fs');
const truffleContract = require('truffle-contract');
const healthRecord = require('../src/abis/HealthCare.json')
//let web3 = new Web3();

class WebObj {
    constructor(){
        this.contract = {},
        this.healthCare = '';
        this.web3 = ''
    }
    
    async setProvider(){
        this.web3  = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
        let accounts= await this.web3.eth.getAccounts()
        // console.log(accounts)
       
        // web3.setProvider(provider);
        // this.web3.setProvider(provider ? provider : new Web3( new Web3.providers.HttpProvider(process.env.HTTP_PROVIDER)));
    }

   async loadContract(){
    this.web3  =  new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    // this.web3  = new Web3.providers.HttpProvider(process.env.HTTP_PROVIDER);

        // let web3  = new Web3.providers.HttpProvider(process.env.HTTP_PROVIDER);
       

        // let source = fs.readFileSync("./src/abis/HealthCare.json");
        // console.log(source)
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

        const contract = truffleContract(healthRecord);
        contract.setProvider(web3.currentProvider);
        const instance = await contract.deployed();
        this.healthCare= instance
        // this.healthCare = tempContract.at(this.contract.networks[process.env.CONTRACT_DEPLOYED_PORT].address);
        // console.log(this.healthCare)
        let accounts= await this.web3.eth.getAccounts()
        console.log("account"+accounts[0])
        let txns = await this.healthCare.checkProfile(accounts[0],{from:accounts[0]})
        console.log(txns)
    }

    async getWeb3(){
        return this.web3;
    }

    async getHealthCare(){
        return this.healthCare;
    }
}

module.exports = WebObj;