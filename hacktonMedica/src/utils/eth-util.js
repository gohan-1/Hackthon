import axios from "axios";
import store from "../utils/store";
import { message } from "antd";
import { getBytes32FromIpfsHash } from "./ipfs-util";

export const updateFileHash = async (filename, type, fileHash, secret) => {
    let { web3, healthRecord } = store.getState().global_vars;
    // let res = await healthRecord.addFile
    let accounts= await web3.eth.getAccounts()
    console.log("file hash"+getBytes32FromIpfsHash(fileHash))
    // .sendTransaction(filename, type, hash , secret, {"from":web3.eth.accounts[0]});
    let res = await healthRecord.methods.addFile(filename, type,fileHash, secret).send({from:accounts[0]});
    console.log("inside udatefish"+res)
    if(res)
        message.success("file upload successful");
    else
        message.error("file upload unsuccessful");
}

export const getPatientInfoForDoctor = async (patient_address, callback) => {
    let { web3, healthRecord } = store.getState().global_vars;
    let accounts= await web3.eth.getAccounts()
    let res = await healthRecord.methods.getPatientInfoForDocter(patient_address).call({from:accounts[0]});
    console.log("ass"+res)
    callback(res);
} 

export const getFileInfo = async (role, file_list, patient_address, callback) => {
     let { web3 } = store.getState().global_vars;
     let accounts= await web3.eth.getAccounts()
     console.log("file list"+role, file_list, patient_address)
    // let res = await healthRecord.getFileInfoPatient.sendTransaction(fileHash, {"from":web3.eth.accounts[0]});
    let body = {role, file_list, client_address: accounts[0], patient_address};
    axios.post('http://localhost:9090/files_info',body)
    .then((response) => {
        console.log("from response"+response)
        if(response.data){
            console.log("from get info "+response.data)
            callback(response.data);
         } else
            callback([]);
    });
}