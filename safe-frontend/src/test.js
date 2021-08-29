import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import { styled } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import "@ethersproject/shims"
import { ethers } from "ethers";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const StyledButton = withStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  label: {
    textTransform: 'capitalize',
  },
})(Button);

const SaleDetails = ({id,supply,presale,liquidity,softcap}) => {
  const ts={textAlign: 'left', marginLeft: '10vw',}
  return (
  	<div>
	  <p style={ts}>Sale ID: {id}</p>
	  <p style={ts}>Total Supply: {supply}</p>
	  <p style={ts}>Tokens for Presale: {presale}</p>
	  <p style={ts}>Tokens for Liquidity: {liquidity}</p>
	  <p style={ts}>Softcap: {softcap} ETH</p>
	</div>
  )
}



var provider;
var signer;
var accounts;
//test
async function connect (){

  try {
      await window.ethereum.enable()
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner()
      accounts = await provider.send("eth_requestAccounts", []);
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
        document.querySelector("#chain").textContent = "Unknown chain"
    }

    AnyTokenConnection()
}


// variable to save the contract object
var AnyTokenContract;
var connectedTokenAddress;
// takes a contract address, creates a contract object and uses it to get the name, decimals, etc
//*******************************
// HARCODE THE TOKEN ADDRESS HERE
//*******************************

async function AnyTokenConnection(){
  var input_address = document.querySelector('#token_address_input').value
  if(input_address == ""){
    input_address = "0x46844d25911501ce5436015ee6d2241335ec33e0"
  } 

    console.log("--> CONNECTION TO BEP-20 START...")
    //This is not the real ABI this are just some of the standarts that we need
    const ABI = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)",
        "function balanceOf(address account) external view returns (uint256)",
        "function transfer(address recipient, uint256 amount) external returns (bool)",
        "function approve(address spender, uint256 amount) external returns (bool)"
    ]

    //here the contract object is created
    const address = input_address
    try{
        AnyTokenContract = new ethers.Contract(address, ABI, signer);
        connectedTokenAddress = input_address
            //Now that we have the contract object and the ABI we can call functions
        const name = await AnyTokenContract.name()
        const symbol = await AnyTokenContract.symbol()
        const decimals = await AnyTokenContract.decimals()
        const balance = ethers.utils.formatEther( await AnyTokenContract.balanceOf(await signer.getAddress()) ) 
        console.log("Name: ", name)
        console.log("Symbol: ", symbol)
        console.log("Decimals", decimals)
        console.log("Balance", balance)
        document.querySelector(".t_name").textContent = name;
        document.querySelector("#t_symbol").textContent = symbol;
        document.querySelector("#t_decimals").textContent = decimals;
        document.querySelector("#t_balance").textContent = balance;
        console.log("-- fend --")
    }
    catch(e){
        console.log("No connection stablished, check wallet connection or token address")
    }




}


// variable to save the contract object
var PreSaleContract;
// takes a contract address, creates a contract object and uses it to get the name, decimals, etc
async function PreSaleConnection(){
    var input_address = document.querySelector('#presale_address_input').value
    if(input_address == ""){
      input_address = "0x3D2745C04B68F0f53a34931eB86172FAb14D3761"
    } 
    console.log("--> CONNECTION TO PRESALE CONTRACT...")
    
    //This is not the real ABI this are just some of the standarts that we need
    const ABI = [
      {
          "inputs": [
              {
                  "internalType": "uint256",
                  "name": "_cap",
                  "type": "uint256"
              },
              {
                  "internalType": "uint256",
                  "name": "_minBNB",
                  "type": "uint256"
              },
              {
                  "internalType": "uint256",
                  "name": "_maxBNB",
                  "type": "uint256"
              },
              {
                  "internalType": "address",
                  "name": "_tokenAddress",
                  "type": "address"
              }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
      },
      {
          "inputs": [],
          "name": "EmergencyWithdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "_addr",
                  "type": "address"
              }
          ],
          "name": "SeeAddressContribution",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "cap_",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "claimTokens",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
              }
          ],
          "name": "contributions",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "deposit",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "uint256",
                  "name": "amount_",
                  "type": "uint256"
              }
          ],
          "name": "depositPreSaleTokens",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "finalize",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "isOpen",
          "outputs": [
              {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "liqTokens",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "liqTokens_",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "maxBNB",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "minBNB",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "moneyRaised",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "owner",
          "outputs": [
              {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "owner_",
          "outputs": [
              {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "preSaleCompleted",
          "outputs": [
              {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "rate",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "saleTokens",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "_owner",
                  "type": "address"
              }
          ],
          "name": "seeAllowance",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "_addr",
                  "type": "address"
              }
          ],
          "name": "seeBalance",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "to_",
                  "type": "address"
              },
              {
                  "internalType": "uint256",
                  "name": "amount_",
                  "type": "uint256"
              }
          ],
          "name": "sendTokens",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "send_BNB_back",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "send_tokens_contribution",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "tokenAddress_",
          "outputs": [
              {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "addr_",
                  "type": "address"
              }
          ],
          "name": "tokenAllocation",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "uniswapV2Router",
          "outputs": [
              {
                  "internalType": "contract IUniswapV2Router02",
                  "name": "",
                  "type": "address"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      }
  ]

    try{
        //here the contract object is created
        const address = input_address
        PreSaleContract = new ethers.Contract(address, ABI, signer);

        //Now that we have the contract object and the ABI we can call functions
        const owner = await PreSaleContract.owner_()
        const bnbRaised = ethers.utils.formatEther(await PreSaleContract.moneyRaised())
        const status = await PreSaleContract.preSaleCompleted()
        const tokenAddress = await PreSaleContract.tokenAddress_()
        const minBNB = ethers.utils.formatEther(await PreSaleContract.minBNB())
        const maxBNB = ethers.utils.formatEther(await PreSaleContract.maxBNB())
        const cap = ethers.utils.formatEther(await PreSaleContract.cap_())
        const isOpen = await PreSaleContract.isOpen()
        const myAllocation = ethers.utils.formatEther(await PreSaleContract.tokenAllocation(await signer.getAddress()))
        const myContribution = ethers.utils.formatEther(await PreSaleContract.SeeAddressContribution(await signer.getAddress()))
        console.log("isOpen: ", isOpen)
        console.log("preSaleCompleted: ", status)
        console.log("bnbRaised: ",bnbRaised)
        console.log("cap: ",cap)
        console.log("minBNB: ", minBNB)
        console.log("maxBNB: ", maxBNB)
        console.log("myContribution: ", myContribution)
        console.log("myAllocation: ", myAllocation)
        console.log("tokenAddress: ", tokenAddress)
        console.log("owner: ", owner)

        document.querySelector("#bnbRaised").textContent = bnbRaised;
        document.querySelector("#cap").textContent = cap;
        document.querySelector("#minBNB").textContent = minBNB;
        document.querySelector("#maxBNB").textContent = maxBNB;
        document.querySelector("#myContribution").textContent = myContribution;
        document.querySelector("#myAllocation").textContent = myAllocation;

        console.log("-- fend --")
    }
    catch(e){
        console.log("No connection stablished, check wallet connection or token/presale address")
        console.log(e)
    }

}


async function depositBNB(){
  //bnb = ethers.utils.parseEther( bnb_ )

  var temp_value = document.querySelector('#presale_bnb_input').value 
  console.log(temp_value)
  try{
    console.log(await PreSaleContract.owner_())
    const sent = await PreSaleContract.deposit({ value: ethers.utils.parseEther(temp_value) })
    const receipt = await sent.wait();
    console.log("Status: ",receipt["status"])
    console.log("Hash: ",receipt["transactionHash"])
    if (receipt["status"] == 1){
      document.querySelector("#load_approve").textContent = "Success";
      console.log(":)")
    }
    else{
        document.querySelector("#load_approve").textContent = "Failed";
    }
  }
  catch(e){
    console.log("No deposit done")
    console.log(e)
  }
}

async function approvePreSale(){
  //bnb = ethers.utils.parseEther( bnb_ )

  const sent = await AnyTokenContract.approve(connectedTokenAddress, ethers.BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"))
  const receipt = await sent.wait();
  console.log("Receipt: ",receipt)
  console.log("Status: ",receipt["status"])
  console.log("Hash: ",receipt["transactionHash"])
  console.log("From: ",receipt["from"])

}

async function depositPreSaleTokens_(){
  //bnb = ethers.utils.parseEther( bnb_ )
  var dev_token_balance = await AnyTokenContract.balanceOf(await signer.getAddress())
  const sent = await PreSaleContract.depositPreSaleTokens(dev_token_balance)
  const receipt = await sent.wait();
  console.log("Receipt: ",receipt)
  console.log("Status: ",receipt["status"])
  console.log("Hash: ",receipt["transactionHash"])
  console.log("From: ",receipt["from"])

}



var pancake_factory;
async function addLiquidity(){
    //bnb = ethers.utils.parseEther( bnb_ )

    const tx = 
    {
        from : signer.getAddress(),
        nonce : signer.getTransactionCount('latest'),
        gasPrice : 10500000000,
        gasLimit: 5000000
    }

    const sent = await AnyTokenContract.approve("0xfd1e8c5942d1cb264b1734d3d9b007c31013e399", ethers.BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"))
    document.querySelector("#load_approve").textContent = "Processing";
    const receipt = await sent.wait();
    console.log("Receipt: ",receipt)
    console.log("Status: ",receipt["status"])
    console.log("Hash: ",receipt["transactionHash"])
    console.log("Payer: ",receipt["from"])
    if (receipt["status"] == 1){
        document.querySelector("#load_approve").textContent = "Success";
        console.log(":)")
    }
    else{
        document.querySelector("#load_approve").textContent = "Failed";
    }
}

const MainContent = ({title, subtitle, logo}) => {
  return (
	  <div style={{height: '700px',}}>
	  <h2>{title}</h2>
	  <p style={{fontStyle: 'italic',}}>{subtitle}</p>



    <Button onClick={connect} variant="contained" color="primary" disableElevation >
          Connect Wallet
    </Button>
    <div class="wallet-info">
      <p>Address: <span id="address">-</span></p>
      <p>balance: <span id="balance">0</span> BNB</p>
      <p>chain: <span id="chain">-</span></p>
    </div>

    <input id="token_address_input"></input>

    <p>Name: <span class="t_name">-</span> | Symbol: <span id="t_symbol">-</span></p>


    <input id="presale_address_input"></input>
    <Button onClick={PreSaleConnection} variant="contained" color="primary" disableElevation >
          Connect to presale
    </Button>
    <div class="presale-info">
      <p>Total BNB Raised: <span id="bnbRaised">0</span> BNB</p>
      <p>BNB Cap: <span id="cap">0</span> BNB</p>
      <p>Min BNB Contribution: <span id="minBNB">0</span> BNB</p>
      <p>Max BNB Contribution: <span id="maxBNB">0</span> BNB</p>
      <p>My BNB Contribution: <span id="myContribution">0</span> BNB</p>
      <p>My Token Allocation: <span id="myAllocation">0</span><span class="t_name"></span></p>
      <p>BNB Cap: <span id="cap">0</span> BNB</p>
      <input id="presale_bnb_input"></input>
    </div>
    <Button onClick={depositBNB} variant="contained" color="primary" disableElevation >
          Contribute BNB
    </Button>

    <p><span id="load_approve"></span></p>

    <Button onClick={approvePreSale} variant="contained" color="primary" disableElevation >
          APPROVE
    </Button>
    <Button onClick={depositPreSaleTokens_} variant="contained" color="primary" disableElevation >
          DEPOSIT TOKENS
    </Button>
	  
	  </div>
  )
}

const WarnItem = ({title, text}) => {
  const textStyle={textAlign: 'left',}
  const headStyle={textAlign: 'left',color: 'red',}
  return (
	  <>
	  <h3 style={headStyle}>{title}</h3>
	  <p style={textStyle}>{text}</p>
	  </>
  )
}
const Warnings = () => {
  return (
	  <div style={{height: '700px',}}>
	  <h1>Warnings</h1>
	  <WarnItem title="Soft Cap Warning" text="The soft cap of this sale is very low."/>
	  <WarnItem title="Token Dump Warning" text="Too many tokens are held outside this sale. Make sure these tokens are burned, locked or the owner has a valid reason to hold them. Tokens held by teams can be sold to pull out liquidity and should be carefully examined."/>
	  <WarnItem title="Liquidity Percentage Warning" text="This sale has a very low liquidity percentage."/>

	  </div>
  )
}

const LeftPanel = () => {
  return (
        <Grid item sm={3} xs={12} >
          <Item>
	  <Warnings/>
	  </Item>
        </Grid>
  )
}

const CenterPanel = () => {
  return (
        <Grid item sm={6} xs={12}>
          <Item>
	  <MainContent title="Web3 Testing" subtitle="Connect, see, approve, deploy" logo="pumpeth.png"/>
	  </Item>
        </Grid>
  )
}

const RightPanel = () => {
  return (
        <Grid item sm={3} xs={12}>
          <Item>
	  <img src="disqus.png" alt="disqus comments"/>
	  </Item>
        </Grid>
  )
}

function BasicGrid() {
  return (
	  <div style={{marginTop: '3vh',backgroundColor: 'gray',}}>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <LeftPanel/>
	<CenterPanel/>
	<RightPanel/>
      </Grid>
    </Box>
	  </div>
  );
}

export default BasicGrid;
