const { getWeb3Obj } = require("../server-utils/web3-util");
const truffleContract = require('truffle-contract');
const healthRecord = require('../src/abis/HealthCare.json')
const Web3 = require('web3');


const fetchUserProfile = async (userAddress, callback) => {
    try {
        // let web3  = new Web3(process.env.HTTP_PROVIDER);
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
        console.log(userAddress)
        const contract = truffleContract(healthRecord);
        contract.setProvider(web3.currentProvider);
        const instance = await contract.deployed();

        let profile = await instance.checkProfile(userAddress,{from:userAddress});
        console.log(profile)
        callback(null, profile);
    }
    catch(e) {
        console.log(e);
        callback("error");
    }
}

module.exports = {
    fetchUserProfile
}