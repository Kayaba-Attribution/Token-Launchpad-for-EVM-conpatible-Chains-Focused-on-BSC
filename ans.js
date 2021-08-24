
import { ethers } from "/assets/js/ethers_library.js";
console.log("Ethers imported succesfully")

// A Web3Provider wraps a standard Web3 provider, which is
// what Metamask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider(window.ethereum)
var signer;
var selectedAccount;
var blockchain;

async function connect (){

    try {
        const accounts = await provider.send("eth_requestAccounts", []);
      }
    catch(e) {
        console.log("Could not get a wallet connection");
        return;
      }
      signer = provider.getSigner();
      selectedAccount = await signer.getAddress();
      document.querySelector(".address").textContent = selectedAccount;

      console.log("Account:", selectedAccount);
      console.log(await provider.getBlockNumber())
  
      if (await signer.getChainId() != 56){
        document.querySelector("#network-name").style.color = "#ff4d4d";
        document.querySelector("#network-name").textContent = " Wrong Network ";
        console.log("Not connected to binance")
      }
      else{
          console.log("Connected to Binance!")
          //document.querySelector("#network-name").style.display = "none";
          document.querySelector("#network-name").textContent = "✅ Wallet Connected ✅";
          
      }
    //document.querySelector("#selected-account").textContent = selectedAccount;

    
}
async function disconnect (){
    console.log("Killing the wallet connection")
    await provider.close();
}

async function payBnb (){
    //signature = await signer.signMessage("Hello World");
    if (signer == null){
        console.log("User not signed in, doing login right now")
        await connect()
    }
    try{
    const tx = 
    {
        from : signer.getAddress(),
        to : "0xd4ec9a0BCd9D1Aeb295c0412641d15095A0C002F",
        value : ethers.utils.parseEther('0.01'),
        nonce : signer.getTransactionCount('latest'),
        gasLimit : 21000, // 100000
        gasPrice : 10000000000,
        chainId: 56
    }
    console.log(tx)
    const sent = await signer.sendTransaction(tx)
    }
    catch(e){
        console.log("ERORS", e)
        if( 4001 == e["code"]){
            console.log("User Denied transaction signature")
        }
        return
    }
}

var busdContract;
async function busd_connection(){
    const ABI = [
        "function symbol() view returns (string)",
        "function balanceOf(address account) external view returns (uint256)",
        "function transfer(address recipient, uint256 amount) external returns (bool)"
    ]
    const address = "0xe9e7cea3dedca5984780bafc599bd69add087d56"
    busdContract = new ethers.Contract(address, ABI, signer);
    const sybol = await busdContract.symbol()
    const balance = ethers.utils.formatEther( await busdContract.balanceOf(await signer.getAddress()) ) 
    console.log("Symbol", sybol)
    console.log("Balance", balance)
    document.querySelector(".balance_busd").textContent = balance;
    console.log("nfo foe")


}
var credits_cart = null;

async function payBUSD () {
    if (signer == null){
        console.log("User not signed in, doing login right now")
        await connect()
        busd_connection()
    }
    try{
        //var credits_buy =document.getElementById('input1').value;
        //console.log(credits_buy)
        console.log(credits_cart)
        var credits_buy = ethers.utils.parseEther( credits_cart )
        console.log(credits_cart)

        const tx = 
        {
            from : signer.getAddress(),
            nonce : signer.getTransactionCount('latest'),
            gasPrice : 10500000000,
            gasLimit: 140000
        }

       // const test = await busdContract.populateTransaction.transfer("0x4B44c71C34Ecd2f64C1A4223149A2b39Ca113F98", credits_buy, tx)
        const sent = await signer.sendTransaction(await busdContract.populateTransaction.transfer("0x4B44c71C34Ecd2f64C1A4223149A2b39Ca113F98", credits_buy, tx))
        const receipt = await sent.wait();
        console.log("Receipt: ",receipt)
        console.log("Status: ",receipt["status"])
        console.log("Hash: ",receipt["transactionHash"])
        console.log("Payer: ",receipt["from"])
        if (receipt["status"] == 1){
            document.querySelector(".txn_status").textContent = "Success";
            console.log(":)")
        }
        else{
            document.querySelector(".txn_status").textContent = "Failes";
        }
        
    }
    catch(e){
        console.log("ERORS", e)
        document.querySelector(".error_handler").textContent = e;
        if( 4001 == e["code"]){
            console.log("User Denied transaction signature")
        }
        return
    }
    
}

const connectButton = document.querySelector('.btn_wallet');
const disconnectButton = document.querySelector('.disconnect');
const sendEthButton = document.querySelector('.sendEthButton');
const payBusd = document.querySelector('.paybusd');
const verify_custom = document.querySelector('.verify_custom');



connectButton .addEventListener('click', async () => {
    console.log("Opening requests")
    await connect()
    busd_connection()
});

const credits_5 = document.querySelector('.op0');
const credits_10 = document.querySelector('.op1');
const credits_20 = document.querySelector('.op2');
const credits_30 = document.querySelector('.op3');
const credits_custom = document.querySelector('.op4');
credits_5 .addEventListener('click', () => {credit_choice("5");});
credits_10 .addEventListener('click', () => {credit_choice("10");});
credits_20 .addEventListener('click', () => {credit_choice("20");});
credits_30 .addEventListener('click', () => {credit_choice("30");});
credits_custom .addEventListener('click', () => {custom_choice_switch("on")});

function credit_choice(number){
    credits_cart  = number;
    document.querySelector(".credits_to_buy").textContent = `${number} credits`;
    document.querySelector(".total_").textContent = number;
    custom_choice_switch("");
    
}

function custom_choice_switch (state){
    
    //document.querySelector(".credits_to_buy").textContent = "Custom";
    var tohide = document.querySelectorAll(".custom_option")
    for(var i =0; i < 2; i++){
        if (state == "on"){
            document.querySelector(".total_").textContent = "0";
           document.querySelector(".credits_to_buy").textContent = "";
           tohide[i].classList.remove("invisible");

        }
        else{
            tohide[i].classList.add("invisible");
        }
    }
    console.log(credits_cart);
}

verify_custom .addEventListener('click', () => {
    credits_cart = document.getElementById('credits_input').value;
    document.querySelector(".total_").textContent = credits_cart;
    console.log(`Buy ${credits_cart}`)
});

payBusd .addEventListener('click', () => {
    console.log("BUSD button")
    payBUSD()
});

sendEthButton .addEventListener('click', () => {
    payBnb()
});



