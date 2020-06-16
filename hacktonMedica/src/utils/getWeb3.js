import Web3 from 'web3'

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function() {
    let web3 = window.web3;

    if (typeof web3 !== "undefined") {
      web3 = new Web3(web3.currentProvider);
      let result ={
        web3: web3
      }
      resolve(result);
    } else {
      reject("No web3 instance injected, make sure MetaMask is installed.");
    }
  })
})

export default getWeb3
