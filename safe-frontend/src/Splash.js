import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import axios from "axios";

const Aligner = styled.div`
  text-align: center;
  padding-top: 2vh;
  margin-bottom: 2vh;
`;

const ItemIs = styled.div`
  background-color: red;
  margin-left: 2vw;
  margin-top: 2vh;
  margin-bottom: 2vh;
  margin-right: 2vw;
`;

const Frame = styled.div`
  background-color: white;
  padding-top: 1vh;
  padding-right: 1vw;
  padding-left: 1vw;
  padding-bottom: 1vh;
`;

const Splash = () => {
  const [data, setData] = [];
  const [display, setDisplay] = useState("");
  const sheet =
    "https://sheet.best/api/sheets/25a1b0be-167a-4e34-b294-0b8f73d277c0";
  const endpoint = "https://api.npms.io/v2/search?q=react";

  const fetchSet = async () => {
    const response = await fetch(sheet);
    const data = await response.json();
    //console.log(data);
    const results = data.map((item) => (
      <ItemIs>
        <Frame>
          <h3>{item["0"]}</h3>
          <p>Token Address: {item.address}</p>
          <p>Maximum Contribution Allowed: {item.maximum} BNB</p>
          <p>Minimum Contribution Allowed: {item.minimum} BNB</p>
          <p>Presale Cap: {item.presale} BNB</p>
          <p>
            Rate: {item.rate} {item["0"]}/BNB
          </p>
          <p>Lock Time: {item.lockTime} months</p>
        </Frame>
      </ItemIs>
    ));
    setDisplay(results);
  };
  useEffect(() => {
    fetchSet();
    axios.get(sheet);
  }, []);
  return (
    <>
      <Aligner>
        <Link to="/form">
          <Button variant="contained" color="primary" disableElevation>
            Project Form
          </Button>
        </Link>
      </Aligner>
      <div>{display}</div>
      <Aligner>
        <Link to="/profile">
          <Button variant="contained" color="primary" disableElevation>
            Example Project
          </Button>
        </Link>
      </Aligner>
    </>
  );
};

export default Splash;
