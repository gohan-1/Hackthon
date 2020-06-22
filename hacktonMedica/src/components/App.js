import React, { Component } from 'react';
import logo from '../logo.png';
import HealthRecordContract from '../abis/HealthCare.json';
import Web3 from 'web3'

import './App.css';
// import getWeb3 from "./getWeb3";
import axios from 'axios';
import getWeb3 from '../utils/getWeb3';
import {connect} from "react-redux";
import { setGlobalData } from '../actions/global_vars';
import { logoutProxy } from '../actions/auth';

import '../css/oswald.css'
// import '../css/open-sans.css'
import '../css/pure-min.css'
import '../css/generic.css'
import '../css/antd.css'
import '../css/style.css'
import '../App.css'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      account: ''
    }
  }

  async componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    
          // Request account access if needed
          await window.ethereum.enable();
      
     
  }
  // Legacy dapp browsers...
  else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      // Acccounts always exposed

  }
  // Non-dapp browsers...
  else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }

  let web3=window.web3;

  this.setState({
  web3 : web3
    })


      this.props.setGlobalData({web3: web3});
      

     let accounts = await web3.eth.getAccounts()
    // console.log(results.web3.eth.defaultAccount)
    web3.eth.defaultAccount= accounts[0];

    console.log(web3.eth.defaultAccount)

    await this.contractInstance()
   
  }
    async contractInstance(){

      let web3 = this.state.web3
      
     

    let accounts= await web3.eth.getAccounts()
    console.log(accounts)
    let account =accounts[0];
    this.setState({
      account:accounts[0]
      })
      let networkId= await this.state.web3.eth.net.getId() 
      console.log("network id"+networkId)
      let networkData=HealthRecordContract.networks[networkId]
      if(networkData){
        console.log(networkId)
        let healthRecordContracts= new this.state.web3.eth.Contract(HealthRecordContract.abi,networkData.address)
        console.log(healthRecordContracts)
        this.props.setGlobalData({healthRecord: healthRecordContracts});
        // let checkAccountInterval = setInterval(function() {
        //   if (accounts[0] == account) {
          
        //     logoutProxy();
        //     window.location.reload();
        //   }
        // }, 50000);
    }
  }
    
    render(){
      return(
      <div>
        {this.props.children}
      </div>
      )
    }



  
}
const actionCreators = {
  setGlobalData
};

export default connect(null, actionCreators)(App);