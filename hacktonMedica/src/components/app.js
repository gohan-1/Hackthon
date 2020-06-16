state = { web3: null, accounts: null, challenge: null, signature: null };

  async componentDidMount() {
    const web3 = await getWeb3();
    console.log(web3)
    const accounts = await web3.eth.getAccounts();
    this.setState({ web3, accounts });
  }

  getChallenge = async () => {
    const { accounts } = this.state;
    console.log(accounts)
    const res = await axios(
      `http://localhost:9090/auth/${accounts[0].toLowerCase()}`
    );
    console.log(res.data)
    this.setState({ challenge: res.data });
  };

  signChallenge = async () => {
    const { web3, challenge, accounts } = this.state;

    console.log("testing started"+challenge[1].value)
 
    web3.eth.personal.sign(challenge[1].value, accounts[0], "test password!")
    .then((result)=>{
      this.setState({ signature: result})
    });
    // web3.eth.sign( web3.utils.sha3(challenge),accounts[0], async (err, signature) => {
    //   this.setState({ signature: signature })
    // })
  };

  verifySignature = async () => {
    const { web3, challenge, signature, accounts } = this.state;
    console.log("challenge values"+challenge[1].value)

    
    const rest = await axios(
      `http://localhost:9090/auth/${challenge[1].value}/${signature}`
    );
    console.log("value"+rest.data)

    const recovered = await res.data.address;
    console.log("address"+recovered)
   
       let address =  await web3.eth.personal.ecRecover(challenge[1].value, signature)
      if(address == recovered && address == accounts[0].toLowerCase() ){
      console.log("Signature verified");
         }else{
            console.log("Signature not verified");
    

    }

  };

  render() {
    const { web3, challenge, signature } = this.state;
    if (!web3) return "Loading...";
    return (
      <div className="App">
     
        <button onClick={this.getChallenge}>Get Challenge</button>
        <button onClick={this.signChallenge} disabled={!challenge}>
          Sign Challenge
        </button>
        <button onClick={this.verifySignature} disabled={!signature}>
          Verify Signature
        </button>

        {challenge && (
          <div className="data">
            <h2>Challenge</h2>
            <pre>{JSON.stringify(challenge, null, 4)}</pre>
          </div>
        )}

        {signature && (
          <div className="data">
            <h2>Signature</h2>
            <pre>{signature}</pre>
          </div>
        )}
      </div>
    );
  }