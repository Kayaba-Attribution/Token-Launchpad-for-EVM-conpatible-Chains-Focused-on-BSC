import './App.css';
import * as React from 'react';
import BasicGrid from './BasicGrid';
import test from './test';
import Splash from './Splash';
import FormProject from './FormProject';
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
       	<Router>
    	<div>
            <Route path="/" exact component={Splash} />
            <Route path="/profile" component={BasicGrid} />
            <Route path="/form" component={FormProject} />
            <Route path="/web3" component={test} />

    	</div>
	</Router>
  )
}
 
export default App;
