

import { ethers } from "/js/ethers_library.js";

console.log("Ethers imported success")

// A Web3Provider wraps a standard Web3 provider, which is
// what Metamask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider(window.ethereum)

// The Metamask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
const signer = provider.getSigner()

// Ask the user to connect the wallet, if there is any error
// then return otherwise connect and check the network chain
async function connect (){

    try {
        const accounts = await provider.send("eth_requestAccounts", []);
      }
    catch(e) {
        console.log("Could not get a wallet connection");
        return;
      }

      var balance = await provider.getBalance(await signer.getAddress())
      console.log("Account:", await signer.getAddress());
     
      document.querySelector("#address").textContent = await signer.getAddress();
      document.querySelector("#balance").textContent = ethers.utils.formatEther(balance);
  
      if (await signer.getChainId() == 56){
        console.log("Connected to BSC mainnet")
        document.querySelector("#chain").textContent = "Connected to BSC mainnet"
      }
      else if (await signer.getChainId() == 97){
        console.log("Connected to BSC testnet")
        document.querySelector("#chain").textContent = "Connected to BSC testnet"
      }
      else{
          console.log("Unknwonn chain")
          document.querySelector("#chain").textContent = "Unknwonn chain"
      }
}


// variable to save the contract object
var AnyTokenContract;
// takes a contract address, creates a contract object and uses it to get the name, decimals, etc
async function AnyTokenConnection(input_address){

    //Make sure the address is an address
    var validate = ethers.utils.isAddress(input_address)
    if (validate == false){
        return
    }
    console.log("address " + validate)

    //This is not the real ABI this are just some of the standarts that we need
    const ABI = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)",
        "function balanceOf(address account) external view returns (uint256)",
        "function transfer(address recipient, uint256 amount) external returns (bool)"
    ]

    //here the contract object is created
    const address = input_address
    AnyTokenContract = new ethers.Contract(address, ABI, signer);

    //Now that we have the contract object and the ABI we can call functions
    const name = await AnyTokenContract.name()
    const symbol = await AnyTokenContract.symbol()
    const decimals = await AnyTokenContract.decimals()
    const balance = ethers.utils.formatEther( await AnyTokenContract.balanceOf(await signer.getAddress()) ) 
    console.log("Name: ", name)
    console.log("Symbol: ", symbol)
    console.log("Decimals", decimals)
    console.log("Balance", balance)
    document.querySelector("#t_name").textContent = name;
    document.querySelector("#t_symbol").textContent = symbol;
    document.querySelector("#t_decimals").textContent = decimals;
    document.querySelector("#t_balance").textContent = balance;

}

//Buttons listeners

const connectButton = document.querySelector('.btn_connect_wallet');
const AnyTokenConnectButton = document.querySelector('.btn_anyToken_connect');

connectButton.addEventListener('click', async () => {
    console.log("Opening requests")
    await connect()
    //basic bep-20 0x5dac1ec9229440ee26b13d2c5d23a0917777ea49
    //safemoon 0x46844d25911501ce5436015ee6d2241335ec33e0
    //AnyTokenConnection("0x5dac1ec9229440ee26b13d2c5d23a0917777ea49")
});

AnyTokenConnectButton.addEventListener('click', async () => {
    console.log("Any token connection start")

    //basic bep-20 0x5dac1ec9229440ee26b13d2c5d23a0917777ea49
    //safemoon 0x46844d25911501ce5436015ee6d2241335ec33e0
    AnyTokenConnection(document.querySelector('#token_address_input').value)
});