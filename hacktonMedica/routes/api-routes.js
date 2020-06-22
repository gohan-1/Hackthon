const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: process.env.IPFS_HOST, port: process.env.IPFS_PORT, protocol: 'https' });
const cryptography = require("cryptography");
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const bs58 = require('bs58');
const { getWeb3Obj } = require("../server-utils/web3-util");
const { verify_token } = require("../server-controllers/auth-controller");
// var CryptoJS = require("crypto-js");
const truffleContract = require('truffle-contract');
const Web3 = require('web3');
const healthRecord = require('../src/abis/HealthCare.json')

const getIpfsHashFromBytes32 = (bytes32Hex) => {
    const hashHex = "1220" + bytes32Hex.slice(2)
    const hashBytes = Buffer.from(hashHex, 'hex');
    const hashStr = bs58.encode(hashBytes)
    return hashStr
}

// var storage = multer.diskStorage({
//     destination: './uploads/',
//     filename: function ( req, file, cb ) {
//         cb( null, 'QmQpeUrxtQE5N2SVog1ZCxd7c7RN4fBNQu5aLwkk5RY9ER'+file.originalname );
//     }
// });
// var upload = multer( { storage: storage } );

let upload  = multer({ storage: multer.memoryStorage() });
let client_address='';

module.exports = (app) => {

    app.post('/ipfs_upload',upload.single('file'),async (req, res)=>{
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
        let accounts = await web3.eth.getAccounts;
        client_address = accounts[0]
        let { secret } = req.headers;
        let file = req.file.buffer;
        console.log("hii"+req.file)
        let cipher = crypto.createCipher('aes-256-ctr',secret)
        let crypted = Buffer.concat([cipher.update(req.file.buffer),cipher.final()]);

        try {
            let ipf_res = await ipfs.files.add(crypted);
            console.log("as")
            // Upload buffer to IPFS
            // console.log("encrypt "+secret);
            if(ipf_res && ipf_res[0]) {
                console.log("jash"+typeof(ipf_res[0].hash))
                let url = `https://ipfs.io/ipfs/${ipf_res[0].hash}`
                console.log(`Url --> ${url}`);
                // let appIde = await cryptography.encrypt({
                //     key: ipf_res[0].hash ,
                //     data: secret
                // })
                // let cipherString=CryptoJS.AES.encrypt(ipf_res[0].hash, secret).toString()
                // // const cipherString = CryptoJS.enc.Hex.stringify(appIde.ciphertext);
                // console.log(cipherString);
                // console.log(typeof(cipherString))
                res.send(ipf_res[0].hash)

                //QmdSbx8C2zAQm6N3cSUoQdF7AhHaBE6eVHA4UrbUvF1mjD
            }
        // let testFile = fs.readFileSync('/home/vishnuskrishnan/demo.text' );
        //Creating buffer for ipfs function to add file to the system
        // let testBuffer = new Buffer(testFile);

        else {
                console.log("ipf upload error.....");
                res.send("");
            }
            //res.send('QmdSbx8C2zAQm6N3cSUoQdF7AhHaBE6eVHA4UrbUvF1mjD');
        }
        catch(error) {
            console.log(error);
            res.send("");
        }
       //res.send(req.file.filename);
    });

    app.get('/ipfs_file', verify_token, async (req, res)=>{
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

        const contract = truffleContract(healthRecord);
        contract.setProvider(web3.currentProvider);
        const instance = await contract.deployed();
        const { role , client_address } = res.locals.decoded;
        const { file_name, hash, patient_address } = req.query;
        console.log("client_address"+client_address)
        console.log("hashes"+hash)
        const ipf_res = await ipfs.files.get(hash);

        try {
            if(ipf_res && ipf_res[0]) {
                // console.log(ipf_res[0].path)
                // console.log(ipf_res[0].content.toString('utf8'));
                const content = ipf_res[0].content;
                const secret = await instance.getFileSecret(hash, role, client_address, patient_address);
                //const secret = await getWeb3Obj().getHealthCare().getFileSecret.sendTransaction(hash, role, client_address, patient_address,{"from":getWeb3Obj().getWeb3().eth.accounts[0]});
                // console.log("decrypt "+secret);
                const decipher = crypto.createDecipher('aes-256-ctr',secret);
                const dec = Buffer.concat([decipher.update(content) , decipher.final()]);
                console.log(dec.toString('utf8'))
    
                res.send(dec.toString('utf8'))
                
            }
            else {
                console.log("ipf fetch error.....");
                res.send("error");
            }
        }
        catch(error) {
            console.log(error);
            res.send("error");
        }
    });

    app.post('/files_info', verify_token, async (req, res)=>{
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

        const contract = truffleContract(healthRecord);
        contract.setProvider(web3.currentProvider);
        const instance = await contract.deployed();
        // const { role , client_address } = res.locals.decoded;
        let { role, file_list , client_address,patient_address } = req.body;
        console.log("client_address"+file_list)


        //const { patient_address, address, file_list, role } = req.body;
        let fetchFileInfo;
        if(role == "doctor") {
            fetchFileInfo = file_list.map(async (fileHash) => {
                let accounts= await web3.eth.getAccounts()
                console.log(fileHash+"   ss   "+getIpfsHashFromBytes32(fileHash)  );
                return await instance.getFileInfoDoctor(client_address,patient_address,fileHash,{from:accounts[0]})
            });
            Promise.all(fetchFileInfo).then((result) => {
                res.send(result);
            });
        }
        else if(role == "patient"){
            // console.log("file list"+file_list)
            fetchFileInfo = file_list.map(async (fileHash) => {
                console.log("filehas"+fileHash)
               return await instance.getFileInfoPatient(client_address,fileHash,{from:client_address})
            });
            
            Promise.all(fetchFileInfo).then((result) => {
                // console.log(result);
                res.send(result);
            }).catch((err) => {
                console.log("errrrrror.....");
                console.log(err);
            });
        }
        else
        res.send([]);
    });

    app.post('/textEditor', async (req,res) => {
        try {
            var html = req.body.html
            var filename = req.body.filename
            var filetype = req.body.filetype
    
            var writeStream = fs.createWriteStream(filename+"."+filetype); 
            writeStream.write(html);
            writeStream.end();
            
            res.json({response:{result:"success",status:200}});
        } catch (error) {
            res.json({response:{error:error.toString(),status:500}});
        }
    })
}