import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

const Aligner=styled.div`
text-align: center;
padding-top: 2vh;
margin-bottom: 2vh;
`
const Splash = () => (
	<>
    	<Aligner>
	<Link to="/form"><Button variant="contained" color="primary" disableElevation>Project Form</Button></Link>
    	</Aligner>
	<Link to="/profile"><img src="app_splash.png" alt="app splash" /></Link>
	</>
)

export default Splash;
