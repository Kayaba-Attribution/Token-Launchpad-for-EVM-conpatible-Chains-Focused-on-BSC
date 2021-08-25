import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import { styled } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import BasicGrid from './BasicGrid';
import test from './test';
import Splash from './Splash';
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
       	<Router>
    	<div>
            <Route path="/" exact component={Splash} />
            <Route path="/profile" component={BasicGrid} />
            <Route path="/web3" component={test} />
    	</div>
	</Router>
  )
}
 
export default App;
