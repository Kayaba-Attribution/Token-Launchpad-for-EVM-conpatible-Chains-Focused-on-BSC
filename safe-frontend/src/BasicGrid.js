import './App.css';
import * as React from 'react';
import { styled } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';

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

const MainContent = ({title, subtitle, logo}) => {
  return (
	  <div style={{height: '700px',}}>
	  <h2>{title}</h2>
	  <p style={{fontStyle: 'italic',}}>{subtitle}</p>
	  <img src={logo} alt="logo"/>
	  <p>Presale Address: 0x7ef4ff27ba1970bb797b0dc2f8f6ad221d228be0</p>
	  <p>Token Address: 0x9eab8e97c6326901a322803b27cae25e9c61b05f</p>
	  <p>The presale has ended. Go back to the dashboard to view more!</p>
          <Button variant="contained" color="primary" disableElevation>
          Trade on Uniswap 
          </Button>
	  <p>If you participated in the presale, please click the button below to claim your tokens.</p>
          <StyledButton>Claim Tokens</StyledButton>
	  <SaleDetails id="22" supply="1000000000" presale="100000" liquidity="500000" softcap="10"/>
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
	  <MainContent title="PumpEth" subtitle="Pump Eth while earning Eth" logo="pumpeth.png"/>
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
	  <div style={{marginTop: '3vh',backgroundColor: 'gray',height: '100vh',}}>
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
