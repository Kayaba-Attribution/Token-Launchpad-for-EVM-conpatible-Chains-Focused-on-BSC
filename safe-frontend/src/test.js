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
      console.log("NOT VALID")

        return
    }
    console.log("address " + validate)

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
    AnyTokenContract = new ethers.Contract(address, ABI, signer);
    console.log("GOOD")
    console.log(AnyTokenContract)

    //Now that we have the contract object and the ABI we can call functions
    if(AnyTokenContract){
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
    else{
      console.log("NULL")
    }


}

function sayHello() {
  var input_ = document.querySelector('#token_address_input').value
  console.log("Input: ", input_)
  AnyTokenConnection(input_)
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
    
    <p>Address: <span id="address">-</span></p>
    <p>balance: <span id="balance">0</span> BNB</p>
    <p>chain: <span id="chain">-</span></p>

	  <p>Enter any token, examples are:</p>
    <p>0x46844d25911501ce5436015ee6d2241335ec33e0</p>
    <p>0x5dac1ec9229440ee26b13d2c5d23a0917777ea49</p>
    <input id="token_address_input"></input>
    <p></p>
    <Button onClick={sayHello} variant="contained" color="primary" disableElevation >
          Connect To Token
    </Button>
    <p>Name: <span id="t_name">-</span></p>
    <p>Symbol: <span id="t_symbol">-</span></p>
    <p>Decimals: <span id="t_decimals">-</span></p>
    <p>Balance: <span id="t_balance">-</span></p>

    <Button onClick={addLiquidity} variant="contained" color="primary" disableElevation >
          Approve Token
    </Button>

    <p><span id="load_approve"></span></p>
	  
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
