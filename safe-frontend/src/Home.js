import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

const Home = () => {
  return (
    <div>
      <div className="center">
        <h1><Link to="/web3">Welcome to BSC LaunchPad!</Link></h1>
        <div>
          <Button>
            <Link to="/web3">&rarr;</Link>
          </Button>
          {/* <Button variant="contained" color="primary">
            <Link to="/web3">Developer</Link>
          </Button>
          <Button variant="contained" color="primary">
            <Link to="/login">Participant</Link>
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
