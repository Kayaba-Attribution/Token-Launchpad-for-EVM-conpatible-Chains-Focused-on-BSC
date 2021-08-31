import "./App.css";
import * as React from "react";
import BasicGrid from "./BasicGrid";
import test from "./test";
import Splash from "./Splash";
import FormProject from "./FormProject";
import Ether from "./Ether";
import Home from "./Home";
import Listings from "./Listings"
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <Router>
        <Route path="/" exact component={Home} />
        <Route path="/profile" component={BasicGrid} />
        <Route path="/form" component={FormProject} />
        <Route path="/ether" component={Ether} />
        <Route path="/web3" component={test} />
        {/*<Route path="/home" component={Home} />*/}
        <Route path="/list" component={Listings} />
    </Router>
  );
}

export default App;
