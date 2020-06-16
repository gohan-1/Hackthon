// const cache = require("memory-cache");
// const crypto = require('crypto');

const eutil = require('ethereumjs-util');
const { fetchUserProfile } = require("../server-controllers/api-controller");
const { encode_jwt } = require("../server-utils/jwt-util");
const { getWeb3Obj } = require("../server-utils/web3-util");
const { verify_token } = require("../server-controllers/auth-controller");

let json_obj={}


module.exports = (app, metaAuth) =>{
    
    app.get('/auth/:MetaAddress', metaAuth, (req, res) => {
        // console.log(req.metaAuth.challenge)
        client_address=req.params.MetaAddress
        json_obj[req.metaAuth.challenge[1].value]=client_address;
        console.log("from "+ req.metaAuth.challenge[1].value)
        res.send(req.metaAuth.challenge);


        
        console.log("from chalange"+client_address)

       

    });

    app.get('/auth/:MetaMessage/:MetaSignature', metaAuth, async(req, res) => {
        // console.log(req.params.MetaMessage)
        let web3 = await getWeb3Obj().getWeb3();
       
            if(req.params.MetaMessage){

                console.log("asdddddddddddddddddddddddddddddddddddddddddddddddddddd "+req.params.MetaMessage )
               let address = json_obj[req.params.MetaMessage]

               console.log("ASDASDDDDDDDDDDDDDDDDDDDDDDD"+address)

               console.log("type"+typeof(client_address))

            //    let profile = await getWeb3Obj().getHealthCare().methods.patientInfo().call({from:client_address})
            //    let user = {
            //     name: profile[0],
            //     role: profile[1],
            // }
            // user.token = encode_jwt(Object.assign({},user,{client_address}));
            // console.log(user.token);
            // res.send({address, user});

               fetchUserProfile(client_address, (err, profile) => {
                let user = {
                    name: profile[0],
                    role: profile[1],
                }
                console.log(user)

                console.log("name"+user.name)
                console.log("role"+user.role)
                user.token = encode_jwt(Object.assign({},user,{client_address}));
                console.log(user.token);
                res.send({address, user});
            })


        // // let accounts= await web3.eth.getAccounts()
        // // console.log(accounts[0]+"asdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd")
        // if (req.params.MetaMessage) {

           
        //     let challange=req.params.MetaMessage
        //     let signatures = req.params.MetaSignature
        //     // console.log("type "+(challange )+ "hiis"+(signature))
        //     // let address =  await web3.eth.personal.ecRecover("hello", signature)
        //     // console.log("from verfication"+address)
        //     // const sig = eutil.fromRpcSig(req.params.MetaSignature);
        //     // const publicKey = eutil.ecrecover(eutil.sha3(challange), sig.v, sig.r, sig.s);
        //     // const address = eutil.pubToAddress(publicKey).toString('hex');
        //     const {signature, messageHash, v, r, s} = signatures
        //     let address =      await web3.eth.accounts.recover({
        //         messageHash: messageHash,
        //         v: v,
        //         r: r,
        //         s: s
        //       })


        //     console.log("signature"+address)
        //     // fetchUserProfile(req.metaAuth.recovered, (err, profile) => {
        //     //     let user = {
        //     //         name: profile[0],
        //     //         role: profile[1],
        //     //     }
        //     //     user.token = encode_jwt(Object.assign({},user,{id:req.metaAuth.recovered}));
        //     //     console.log("hi"+user)
        //     //     res.send({"success":true, user});
        //     console.log("Signatureasdasdasdasdasssssssssssss")
        //     res.send(req.metaAuth.recovered)
        //     console.log("Signature")
            // });
        } else {
            console.log("error")
            res.status(500).send();
        };
    });

//     app.get('/custom_auth/:MetaAddress', (req, res) => {
//         let web3 =  getWeb3Obj().getWeb3();
//         let { MetaAddress } = req.params;

//         if(MetaAddress && web3.isAddress(MetaAddress)){
//             try {
//                 crypto.randomBytes(48, function(err, buffer) {
//                     var challenge = buffer.toString('hex');
//                     cache.put(MetaAddress, challenge, 60000);// one minute
//                     res.json({challenge, success:true});
//                 });
//             }
//             catch(e){
//                 res.json({success:false, msg:"error"});
//             }
//         }
//         else {
//             res.json({success:false, msg:"invalid or missing address"});
//         }
//     });

//     app.get('/verify_auth/:signature', (req, res) => {
//         let { client_address } = req.query;
//         let challange = cache.get(client_address);

//         if(req.params.signature && challange) {
//             const sig = eutil.fromRpcSig(req.params.signature);
//             const publicKey = eutil.ecrecover(eutil.sha3(challange), sig.v, sig.r, sig.s);
//             const address = eutil.pubToAddress(publicKey).toString('hex');

//             if(('0x'+address) === client_address) {
                // fetchUserProfile(client_address, (err, profile) => {
                //     let user = {
                //         name: profile[0],
                //         role: profile[1],
                //     }
                //     user.token = encode_jwt(Object.assign({},user,{client_address}));
                //     res.send({"success":true, user});
//                 });
//             }
//             else {
//                 res.status(500).send();
//             }
//         }
//         else {
//             res.status(500).send();
//         }
//     });

    app.head('/verify_token/', verify_token, (req, res) => { 
        res.writeHead(200, {'success': true});
        res.end();
    });
 }