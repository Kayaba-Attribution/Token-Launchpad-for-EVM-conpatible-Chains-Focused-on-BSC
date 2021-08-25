import React, { useState } from 'react'
import { Button, Form, Container, Header } from 'semantic-ui-react'
import axios from 'axios';
import styled from 'styled-components';
import './App.css';

const Frame=styled.div`
width: 500px;
padding: 20px;
`

const Thx=styled.div`
margin-top: 4vh;
margin-left: 3vw;
`

const FormProject = () => {
	const [name, setName] = useState('');
	const [address, setAddress] = useState('');
	const [minimum, setMinimum] = useState('');
	const [maximum, setMaximum] = useState('');
	const [rate, setRate] = useState('');
	const [presale, setPresale] = useState('');
	const [lockTime, setLockTime] = useState('');
	const [sent, setSent] = useState(false);
	const sheet='https://sheet.best/api/sheets/25a1b0be-167a-4e34-b294-0b8f73d277c0';
	const handleSubmit = (e) => {
		e.preventDefault();

		const object = { name, address, minimum, maximum, rate, presale, lockTime };

		axios.post(sheet, object)
		.then((response) => {
			console.log(response);
		});
		setSent(true);
	};
	if (!sent) {
    	return (
	<Frame>
      	<Container fluid className="container">
        <Header as='h2'>Submit Your Project</Header>
        <Form className="form">
          <Form.Field>
            <label>Name</label>
            <input placeholder='Enter project name' onChange={(e) => setName(e.target.value)}/>
          </Form.Field>
		  <Form.Field>
            <label>Token Address</label>
            <input placeholder='Enter token address' onChange={(e) => setAddress(e.target.value)}/>
          </Form.Field>
          <Form.Field>
            <label>Minimum Contribution (BNB)</label>
            <input placeholder='Enter project minimum contribution' onChange={(e) => setMinimum(e.target.value)}/>
          </Form.Field>
		  <Form.Field>
            <label>Maximum Contribution (BNB)</label>
            <input placeholder='Enter project maximum contribution' onChange={(e) => setMaximum(e.target.value)}/>
          </Form.Field>
          <Form.Field>
            <label>Pre-sale rate (amount of tokens user gets for a deposit of 1 bnb)</label>
            <input placeholder='Enter project pre-sale rate' onChange={(e) => setRate(e.target.value)} />
          </Form.Field>
          <Form.Field>
            <label>Presale Cap</label>
            <input placeholder='Enter presale cap' onChange={(e) => setPresale(e.target.value)}/>
          </Form.Field>
          <Form.Field>
            <label>Liquidity Lock Time (months)</label>
            <input placeholder='Enter Liquidity Lock Up Time' onChange={(e) => setLockTime(e.target.value)}/>
          </Form.Field>
          
          <Button color="blue" type='submit' onClick={handleSubmit}>Submit</Button>
        </Form>
      </Container>
      </Frame>
    	)
	} else {
		return (
			<Thx>
			<p>Thank you for your submission!</p>
			<p>Your project has been listed.</p>
			<p>Reload the front page to see it.</p>
			</Thx>
		)
	}
}

export default FormProject;
