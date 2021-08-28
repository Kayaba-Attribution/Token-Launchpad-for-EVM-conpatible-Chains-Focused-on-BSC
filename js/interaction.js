

import { ethers } from "./ethers_library.js";

console.log("Ethers imported success")

// A Web3Provider wraps a standard Web3 provider, which is
// what Metamask injects as window.ethereum into each page


// The Metamask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
var provider;
var signer;
var accounts;



// Ask the user to connect the wallet, if there is any error
// then return otherwise connect and check the network chain
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
      console.log("-- fend --")
}
const connectButton = document.querySelector('.btn_connect_wallet');
connectButton.addEventListener('click', async () => {
    console.log("Opening requests")
    await connect()
});












// variable to save the contract object
var AnyTokenContract;
var connectedTokenAddress;
// takes a contract address, creates a contract object and uses it to get the name, decimals, etc
async function AnyTokenConnection(input_address){

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
        document.querySelector("#t_name").textContent = name;
        document.querySelector("#t_symbol").textContent = symbol;
        document.querySelector("#t_decimals").textContent = decimals;
        document.querySelector("#t_balance").textContent = balance;
        console.log("-- fend --")
    }
    catch(e){
        console.log("No connection stablished, check wallet connection or token address")
    }




}

const AnyTokenConnectButton = document.querySelector('.btn_anyToken_connect');
AnyTokenConnectButton.addEventListener('click', async () => {
    AnyTokenConnection(document.querySelector('#token_address_input').value)
});













var DeployPresaleButton = document.querySelector('.deploy_presale');

async function DeployPresale(){
    //bnb = ethers.utils.parseEther( bnb_ )

    const abi = [
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
            "name": "getRate",
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

    const bytecode = {
        "generatedSources": [
            {
                "ast": {
                    "nodeType": "YulBlock",
                    "src": "0:1634:1",
                    "statements": [
                        {
                            "body": {
                                "nodeType": "YulBlock",
                                "src": "70:80:1",
                                "statements": [
                                    {
                                        "nodeType": "YulAssignment",
                                        "src": "80:22:1",
                                        "value": {
                                            "arguments": [
                                                {
                                                    "name": "offset",
                                                    "nodeType": "YulIdentifier",
                                                    "src": "95:6:1"
                                                }
                                            ],
                                            "functionName": {
                                                "name": "mload",
                                                "nodeType": "YulIdentifier",
                                                "src": "89:5:1"
                                            },
                                            "nodeType": "YulFunctionCall",
                                            "src": "89:13:1"
                                        },
                                        "variableNames": [
                                            {
                                                "name": "value",
                                                "nodeType": "YulIdentifier",
                                                "src": "80:5:1"
                                            }
                                        ]
                                    },
                                    {
                                        "expression": {
                                            "arguments": [
                                                {
                                                    "name": "value",
                                                    "nodeType": "YulIdentifier",
                                                    "src": "138:5:1"
                                                }
                                            ],
                                            "functionName": {
                                                "name": "validator_revert_t_address",
                                                "nodeType": "YulIdentifier",
                                                "src": "111:26:1"
                                            },
                                            "nodeType": "YulFunctionCall",
                                            "src": "111:33:1"
                                        },
                                        "nodeType": "YulExpressionStatement",
                                        "src": "111:33:1"
                                    }
                                ]
                            },
                            "name": "abi_decode_t_address_fromMemory",
                            "nodeType": "YulFunctionDefinition",
                            "parameters": [
                                {
                                    "name": "offset",
                                    "nodeType": "YulTypedName",
                                    "src": "48:6:1",
                                    "type": ""
                                },
                                {
                                    "name": "end",
                                    "nodeType": "YulTypedName",
                                    "src": "56:3:1",
                                    "type": ""
                                }
                            ],
                            "returnVariables": [
                                {
                                    "name": "value",
                                    "nodeType": "YulTypedName",
                                    "src": "64:5:1",
                                    "type": ""
                                }
                            ],
                            "src": "7:143:1"
                        },
                        {
                            "body": {
                                "nodeType": "YulBlock",
                                "src": "219:80:1",
                                "statements": [
                                    {
                                        "nodeType": "YulAssignment",
                                        "src": "229:22:1",
                                        "value": {
                                            "arguments": [
                                                {
                                                    "name": "offset",
                                                    "nodeType": "YulIdentifier",
                                                    "src": "244:6:1"
                                                }
                                            ],
                                            "functionName": {
                                                "name": "mload",
                                                "nodeType": "YulIdentifier",
                                                "src": "238:5:1"
                                            },
                                            "nodeType": "YulFunctionCall",
                                            "src": "238:13:1"
                                        },
                                        "variableNames": [
                                            {
                                                "name": "value",
                                                "nodeType": "YulIdentifier",
                                                "src": "229:5:1"
                                            }
                                        ]
                                    },
                                    {
                                        "expression": {
                                            "arguments": [
                                                {
                                                    "name": "value",
                                                    "nodeType": "YulIdentifier",
                                                    "src": "287:5:1"
                                                }
                                            ],
                                            "functionName": {
                                                "name": "validator_revert_t_uint256",
                                                "nodeType": "YulIdentifier",
                                                "src": "260:26:1"
                                            },
                                            "nodeType": "YulFunctionCall",
                                            "src": "260:33:1"
                                        },
                                        "nodeType": "YulExpressionStatement",
                                        "src": "260:33:1"
                                    }
                                ]
                            },
                            "name": "abi_decode_t_uint256_fromMemory",
                            "nodeType": "YulFunctionDefinition",
                            "parameters": [
                                {
                                    "name": "offset",
                                    "nodeType": "YulTypedName",
                                    "src": "197:6:1",
                                    "type": ""
                                },
                                {
                                    "name": "end",
                                    "nodeType": "YulTypedName",
                                    "src": "205:3:1",
                                    "type": ""
                                }
                            ],
                            "returnVariables": [
                                {
                                    "name": "value",
                                    "nodeType": "YulTypedName",
                                    "src": "213:5:1",
                                    "type": ""
                                }
                            ],
                            "src": "156:143:1"
                        },
                        {
                            "body": {
                                "nodeType": "YulBlock",
                                "src": "433:625:1",
                                "statements": [
                                    {
                                        "body": {
                                            "nodeType": "YulBlock",
                                            "src": "480:16:1",
                                            "statements": [
                                                {
                                                    "expression": {
                                                        "arguments": [
                                                            {
                                                                "kind": "number",
                                                                "nodeType": "YulLiteral",
                                                                "src": "489:1:1",
                                                                "type": "",
                                                                "value": "0"
                                                            },
                                                            {
                                                                "kind": "number",
                                                                "nodeType": "YulLiteral",
                                                                "src": "492:1:1",
                                                                "type": "",
                                                                "value": "0"
                                                            }
                                                        ],
                                                        "functionName": {
                                                            "name": "revert",
                                                            "nodeType": "YulIdentifier",
                                                            "src": "482:6:1"
                                                        },
                                                        "nodeType": "YulFunctionCall",
                                                        "src": "482:12:1"
                                                    },
                                                    "nodeType": "YulExpressionStatement",
                                                    "src": "482:12:1"
                                                }
                                            ]
                                        },
                                        "condition": {
                                            "arguments": [
                                                {
                                                    "arguments": [
                                                        {
                                                            "name": "dataEnd",
                                                            "nodeType": "YulIdentifier",
                                                            "src": "454:7:1"
                                                        },
                                                        {
                                                            "name": "headStart",
                                                            "nodeType": "YulIdentifier",
                                                            "src": "463:9:1"
                                                        }
                                                    ],
                                                    "functionName": {
                                                        "name": "sub",
                                                        "nodeType": "YulIdentifier",
                                                        "src": "450:3:1"
                                                    },
                                                    "nodeType": "YulFunctionCall",
                                                    "src": "450:23:1"
                                                },
                                                {
                                                    "kind": "number",
                                                    "nodeType": "YulLiteral",
                                                    "src": "475:3:1",
                                                    "type": "",
                                                    "value": "128"
                                                }
                                            ],
                                            "functionName": {
                                                "name": "slt",
                                                "nodeType": "YulIdentifier",
                                                "src": "446:3:1"
                                            },
                                            "nodeType": "YulFunctionCall",
                                            "src": "446:33:1"
                                        },
                                        "nodeType": "YulIf",
                                        "src": "443:2:1"
                                    },
                                    {
                                        "nodeType": "YulBlock",
                                        "src": "506:128:1",
                                        "statements": [
                                            {
                                                "nodeType": "YulVariableDeclaration",
                                                "src": "521:15:1",
                                                "value": {
                                                    "kind": "number",
                                                    "nodeType": "YulLiteral",
                                                    "src": "535:1:1",
                                                    "type": "",
                                                    "value": "0"
                                                },
                                                "variables": [
                                                    {
                                                        "name": "offset",
                                                        "nodeType": "YulTypedName",
                                                        "src": "525:6:1",
                                                        "type": ""
                                                    }
                                                ]
                                            },
                                            {
                                                "nodeType": "YulAssignment",
                                                "src": "550:74:1",
                                                "value": {
                                                    "arguments": [
                                                        {
                                                            "arguments": [
                                                                {
                                                                    "name": "headStart",
                                                                    "nodeType": "YulIdentifier",
                                                                    "src": "596:9:1"
                                                                },
                                                                {
                                                                    "name": "offset",
                                                                    "nodeType": "YulIdentifier",
                                                                    "src": "607:6:1"
                                                                }
                                                            ],
                                                            "functionName": {
                                                                "name": "add",
                                                                "nodeType": "YulIdentifier",
                                                                "src": "592:3:1"
                                                            },
                                                            "nodeType": "YulFunctionCall",
                                                            "src": "592:22:1"
                                                        },
                                                        {
                                                            "name": "dataEnd",
                                                            "nodeType": "YulIdentifier",
                                                            "src": "616:7:1"
                                                        }
                                                    ],
                                                    "functionName": {
                                                        "name": "abi_decode_t_uint256_fromMemory",
                                                        "nodeType": "YulIdentifier",
                                                        "src": "560:31:1"
                                                    },
                                                    "nodeType": "YulFunctionCall",
                                                    "src": "560:64:1"
                                                },
                                                "variableNames": [
                                                    {
                                                        "name": "value0",
                                                        "nodeType": "YulIdentifier",
                                                        "src": "550:6:1"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "nodeType": "YulBlock",
                                        "src": "644:129:1",
                                        "statements": [
                                            {
                                                "nodeType": "YulVariableDeclaration",
                                                "src": "659:16:1",
                                                "value": {
                                                    "kind": "number",
                                                    "nodeType": "YulLiteral",
                                                    "src": "673:2:1",
                                                    "type": "",
                                                    "value": "32"
                                                },
                                                "variables": [
                                                    {
                                                        "name": "offset",
                                                        "nodeType": "YulTypedName",
                                                        "src": "663:6:1",
                                                        "type": ""
                                                    }
                                                ]
                                            },
                                            {
                                                "nodeType": "YulAssignment",
                                                "src": "689:74:1",
                                                "value": {
                                                    "arguments": [
                                                        {
                                                            "arguments": [
                                                                {
                                                                    "name": "headStart",
                                                                    "nodeType": "YulIdentifier",
                                                                    "src": "735:9:1"
                                                                },
                                                                {
                                                                    "name": "offset",
                                                                    "nodeType": "YulIdentifier",
                                                                    "src": "746:6:1"
                                                                }
                                                            ],
                                                            "functionName": {
                                                                "name": "add",
                                                                "nodeType": "YulIdentifier",
                                                                "src": "731:3:1"
                                                            },
                                                            "nodeType": "YulFunctionCall",
                                                            "src": "731:22:1"
                                                        },
                                                        {
                                                            "name": "dataEnd",
                                                            "nodeType": "YulIdentifier",
                                                            "src": "755:7:1"
                                                        }
                                                    ],
                                                    "functionName": {
                                                        "name": "abi_decode_t_uint256_fromMemory",
                                                        "nodeType": "YulIdentifier",
                                                        "src": "699:31:1"
                                                    },
                                                    "nodeType": "YulFunctionCall",
                                                    "src": "699:64:1"
                                                },
                                                "variableNames": [
                                                    {
                                                        "name": "value1",
                                                        "nodeType": "YulIdentifier",
                                                        "src": "689:6:1"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "nodeType": "YulBlock",
                                        "src": "783:129:1",
                                        "statements": [
                                            {
                                                "nodeType": "YulVariableDeclaration",
                                                "src": "798:16:1",
                                                "value": {
                                                    "kind": "number",
                                                    "nodeType": "YulLiteral",
                                                    "src": "812:2:1",
                                                    "type": "",
                                                    "value": "64"
                                                },
                                                "variables": [
                                                    {
                                                        "name": "offset",
                                                        "nodeType": "YulTypedName",
                                                        "src": "802:6:1",
                                                        "type": ""
                                                    }
                                                ]
                                            },
                                            {
                                                "nodeType": "YulAssignment",
                                                "src": "828:74:1",
                                                "value": {
                                                    "arguments": [
                                                        {
                                                            "arguments": [
                                                                {
                                                                    "name": "headStart",
                                                                    "nodeType": "YulIdentifier",
                                                                    "src": "874:9:1"
                                                                },
                                                                {
                                                                    "name": "offset",
                                                                    "nodeType": "YulIdentifier",
                                                                    "src": "885:6:1"
                                                                }
                                                            ],
                                                            "functionName": {
                                                                "name": "add",
                                                                "nodeType": "YulIdentifier",
                                                                "src": "870:3:1"
                                                            },
                                                            "nodeType": "YulFunctionCall",
                                                            "src": "870:22:1"
                                                        },
                                                        {
                                                            "name": "dataEnd",
                                                            "nodeType": "YulIdentifier",
                                                            "src": "894:7:1"
                                                        }
                                                    ],
                                                    "functionName": {
                                                        "name": "abi_decode_t_uint256_fromMemory",
                                                        "nodeType": "YulIdentifier",
                                                        "src": "838:31:1"
                                                    },
                                                    "nodeType": "YulFunctionCall",
                                                    "src": "838:64:1"
                                                },
                                                "variableNames": [
                                                    {
                                                        "name": "value2",
                                                        "nodeType": "YulIdentifier",
                                                        "src": "828:6:1"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "nodeType": "YulBlock",
                                        "src": "922:129:1",
                                        "statements": [
                                            {
                                                "nodeType": "YulVariableDeclaration",
                                                "src": "937:16:1",
                                                "value": {
                                                    "kind": "number",
                                                    "nodeType": "YulLiteral",
                                                    "src": "951:2:1",
                                                    "type": "",
                                                    "value": "96"
                                                },
                                                "variables": [
                                                    {
                                                        "name": "offset",
                                                        "nodeType": "YulTypedName",
                                                        "src": "941:6:1",
                                                        "type": ""
                                                    }
                                                ]
                                            },
                                            {
                                                "nodeType": "YulAssignment",
                                                "src": "967:74:1",
                                                "value": {
                                                    "arguments": [
                                                        {
                                                            "arguments": [
                                                                {
                                                                    "name": "headStart",
                                                                    "nodeType": "YulIdentifier",
                                                                    "src": "1013:9:1"
                                                                },
                                                                {
                                                                    "name": "offset",
                                                                    "nodeType": "YulIdentifier",
                                                                    "src": "1024:6:1"
                                                                }
                                                            ],
                                                            "functionName": {
                                                                "name": "add",
                                                                "nodeType": "YulIdentifier",
                                                                "src": "1009:3:1"
                                                            },
                                                            "nodeType": "YulFunctionCall",
                                                            "src": "1009:22:1"
                                                        },
                                                        {
                                                            "name": "dataEnd",
                                                            "nodeType": "YulIdentifier",
                                                            "src": "1033:7:1"
                                                        }
                                                    ],
                                                    "functionName": {
                                                        "name": "abi_decode_t_address_fromMemory",
                                                        "nodeType": "YulIdentifier",
                                                        "src": "977:31:1"
                                                    },
                                                    "nodeType": "YulFunctionCall",
                                                    "src": "977:64:1"
                                                },
                                                "variableNames": [
                                                    {
                                                        "name": "value3",
                                                        "nodeType": "YulIdentifier",
                                                        "src": "967:6:1"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            "name": "abi_decode_tuple_t_uint256t_uint256t_uint256t_address_fromMemory",
                            "nodeType": "YulFunctionDefinition",
                            "parameters": [
                                {
                                    "name": "headStart",
                                    "nodeType": "YulTypedName",
                                    "src": "379:9:1",
                                    "type": ""
                                },
                                {
                                    "name": "dataEnd",
                                    "nodeType": "YulTypedName",
                                    "src": "390:7:1",
                                    "type": ""
                                }
                            ],
                            "returnVariables": [
                                {
                                    "name": "value0",
                                    "nodeType": "YulTypedName",
                                    "src": "402:6:1",
                                    "type": ""
                                },
                                {
                                    "name": "value1",
                                    "nodeType": "YulTypedName",
                                    "src": "410:6:1",
                                    "type": ""
                                },
                                {
                                    "name": "value2",
                                    "nodeType": "YulTypedName",
                                    "src": "418:6:1",
                                    "type": ""
                                },
                                {
                                    "name": "value3",
                                    "nodeType": "YulTypedName",
                                    "src": "426:6:1",
                                    "type": ""
                                }
                            ],
                            "src": "305:753:1"
                        },
                        {
                            "body": {
                                "nodeType": "YulBlock",
                                "src": "1109:51:1",
                                "statements": [
                                    {
                                        "nodeType": "YulAssignment",
                                        "src": "1119:35:1",
                                        "value": {
                                            "arguments": [
                                                {
                                                    "name": "value",
                                                    "nodeType": "YulIdentifier",
                                                    "src": "1148:5:1"
                                                }
                                            ],
                                            "functionName": {
                                                "name": "cleanup_t_uint160",
                                                "nodeType": "YulIdentifier",
                                                "src": "1130:17:1"
                                            },
                                            "nodeType": "YulFunctionCall",
                                            "src": "1130:24:1"
                                        },
                                        "variableNames": [
                                            {
                                                "name": "cleaned",
                                                "nodeType": "YulIdentifier",
                                                "src": "1119:7:1"
                                            }
                                        ]
                                    }
                                ]
                            },
                            "name": "cleanup_t_address",
                            "nodeType": "YulFunctionDefinition",
                            "parameters": [
                                {
                                    "name": "value",
                                    "nodeType": "YulTypedName",
                                    "src": "1091:5:1",
                                    "type": ""
                                }
                            ],
                            "returnVariables": [
                                {
                                    "name": "cleaned",
                                    "nodeType": "YulTypedName",
                                    "src": "1101:7:1",
                                    "type": ""
                                }
                            ],
                            "src": "1064:96:1"
                        },
                        {
                            "body": {
                                "nodeType": "YulBlock",
                                "src": "1211:81:1",
                                "statements": [
                                    {
                                        "nodeType": "YulAssignment",
                                        "src": "1221:65:1",
                                        "value": {
                                            "arguments": [
                                                {
                                                    "name": "value",
                                                    "nodeType": "YulIdentifier",
                                                    "src": "1236:5:1"
                                                },
                                                {
                                                    "kind": "number",
                                                    "nodeType": "YulLiteral",
                                                    "src": "1243:42:1",
                                                    "type": "",
                                                    "value": "0xffffffffffffffffffffffffffffffffffffffff"
                                                }
                                            ],
                                            "functionName": {
                                                "name": "and",
                                                "nodeType": "YulIdentifier",
                                                "src": "1232:3:1"
                                            },
                                            "nodeType": "YulFunctionCall",
                                            "src": "1232:54:1"
                                        },
                                        "variableNames": [
                                            {
                                                "name": "cleaned",
                                                "nodeType": "YulIdentifier",
                                                "src": "1221:7:1"
                                            }
                                        ]
                                    }
                                ]
                            },
                            "name": "cleanup_t_uint160",
                            "nodeType": "YulFunctionDefinition",
                            "parameters": [
                                {
                                    "name": "value",
                                    "nodeType": "YulTypedName",
                                    "src": "1193:5:1",
                                    "type": ""
                                }
                            ],
                            "returnVariables": [
                                {
                                    "name": "cleaned",
                                    "nodeType": "YulTypedName",
                                    "src": "1203:7:1",
                                    "type": ""
                                }
                            ],
                            "src": "1166:126:1"
                        },
                        {
                            "body": {
                                "nodeType": "YulBlock",
                                "src": "1343:32:1",
                                "statements": [
                                    {
                                        "nodeType": "YulAssignment",
                                        "src": "1353:16:1",
                                        "value": {
                                            "name": "value",
                                            "nodeType": "YulIdentifier",
                                            "src": "1364:5:1"
                                        },
                                        "variableNames": [
                                            {
                                                "name": "cleaned",
                                                "nodeType": "YulIdentifier",
                                                "src": "1353:7:1"
                                            }
                                        ]
                                    }
                                ]
                            },
                            "name": "cleanup_t_uint256",
                            "nodeType": "YulFunctionDefinition",
                            "parameters": [
                                {
                                    "name": "value",
                                    "nodeType": "YulTypedName",
                                    "src": "1325:5:1",
                                    "type": ""
                                }
                            ],
                            "returnVariables": [
                                {
                                    "name": "cleaned",
                                    "nodeType": "YulTypedName",
                                    "src": "1335:7:1",
                                    "type": ""
                                }
                            ],
                            "src": "1298:77:1"
                        },
                        {
                            "body": {
                                "nodeType": "YulBlock",
                                "src": "1424:79:1",
                                "statements": [
                                    {
                                        "body": {
                                            "nodeType": "YulBlock",
                                            "src": "1481:16:1",
                                            "statements": [
                                                {
                                                    "expression": {
                                                        "arguments": [
                                                            {
                                                                "kind": "number",
                                                                "nodeType": "YulLiteral",
                                                                "src": "1490:1:1",
                                                                "type": "",
                                                                "value": "0"
                                                            },
                                                            {
                                                                "kind": "number",
                                                                "nodeType": "YulLiteral",
                                                                "src": "1493:1:1",
                                                                "type": "",
                                                                "value": "0"
                                                            }
                                                        ],
                                                        "functionName": {
                                                            "name": "revert",
                                                            "nodeType": "YulIdentifier",
                                                            "src": "1483:6:1"
                                                        },
                                                        "nodeType": "YulFunctionCall",
                                                        "src": "1483:12:1"
                                                    },
                                                    "nodeType": "YulExpressionStatement",
                                                    "src": "1483:12:1"
                                                }
                                            ]
                                        },
                                        "condition": {
                                            "arguments": [
                                                {
                                                    "arguments": [
                                                        {
                                                            "name": "value",
                                                            "nodeType": "YulIdentifier",
                                                            "src": "1447:5:1"
                                                        },
                                                        {
                                                            "arguments": [
                                                                {
                                                                    "name": "value",
                                                                    "nodeType": "YulIdentifier",
                                                                    "src": "1472:5:1"
                                                                }
                                                            ],
                                                            "functionName": {
                                                                "name": "cleanup_t_address",
                                                                "nodeType": "YulIdentifier",
                                                                "src": "1454:17:1"
                                                            },
                                                            "nodeType": "YulFunctionCall",
                                                            "src": "1454:24:1"
                                                        }
                                                    ],
                                                    "functionName": {
                                                        "name": "eq",
                                                        "nodeType": "YulIdentifier",
                                                        "src": "1444:2:1"
                                                    },
                                                    "nodeType": "YulFunctionCall",
                                                    "src": "1444:35:1"
                                                }
                                            ],
                                            "functionName": {
                                                "name": "iszero",
                                                "nodeType": "YulIdentifier",
                                                "src": "1437:6:1"
                                            },
                                            "nodeType": "YulFunctionCall",
                                            "src": "1437:43:1"
                                        },
                                        "nodeType": "YulIf",
                                        "src": "1434:2:1"
                                    }
                                ]
                            },
                            "name": "validator_revert_t_address",
                            "nodeType": "YulFunctionDefinition",
                            "parameters": [
                                {
                                    "name": "value",
                                    "nodeType": "YulTypedName",
                                    "src": "1417:5:1",
                                    "type": ""
                                }
                            ],
                            "src": "1381:122:1"
                        },
                        {
                            "body": {
                                "nodeType": "YulBlock",
                                "src": "1552:79:1",
                                "statements": [
                                    {
                                        "body": {
                                            "nodeType": "YulBlock",
                                            "src": "1609:16:1",
                                            "statements": [
                                                {
                                                    "expression": {
                                                        "arguments": [
                                                            {
                                                                "kind": "number",
                                                                "nodeType": "YulLiteral",
                                                                "src": "1618:1:1",
                                                                "type": "",
                                                                "value": "0"
                                                            },
                                                            {
                                                                "kind": "number",
                                                                "nodeType": "YulLiteral",
                                                                "src": "1621:1:1",
                                                                "type": "",
                                                                "value": "0"
                                                            }
                                                        ],
                                                        "functionName": {
                                                            "name": "revert",
                                                            "nodeType": "YulIdentifier",
                                                            "src": "1611:6:1"
                                                        },
                                                        "nodeType": "YulFunctionCall",
                                                        "src": "1611:12:1"
                                                    },
                                                    "nodeType": "YulExpressionStatement",
                                                    "src": "1611:12:1"
                                                }
                                            ]
                                        },
                                        "condition": {
                                            "arguments": [
                                                {
                                                    "arguments": [
                                                        {
                                                            "name": "value",
                                                            "nodeType": "YulIdentifier",
                                                            "src": "1575:5:1"
                                                        },
                                                        {
                                                            "arguments": [
                                                                {
                                                                    "name": "value",
                                                                    "nodeType": "YulIdentifier",
                                                                    "src": "1600:5:1"
                                                                }
                                                            ],
                                                            "functionName": {
                                                                "name": "cleanup_t_uint256",
                                                                "nodeType": "YulIdentifier",
                                                                "src": "1582:17:1"
                                                            },
                                                            "nodeType": "YulFunctionCall",
                                                            "src": "1582:24:1"
                                                        }
                                                    ],
                                                    "functionName": {
                                                        "name": "eq",
                                                        "nodeType": "YulIdentifier",
                                                        "src": "1572:2:1"
                                                    },
                                                    "nodeType": "YulFunctionCall",
                                                    "src": "1572:35:1"
                                                }
                                            ],
                                            "functionName": {
                                                "name": "iszero",
                                                "nodeType": "YulIdentifier",
                                                "src": "1565:6:1"
                                            },
                                            "nodeType": "YulFunctionCall",
                                            "src": "1565:43:1"
                                        },
                                        "nodeType": "YulIf",
                                        "src": "1562:2:1"
                                    }
                                ]
                            },
                            "name": "validator_revert_t_uint256",
                            "nodeType": "YulFunctionDefinition",
                            "parameters": [
                                {
                                    "name": "value",
                                    "nodeType": "YulTypedName",
                                    "src": "1545:5:1",
                                    "type": ""
                                }
                            ],
                            "src": "1509:122:1"
                        }
                    ]
                },
                "contents": "{\n\n    function abi_decode_t_address_fromMemory(offset, end) -> value {\n        value := mload(offset)\n        validator_revert_t_address(value)\n    }\n\n    function abi_decode_t_uint256_fromMemory(offset, end) -> value {\n        value := mload(offset)\n        validator_revert_t_uint256(value)\n    }\n\n    function abi_decode_tuple_t_uint256t_uint256t_uint256t_address_fromMemory(headStart, dataEnd) -> value0, value1, value2, value3 {\n        if slt(sub(dataEnd, headStart), 128) { revert(0, 0) }\n\n        {\n\n            let offset := 0\n\n            value0 := abi_decode_t_uint256_fromMemory(add(headStart, offset), dataEnd)\n        }\n\n        {\n\n            let offset := 32\n\n            value1 := abi_decode_t_uint256_fromMemory(add(headStart, offset), dataEnd)\n        }\n\n        {\n\n            let offset := 64\n\n            value2 := abi_decode_t_uint256_fromMemory(add(headStart, offset), dataEnd)\n        }\n\n        {\n\n            let offset := 96\n\n            value3 := abi_decode_t_address_fromMemory(add(headStart, offset), dataEnd)\n        }\n\n    }\n\n    function cleanup_t_address(value) -> cleaned {\n        cleaned := cleanup_t_uint160(value)\n    }\n\n    function cleanup_t_uint160(value) -> cleaned {\n        cleaned := and(value, 0xffffffffffffffffffffffffffffffffffffffff)\n    }\n\n    function cleanup_t_uint256(value) -> cleaned {\n        cleaned := value\n    }\n\n    function validator_revert_t_address(value) {\n        if iszero(eq(value, cleanup_t_address(value))) { revert(0, 0) }\n    }\n\n    function validator_revert_t_uint256(value) {\n        if iszero(eq(value, cleanup_t_uint256(value))) { revert(0, 0) }\n    }\n\n}\n",
                "id": 1,
                "language": "Yul",
                "name": "#utility.yul"
            }
        ],
        "linkReferences": {},
        "object": "6101206040526000600360006101000a81548160ff0219169083151502179055506000600360016101000a81548160ff02191690831515021790555060006007553480156200004d57600080fd5b506040516200264638038062002646833981810160405281019062000073919062000186565b8360a081815250508260c081815250508160e081815250508073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff1660601b8152505073d99d1c33f9fc3444f8101754abc46c52416550d173ffffffffffffffffffffffffffffffffffffffff166101008173ffffffffffffffffffffffffffffffffffffffff1660601b81525050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505062000264565b600081519050620001698162000230565b92915050565b60008151905062000180816200024a565b92915050565b600080600080608085870312156200019d57600080fd5b6000620001ad878288016200016f565b9450506020620001c0878288016200016f565b9350506040620001d3878288016200016f565b9250506060620001e68782880162000158565b91505092959194509250565b6000620001ff8262000206565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6200023b81620001f2565b81146200024757600080fd5b50565b620002558162000226565b81146200026157600080fd5b50565b60805160601c60a05160c05160e0516101005160601c6123196200032d600039600081816107ff0152818161182301526118b501526000818161082501526111fc015260008181610b1501526111990152600081816107a701528181610c35015281816112c80152611330015260008181610643015281816106f1015281816107d90152818161090a015281816109b801528181610b3b01528181610c6601528181610d3c01528181610e4001528181610eee015281816117e701526118f201526123196000f3fe6080604052600436106101b75760003560e01c80634b0b945e116100ec5780639136a5ec1161008a578063cc6a1a0611610064578063cc6a1a06146105de578063d0e30db0146105f5578063d33aa8e5146105ff578063e766307914610616576101b7565b80639136a5ec1461055f57806392ab24421461059c578063b0b9603b146105b3576101b7565b8063521886b3116100c6578063521886b3146104a3578063679aefce146104cc5780638aeb8707146104f75780638da5cb5b14610534576101b7565b80634b0b945e146104365780634bb278f314610461578063517311ea14610478576101b7565b80634123fec711610159578063440e1e6911610133578063440e1e691461037a57806347535d7b146103b757806348c54b9d146103e257806349003551146103f9576101b7565b80634123fec7146102e757806342e94c9014610312578063432480841461034f576101b7565b80631005108911610195578063100510891461023b5780631694505e146102665780631e377df0146102915780632c4e722e146102bc576101b7565b806305ab421d146101bc57806307fb363a146101e55780630d05651314610210575b600080fd5b3480156101c857600080fd5b506101e360048036038101906101de9190611a86565b610641565b005b3480156101f157600080fd5b506101fa6107a3565b604051610207919061202d565b60405180910390f35b34801561021c57600080fd5b506102256107cb565b604051610232919061202d565b60405180910390f35b34801561024757600080fd5b506102506107d5565b60405161025d9190611e12565b60405180910390f35b34801561027257600080fd5b5061027b6107fd565b6040516102889190611f32565b60405180910390f35b34801561029d57600080fd5b506102a6610821565b6040516102b3919061202d565b60405180910390f35b3480156102c857600080fd5b506102d1610849565b6040516102de919061202d565b60405180910390f35b3480156102f357600080fd5b506102fc61084f565b604051610309919061202d565b60405180910390f35b34801561031e57600080fd5b5061033960048036038101906103349190611a5d565b610855565b604051610346919061202d565b60405180910390f35b34801561035b57600080fd5b5061036461086d565b6040516103719190611f17565b60405180910390f35b34801561038657600080fd5b506103a1600480360381019061039c9190611a5d565b610884565b6040516103ae919061202d565b60405180910390f35b3480156103c357600080fd5b506103cc6108e4565b6040516103d99190611f17565b60405180910390f35b3480156103ee57600080fd5b506103f76108fb565b005b34801561040557600080fd5b50610420600480360381019061041b9190611a5d565b610aae565b60405161042d919061202d565b60405180910390f35b34801561044257600080fd5b5061044b610af7565b604051610458919061202d565b60405180910390f35b34801561046d57600080fd5b50610476610b01565b005b34801561048457600080fd5b5061048d610b11565b60405161049a919061202d565b60405180910390f35b3480156104af57600080fd5b506104ca60048036038101906104c59190611aeb565b610b39565b005b3480156104d857600080fd5b506104e1610c2a565b6040516104ee919061202d565b60405180910390f35b34801561050357600080fd5b5061051e60048036038101906105199190611a5d565b610c62565b60405161052b919061202d565b60405180910390f35b34801561054057600080fd5b50610549610d14565b6040516105569190611e12565b60405180910390f35b34801561056b57600080fd5b5061058660048036038101906105819190611a5d565b610d38565b604051610593919061202d565b60405180910390f35b3480156105a857600080fd5b506105b1610dec565b005b3480156105bf57600080fd5b506105c861102d565b6040516105d5919061202d565b60405180910390f35b3480156105ea57600080fd5b506105f3611033565b005b6105fd611197565b005b34801561060b57600080fd5b50610614611500565b005b34801561062257600080fd5b5061062b6117bc565b6040516106389190611e12565b60405180910390f35b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663095ea7b330836040518363ffffffff1660e01b815260040161069c929190611e8d565b602060405180830381600087803b1580156106b657600080fd5b505af11580156106ca573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106ee9190611ac2565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd3084846040518463ffffffff1660e01b815260040161074c93929190611e56565b602060405180830381600087803b15801561076657600080fd5b505af115801561077a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061079e9190611ac2565b505050565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b6000600454905090565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b7f000000000000000000000000000000000000000000000000000000000000000081565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b60065481565b60045481565b60086020528060005260406000206000915090505481565b6000600360009054906101000a900460ff16905090565b60008061088f610c2a565b600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546108d991906120eb565b905080915050919050565b6000600360019054906101000a900460ff16905090565b600061090633610884565b90507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663095ea7b330836040518363ffffffff1660e01b8152600401610963929190611e8d565b602060405180830381600087803b15801561097d57600080fd5b505af1158015610991573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109b59190611ac2565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd3033846040518463ffffffff1660e01b8152600401610a1393929190611e56565b602060405180830381600087803b158015610a2d57600080fd5b505af1158015610a41573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a659190611ac2565b506000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555050565b6000600860008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6000600254905090565b610b0f6004546002546117e5565b565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd3330846040518463ffffffff1660e01b8152600401610b9693929190611e56565b602060405180830381600087803b158015610bb057600080fd5b505af1158015610bc4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610be89190611ac2565b506001600360016101000a81548160ff021916908315150217905550610c0f8160026119b1565b600481905550610c21816004546119cc565b60058190555050565b600080610c596005547f00000000000000000000000000000000000000000000000000000000000000006119b1565b90508091505090565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231836040518263ffffffff1660e01b8152600401610cbd9190611e12565b60206040518083038186803b158015610cd557600080fd5b505afa158015610ce9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d0d9190611b14565b9050919050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e83306040518363ffffffff1660e01b8152600401610d95929190611e2d565b60206040518083038186803b158015610dad57600080fd5b505afa158015610dc1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610de59190611b14565b9050919050565b60005b60075481101561102a5760006009600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506000610e3c82610884565b90507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663095ea7b330836040518363ffffffff1660e01b8152600401610e99929190611e8d565b602060405180830381600087803b158015610eb357600080fd5b505af1158015610ec7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610eeb9190611ac2565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd3084846040518463ffffffff1660e01b8152600401610f4993929190611e56565b602060405180830381600087803b158015610f6357600080fd5b505af1158015610f77573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f9b9190611ac2565b506009600084815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600860008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000905550508080611022906121f7565b915050610def565b50565b60055481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146110c1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110b890611f8d565b60405180910390fd5b600047905060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168260405161110d90611dfd565b60006040518083038185875af1925050503d806000811461114a576040519150601f19603f3d011682016040523d82523d6000602084013e61114f565b606091505b5050905080611193576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161118a90611f4d565b60405180910390fd5b5050565b7f00000000000000000000000000000000000000000000000000000000000000003410156111fa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111f19061200d565b60405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000034111561125d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161125490611fad565b60405180910390fd5b600360009054906101000a900460ff16156112ad576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112a490611f6d565b60405180910390fd5b34600260008282546112bf9190612064565b925050819055507f0000000000000000000000000000000000000000000000000000000000000000600254111561132b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161132290611fed565b60405180910390fd5b6113547f00000000000000000000000000000000000000000000000000000000000000006119e2565b60025410611378576001600360006101000a81548160ff0219169083151502179055505b6000805b600754811015611405573373ffffffffffffffffffffffffffffffffffffffff166009600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156113f257600191505b80806113fd906121f7565b91505061137c565b50600015158115151461144d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161144490611fcd565b60405180910390fd5b3360096000600754815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600760008154809291906114f8906121f7565b919050555050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461158e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161158590611f8d565b60405180910390fd5b60005b60075481101561179e5760006009600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506000600860006009600086815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905060008273ffffffffffffffffffffffffffffffffffffffff168260405161167090611dfd565b60006040518083038185875af1925050503d80600081146116ad576040519150601f19603f3d011682016040523d82523d6000602084013e6116b2565b606091505b50509050806116f6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016116ed90611f4d565b60405180910390fd5b81600260008282546117089190612145565b925050819055506009600085815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600090555050508080611796906121f7565b915050611591565b506000600360006101000a81548160ff021916908315150217905550565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663095ea7b37f0000000000000000000000000000000000000000000000000000000000000000846040518363ffffffff1660e01b8152600401611860929190611e8d565b602060405180830381600087803b15801561187a57600080fd5b505af115801561188e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118b29190611ac2565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663f305d719827f00000000000000000000000000000000000000000000000000000000000000008560008060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff16426040518863ffffffff1660e01b815260040161195896959493929190611eb6565b6060604051808303818588803b15801561197157600080fd5b505af1158015611985573d6000803e3d6000fd5b50505050506040513d601f19601f820116820180604052508101906119aa9190611b3d565b5050505050565b60008082846119c091906120ba565b90508091505092915050565b600081836119da9190612145565b905092915050565b60008060648360636119f491906120eb565b6119fe91906120ba565b905080915050919050565b600081359050611a188161229e565b92915050565b600081519050611a2d816122b5565b92915050565b600081359050611a42816122cc565b92915050565b600081519050611a57816122cc565b92915050565b600060208284031215611a6f57600080fd5b6000611a7d84828501611a09565b91505092915050565b60008060408385031215611a9957600080fd5b6000611aa785828601611a09565b9250506020611ab885828601611a33565b9150509250929050565b600060208284031215611ad457600080fd5b6000611ae284828501611a1e565b91505092915050565b600060208284031215611afd57600080fd5b6000611b0b84828501611a33565b91505092915050565b600060208284031215611b2657600080fd5b6000611b3484828501611a48565b91505092915050565b600080600060608486031215611b5257600080fd5b6000611b6086828701611a48565b9350506020611b7186828701611a48565b9250506040611b8286828701611a48565b9150509250925092565b611b9581612179565b82525050565b611ba48161218b565b82525050565b611bb3816121c1565b82525050565b611bc2816121e5565b82525050565b6000611bd5601483612053565b91507f4661696c656420746f2073656e642045746865720000000000000000000000006000830152602082019050919050565b6000611c15601683612053565b91507f43617020697320616c72656164792072656163686564000000000000000000006000830152602082019050919050565b6000611c55600983612053565b91507f4e6f74206f776e657200000000000000000000000000000000000000000000006000830152602082019050919050565b6000611c95600083612048565b9150600082019050919050565b6000611caf601883612053565b91507f4465706f7369742056616c756520697320546f6f2042696700000000000000006000830152602082019050919050565b6000611cef602b83612053565b91507f596f75206861766520616c726561647920636f6e747269627574656420746f2060008301527f7468652070726573616c650000000000000000000000000000000000000000006020830152604082019050919050565b6000611d55602783612053565b91507f52657665727465643a20424e42206465706f73697420776f756c6420676f206f60008301527f76657220636170000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000611dbb601a83612053565b91507f4465706f7369742056616c756520697320546f6f20536d616c6c0000000000006000830152602082019050919050565b611df7816121b7565b82525050565b6000611e0882611c88565b9150819050919050565b6000602082019050611e276000830184611b8c565b92915050565b6000604082019050611e426000830185611b8c565b611e4f6020830184611b8c565b9392505050565b6000606082019050611e6b6000830186611b8c565b611e786020830185611b8c565b611e856040830184611dee565b949350505050565b6000604082019050611ea26000830185611b8c565b611eaf6020830184611dee565b9392505050565b600060c082019050611ecb6000830189611b8c565b611ed86020830188611dee565b611ee56040830187611bb9565b611ef26060830186611bb9565b611eff6080830185611b8c565b611f0c60a0830184611dee565b979650505050505050565b6000602082019050611f2c6000830184611b9b565b92915050565b6000602082019050611f476000830184611baa565b92915050565b60006020820190508181036000830152611f6681611bc8565b9050919050565b60006020820190508181036000830152611f8681611c08565b9050919050565b60006020820190508181036000830152611fa681611c48565b9050919050565b60006020820190508181036000830152611fc681611ca2565b9050919050565b60006020820190508181036000830152611fe681611ce2565b9050919050565b6000602082019050818103600083015261200681611d48565b9050919050565b6000602082019050818103600083015261202681611dae565b9050919050565b60006020820190506120426000830184611dee565b92915050565b600081905092915050565b600082825260208201905092915050565b600061206f826121b7565b915061207a836121b7565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156120af576120ae612240565b5b828201905092915050565b60006120c5826121b7565b91506120d0836121b7565b9250826120e0576120df61226f565b5b828204905092915050565b60006120f6826121b7565b9150612101836121b7565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561213a57612139612240565b5b828202905092915050565b6000612150826121b7565b915061215b836121b7565b92508282101561216e5761216d612240565b5b828203905092915050565b600061218482612197565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60006121cc826121d3565b9050919050565b60006121de82612197565b9050919050565b60006121f0826121b7565b9050919050565b6000612202826121b7565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561223557612234612240565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6122a781612179565b81146122b257600080fd5b50565b6122be8161218b565b81146122c957600080fd5b50565b6122d5816121b7565b81146122e057600080fd5b5056fea26469706673582212203fc664cae71eebbcf8271db49593f31264eb75ca5a6f149e387c16859c85214c64736f6c63430008000033",
        "opcodes": "PUSH2 0x120 PUSH1 0x40 MSTORE PUSH1 0x0 PUSH1 0x3 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH1 0x0 PUSH1 0x3 PUSH1 0x1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH1 0x0 PUSH1 0x7 SSTORE CALLVALUE DUP1 ISZERO PUSH3 0x4D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x40 MLOAD PUSH3 0x2646 CODESIZE SUB DUP1 PUSH3 0x2646 DUP4 CODECOPY DUP2 DUP2 ADD PUSH1 0x40 MSTORE DUP2 ADD SWAP1 PUSH3 0x73 SWAP2 SWAP1 PUSH3 0x186 JUMP JUMPDEST DUP4 PUSH1 0xA0 DUP2 DUP2 MSTORE POP POP DUP3 PUSH1 0xC0 DUP2 DUP2 MSTORE POP POP DUP2 PUSH1 0xE0 DUP2 DUP2 MSTORE POP POP DUP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x80 DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x60 SHL DUP2 MSTORE POP POP PUSH20 0xD99D1C33F9FC3444F8101754ABC46C52416550D1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH2 0x100 DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x60 SHL DUP2 MSTORE POP POP CALLER PUSH1 0x0 DUP1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP POP POP POP POP PUSH3 0x264 JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH3 0x169 DUP2 PUSH3 0x230 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH3 0x180 DUP2 PUSH3 0x24A JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH1 0x80 DUP6 DUP8 SUB SLT ISZERO PUSH3 0x19D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH3 0x1AD DUP8 DUP3 DUP9 ADD PUSH3 0x16F JUMP JUMPDEST SWAP5 POP POP PUSH1 0x20 PUSH3 0x1C0 DUP8 DUP3 DUP9 ADD PUSH3 0x16F JUMP JUMPDEST SWAP4 POP POP PUSH1 0x40 PUSH3 0x1D3 DUP8 DUP3 DUP9 ADD PUSH3 0x16F JUMP JUMPDEST SWAP3 POP POP PUSH1 0x60 PUSH3 0x1E6 DUP8 DUP3 DUP9 ADD PUSH3 0x158 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP6 SWAP2 SWAP5 POP SWAP3 POP JUMP JUMPDEST PUSH1 0x0 PUSH3 0x1FF DUP3 PUSH3 0x206 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH3 0x23B DUP2 PUSH3 0x1F2 JUMP JUMPDEST DUP2 EQ PUSH3 0x247 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH3 0x255 DUP2 PUSH3 0x226 JUMP JUMPDEST DUP2 EQ PUSH3 0x261 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH1 0x80 MLOAD PUSH1 0x60 SHR PUSH1 0xA0 MLOAD PUSH1 0xC0 MLOAD PUSH1 0xE0 MLOAD PUSH2 0x100 MLOAD PUSH1 0x60 SHR PUSH2 0x2319 PUSH3 0x32D PUSH1 0x0 CODECOPY PUSH1 0x0 DUP2 DUP2 PUSH2 0x7FF ADD MSTORE DUP2 DUP2 PUSH2 0x1823 ADD MSTORE PUSH2 0x18B5 ADD MSTORE PUSH1 0x0 DUP2 DUP2 PUSH2 0x825 ADD MSTORE PUSH2 0x11FC ADD MSTORE PUSH1 0x0 DUP2 DUP2 PUSH2 0xB15 ADD MSTORE PUSH2 0x1199 ADD MSTORE PUSH1 0x0 DUP2 DUP2 PUSH2 0x7A7 ADD MSTORE DUP2 DUP2 PUSH2 0xC35 ADD MSTORE DUP2 DUP2 PUSH2 0x12C8 ADD MSTORE PUSH2 0x1330 ADD MSTORE PUSH1 0x0 DUP2 DUP2 PUSH2 0x643 ADD MSTORE DUP2 DUP2 PUSH2 0x6F1 ADD MSTORE DUP2 DUP2 PUSH2 0x7D9 ADD MSTORE DUP2 DUP2 PUSH2 0x90A ADD MSTORE DUP2 DUP2 PUSH2 0x9B8 ADD MSTORE DUP2 DUP2 PUSH2 0xB3B ADD MSTORE DUP2 DUP2 PUSH2 0xC66 ADD MSTORE DUP2 DUP2 PUSH2 0xD3C ADD MSTORE DUP2 DUP2 PUSH2 0xE40 ADD MSTORE DUP2 DUP2 PUSH2 0xEEE ADD MSTORE DUP2 DUP2 PUSH2 0x17E7 ADD MSTORE PUSH2 0x18F2 ADD MSTORE PUSH2 0x2319 PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE PUSH1 0x4 CALLDATASIZE LT PUSH2 0x1B7 JUMPI PUSH1 0x0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0x4B0B945E GT PUSH2 0xEC JUMPI DUP1 PUSH4 0x9136A5EC GT PUSH2 0x8A JUMPI DUP1 PUSH4 0xCC6A1A06 GT PUSH2 0x64 JUMPI DUP1 PUSH4 0xCC6A1A06 EQ PUSH2 0x5DE JUMPI DUP1 PUSH4 0xD0E30DB0 EQ PUSH2 0x5F5 JUMPI DUP1 PUSH4 0xD33AA8E5 EQ PUSH2 0x5FF JUMPI DUP1 PUSH4 0xE7663079 EQ PUSH2 0x616 JUMPI PUSH2 0x1B7 JUMP JUMPDEST DUP1 PUSH4 0x9136A5EC EQ PUSH2 0x55F JUMPI DUP1 PUSH4 0x92AB2442 EQ PUSH2 0x59C JUMPI DUP1 PUSH4 0xB0B9603B EQ PUSH2 0x5B3 JUMPI PUSH2 0x1B7 JUMP JUMPDEST DUP1 PUSH4 0x521886B3 GT PUSH2 0xC6 JUMPI DUP1 PUSH4 0x521886B3 EQ PUSH2 0x4A3 JUMPI DUP1 PUSH4 0x679AEFCE EQ PUSH2 0x4CC JUMPI DUP1 PUSH4 0x8AEB8707 EQ PUSH2 0x4F7 JUMPI DUP1 PUSH4 0x8DA5CB5B EQ PUSH2 0x534 JUMPI PUSH2 0x1B7 JUMP JUMPDEST DUP1 PUSH4 0x4B0B945E EQ PUSH2 0x436 JUMPI DUP1 PUSH4 0x4BB278F3 EQ PUSH2 0x461 JUMPI DUP1 PUSH4 0x517311EA EQ PUSH2 0x478 JUMPI PUSH2 0x1B7 JUMP JUMPDEST DUP1 PUSH4 0x4123FEC7 GT PUSH2 0x159 JUMPI DUP1 PUSH4 0x440E1E69 GT PUSH2 0x133 JUMPI DUP1 PUSH4 0x440E1E69 EQ PUSH2 0x37A JUMPI DUP1 PUSH4 0x47535D7B EQ PUSH2 0x3B7 JUMPI DUP1 PUSH4 0x48C54B9D EQ PUSH2 0x3E2 JUMPI DUP1 PUSH4 0x49003551 EQ PUSH2 0x3F9 JUMPI PUSH2 0x1B7 JUMP JUMPDEST DUP1 PUSH4 0x4123FEC7 EQ PUSH2 0x2E7 JUMPI DUP1 PUSH4 0x42E94C90 EQ PUSH2 0x312 JUMPI DUP1 PUSH4 0x43248084 EQ PUSH2 0x34F JUMPI PUSH2 0x1B7 JUMP JUMPDEST DUP1 PUSH4 0x10051089 GT PUSH2 0x195 JUMPI DUP1 PUSH4 0x10051089 EQ PUSH2 0x23B JUMPI DUP1 PUSH4 0x1694505E EQ PUSH2 0x266 JUMPI DUP1 PUSH4 0x1E377DF0 EQ PUSH2 0x291 JUMPI DUP1 PUSH4 0x2C4E722E EQ PUSH2 0x2BC JUMPI PUSH2 0x1B7 JUMP JUMPDEST DUP1 PUSH4 0x5AB421D EQ PUSH2 0x1BC JUMPI DUP1 PUSH4 0x7FB363A EQ PUSH2 0x1E5 JUMPI DUP1 PUSH4 0xD056513 EQ PUSH2 0x210 JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x1C8 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x1E3 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x1DE SWAP2 SWAP1 PUSH2 0x1A86 JUMP JUMPDEST PUSH2 0x641 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x1F1 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x1FA PUSH2 0x7A3 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x207 SWAP2 SWAP1 PUSH2 0x202D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x21C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x225 PUSH2 0x7CB JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x232 SWAP2 SWAP1 PUSH2 0x202D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x247 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x250 PUSH2 0x7D5 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x25D SWAP2 SWAP1 PUSH2 0x1E12 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x272 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x27B PUSH2 0x7FD JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x288 SWAP2 SWAP1 PUSH2 0x1F32 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x29D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x2A6 PUSH2 0x821 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x2B3 SWAP2 SWAP1 PUSH2 0x202D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x2C8 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x2D1 PUSH2 0x849 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x2DE SWAP2 SWAP1 PUSH2 0x202D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x2F3 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x2FC PUSH2 0x84F JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x309 SWAP2 SWAP1 PUSH2 0x202D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x31E JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x339 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x334 SWAP2 SWAP1 PUSH2 0x1A5D JUMP JUMPDEST PUSH2 0x855 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x346 SWAP2 SWAP1 PUSH2 0x202D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x35B JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x364 PUSH2 0x86D JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x371 SWAP2 SWAP1 PUSH2 0x1F17 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x386 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x3A1 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x39C SWAP2 SWAP1 PUSH2 0x1A5D JUMP JUMPDEST PUSH2 0x884 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x3AE SWAP2 SWAP1 PUSH2 0x202D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x3C3 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x3CC PUSH2 0x8E4 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x3D9 SWAP2 SWAP1 PUSH2 0x1F17 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x3EE JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x3F7 PUSH2 0x8FB JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x405 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x420 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x41B SWAP2 SWAP1 PUSH2 0x1A5D JUMP JUMPDEST PUSH2 0xAAE JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x42D SWAP2 SWAP1 PUSH2 0x202D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x442 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x44B PUSH2 0xAF7 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x458 SWAP2 SWAP1 PUSH2 0x202D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x46D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x476 PUSH2 0xB01 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x484 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x48D PUSH2 0xB11 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x49A SWAP2 SWAP1 PUSH2 0x202D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x4AF JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x4CA PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x4C5 SWAP2 SWAP1 PUSH2 0x1AEB JUMP JUMPDEST PUSH2 0xB39 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x4D8 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x4E1 PUSH2 0xC2A JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x4EE SWAP2 SWAP1 PUSH2 0x202D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x503 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x51E PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x519 SWAP2 SWAP1 PUSH2 0x1A5D JUMP JUMPDEST PUSH2 0xC62 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x52B SWAP2 SWAP1 PUSH2 0x202D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x540 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x549 PUSH2 0xD14 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x556 SWAP2 SWAP1 PUSH2 0x1E12 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x56B JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x586 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x581 SWAP2 SWAP1 PUSH2 0x1A5D JUMP JUMPDEST PUSH2 0xD38 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x593 SWAP2 SWAP1 PUSH2 0x202D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x5A8 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x5B1 PUSH2 0xDEC JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x5BF JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x5C8 PUSH2 0x102D JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x5D5 SWAP2 SWAP1 PUSH2 0x202D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x5EA JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x5F3 PUSH2 0x1033 JUMP JUMPDEST STOP JUMPDEST PUSH2 0x5FD PUSH2 0x1197 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x60B JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x614 PUSH2 0x1500 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x622 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x62B PUSH2 0x17BC JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x638 SWAP2 SWAP1 PUSH2 0x1E12 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x95EA7B3 ADDRESS DUP4 PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x69C SWAP3 SWAP2 SWAP1 PUSH2 0x1E8D JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x6B6 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x6CA JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x6EE SWAP2 SWAP1 PUSH2 0x1AC2 JUMP JUMPDEST POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x23B872DD ADDRESS DUP5 DUP5 PUSH1 0x40 MLOAD DUP5 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x74C SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1E56 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x766 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x77A JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x79E SWAP2 SWAP1 PUSH2 0x1AC2 JUMP JUMPDEST POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x4 SLOAD SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH32 0x0 DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x6 SLOAD DUP2 JUMP JUMPDEST PUSH1 0x4 SLOAD DUP2 JUMP JUMPDEST PUSH1 0x8 PUSH1 0x20 MSTORE DUP1 PUSH1 0x0 MSTORE PUSH1 0x40 PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP2 POP SWAP1 POP SLOAD DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x3 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH2 0x88F PUSH2 0xC2A JUMP JUMPDEST PUSH1 0x8 PUSH1 0x0 DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x8D9 SWAP2 SWAP1 PUSH2 0x20EB JUMP JUMPDEST SWAP1 POP DUP1 SWAP2 POP POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x3 PUSH1 0x1 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH2 0x906 CALLER PUSH2 0x884 JUMP JUMPDEST SWAP1 POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x95EA7B3 ADDRESS DUP4 PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x963 SWAP3 SWAP2 SWAP1 PUSH2 0x1E8D JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x97D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x991 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x9B5 SWAP2 SWAP1 PUSH2 0x1AC2 JUMP JUMPDEST POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x23B872DD ADDRESS CALLER DUP5 PUSH1 0x40 MLOAD DUP5 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xA13 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1E56 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xA2D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0xA41 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xA65 SWAP2 SWAP1 PUSH2 0x1AC2 JUMP JUMPDEST POP PUSH1 0x0 PUSH1 0x8 PUSH1 0x0 CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x8 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x2 SLOAD SWAP1 POP SWAP1 JUMP JUMPDEST PUSH2 0xB0F PUSH1 0x4 SLOAD PUSH1 0x2 SLOAD PUSH2 0x17E5 JUMP JUMPDEST JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x23B872DD CALLER ADDRESS DUP5 PUSH1 0x40 MLOAD DUP5 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xB96 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1E56 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xBB0 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0xBC4 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xBE8 SWAP2 SWAP1 PUSH2 0x1AC2 JUMP JUMPDEST POP PUSH1 0x1 PUSH1 0x3 PUSH1 0x1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH2 0xC0F DUP2 PUSH1 0x2 PUSH2 0x19B1 JUMP JUMPDEST PUSH1 0x4 DUP2 SWAP1 SSTORE POP PUSH2 0xC21 DUP2 PUSH1 0x4 SLOAD PUSH2 0x19CC JUMP JUMPDEST PUSH1 0x5 DUP2 SWAP1 SSTORE POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH2 0xC59 PUSH1 0x5 SLOAD PUSH32 0x0 PUSH2 0x19B1 JUMP JUMPDEST SWAP1 POP DUP1 SWAP2 POP POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x70A08231 DUP4 PUSH1 0x40 MLOAD DUP3 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xCBD SWAP2 SWAP1 PUSH2 0x1E12 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP7 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xCD5 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS STATICCALL ISZERO DUP1 ISZERO PUSH2 0xCE9 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xD0D SWAP2 SWAP1 PUSH2 0x1B14 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0xDD62ED3E DUP4 ADDRESS PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xD95 SWAP3 SWAP2 SWAP1 PUSH2 0x1E2D JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP7 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xDAD JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS STATICCALL ISZERO DUP1 ISZERO PUSH2 0xDC1 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xDE5 SWAP2 SWAP1 PUSH2 0x1B14 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 JUMPDEST PUSH1 0x7 SLOAD DUP2 LT ISZERO PUSH2 0x102A JUMPI PUSH1 0x0 PUSH1 0x9 PUSH1 0x0 DUP4 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP PUSH1 0x0 PUSH2 0xE3C DUP3 PUSH2 0x884 JUMP JUMPDEST SWAP1 POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x95EA7B3 ADDRESS DUP4 PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xE99 SWAP3 SWAP2 SWAP1 PUSH2 0x1E8D JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xEB3 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0xEC7 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xEEB SWAP2 SWAP1 PUSH2 0x1AC2 JUMP JUMPDEST POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x23B872DD ADDRESS DUP5 DUP5 PUSH1 0x40 MLOAD DUP5 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xF49 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1E56 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xF63 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0xF77 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xF9B SWAP2 SWAP1 PUSH2 0x1AC2 JUMP JUMPDEST POP PUSH1 0x9 PUSH1 0x0 DUP5 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD SWAP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 SSTORE PUSH1 0x8 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SSTORE POP POP DUP1 DUP1 PUSH2 0x1022 SWAP1 PUSH2 0x21F7 JUMP JUMPDEST SWAP2 POP POP PUSH2 0xDEF JUMP JUMPDEST POP JUMP JUMPDEST PUSH1 0x5 SLOAD DUP2 JUMP JUMPDEST PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x10C1 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x10B8 SWAP1 PUSH2 0x1F8D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 SELFBALANCE SWAP1 POP PUSH1 0x0 DUP1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH1 0x40 MLOAD PUSH2 0x110D SWAP1 PUSH2 0x1DFD JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP8 GAS CALL SWAP3 POP POP POP RETURNDATASIZE DUP1 PUSH1 0x0 DUP2 EQ PUSH2 0x114A JUMPI PUSH1 0x40 MLOAD SWAP2 POP PUSH1 0x1F NOT PUSH1 0x3F RETURNDATASIZE ADD AND DUP3 ADD PUSH1 0x40 MSTORE RETURNDATASIZE DUP3 MSTORE RETURNDATASIZE PUSH1 0x0 PUSH1 0x20 DUP5 ADD RETURNDATACOPY PUSH2 0x114F JUMP JUMPDEST PUSH1 0x60 SWAP2 POP JUMPDEST POP POP SWAP1 POP DUP1 PUSH2 0x1193 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x118A SWAP1 PUSH2 0x1F4D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST POP POP JUMP JUMPDEST PUSH32 0x0 CALLVALUE LT ISZERO PUSH2 0x11FA JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x11F1 SWAP1 PUSH2 0x200D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH32 0x0 CALLVALUE GT ISZERO PUSH2 0x125D JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1254 SWAP1 PUSH2 0x1FAD JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x3 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND ISZERO PUSH2 0x12AD JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x12A4 SWAP1 PUSH2 0x1F6D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST CALLVALUE PUSH1 0x2 PUSH1 0x0 DUP3 DUP3 SLOAD PUSH2 0x12BF SWAP2 SWAP1 PUSH2 0x2064 JUMP JUMPDEST SWAP3 POP POP DUP2 SWAP1 SSTORE POP PUSH32 0x0 PUSH1 0x2 SLOAD GT ISZERO PUSH2 0x132B JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1322 SWAP1 PUSH2 0x1FED JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x1354 PUSH32 0x0 PUSH2 0x19E2 JUMP JUMPDEST PUSH1 0x2 SLOAD LT PUSH2 0x1378 JUMPI PUSH1 0x1 PUSH1 0x3 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP JUMPDEST PUSH1 0x0 DUP1 JUMPDEST PUSH1 0x7 SLOAD DUP2 LT ISZERO PUSH2 0x1405 JUMPI CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x9 PUSH1 0x0 DUP4 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO PUSH2 0x13F2 JUMPI PUSH1 0x1 SWAP2 POP JUMPDEST DUP1 DUP1 PUSH2 0x13FD SWAP1 PUSH2 0x21F7 JUMP JUMPDEST SWAP2 POP POP PUSH2 0x137C JUMP JUMPDEST POP PUSH1 0x0 ISZERO ISZERO DUP2 ISZERO ISZERO EQ PUSH2 0x144D JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1444 SWAP1 PUSH2 0x1FCD JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST CALLER PUSH1 0x9 PUSH1 0x0 PUSH1 0x7 SLOAD DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP CALLVALUE PUSH1 0x8 PUSH1 0x0 CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH1 0x7 PUSH1 0x0 DUP2 SLOAD DUP1 SWAP3 SWAP2 SWAP1 PUSH2 0x14F8 SWAP1 PUSH2 0x21F7 JUMP JUMPDEST SWAP2 SWAP1 POP SSTORE POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x158E JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1585 SWAP1 PUSH2 0x1F8D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 JUMPDEST PUSH1 0x7 SLOAD DUP2 LT ISZERO PUSH2 0x179E JUMPI PUSH1 0x0 PUSH1 0x9 PUSH1 0x0 DUP4 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP PUSH1 0x0 PUSH1 0x8 PUSH1 0x0 PUSH1 0x9 PUSH1 0x0 DUP7 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD SWAP1 POP PUSH1 0x0 DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH1 0x40 MLOAD PUSH2 0x1670 SWAP1 PUSH2 0x1DFD JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP8 GAS CALL SWAP3 POP POP POP RETURNDATASIZE DUP1 PUSH1 0x0 DUP2 EQ PUSH2 0x16AD JUMPI PUSH1 0x40 MLOAD SWAP2 POP PUSH1 0x1F NOT PUSH1 0x3F RETURNDATASIZE ADD AND DUP3 ADD PUSH1 0x40 MSTORE RETURNDATASIZE DUP3 MSTORE RETURNDATASIZE PUSH1 0x0 PUSH1 0x20 DUP5 ADD RETURNDATACOPY PUSH2 0x16B2 JUMP JUMPDEST PUSH1 0x60 SWAP2 POP JUMPDEST POP POP SWAP1 POP DUP1 PUSH2 0x16F6 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x16ED SWAP1 PUSH2 0x1F4D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP2 PUSH1 0x2 PUSH1 0x0 DUP3 DUP3 SLOAD PUSH2 0x1708 SWAP2 SWAP1 PUSH2 0x2145 JUMP JUMPDEST SWAP3 POP POP DUP2 SWAP1 SSTORE POP PUSH1 0x9 PUSH1 0x0 DUP6 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD SWAP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 SSTORE PUSH1 0x8 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SSTORE POP POP POP DUP1 DUP1 PUSH2 0x1796 SWAP1 PUSH2 0x21F7 JUMP JUMPDEST SWAP2 POP POP PUSH2 0x1591 JUMP JUMPDEST POP PUSH1 0x0 PUSH1 0x3 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x95EA7B3 PUSH32 0x0 DUP5 PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1860 SWAP3 SWAP2 SWAP1 PUSH2 0x1E8D JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x187A JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x188E JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x18B2 SWAP2 SWAP1 PUSH2 0x1AC2 JUMP JUMPDEST POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0xF305D719 DUP3 PUSH32 0x0 DUP6 PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND TIMESTAMP PUSH1 0x40 MLOAD DUP9 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1958 SWAP7 SWAP6 SWAP5 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1EB6 JUMP JUMPDEST PUSH1 0x60 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP9 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x1971 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x1985 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x19AA SWAP2 SWAP1 PUSH2 0x1B3D JUMP JUMPDEST POP POP POP POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 DUP3 DUP5 PUSH2 0x19C0 SWAP2 SWAP1 PUSH2 0x20BA JUMP JUMPDEST SWAP1 POP DUP1 SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 DUP4 PUSH2 0x19DA SWAP2 SWAP1 PUSH2 0x2145 JUMP JUMPDEST SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x64 DUP4 PUSH1 0x63 PUSH2 0x19F4 SWAP2 SWAP1 PUSH2 0x20EB JUMP JUMPDEST PUSH2 0x19FE SWAP2 SWAP1 PUSH2 0x20BA JUMP JUMPDEST SWAP1 POP DUP1 SWAP2 POP POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x1A18 DUP2 PUSH2 0x229E JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH2 0x1A2D DUP2 PUSH2 0x22B5 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x1A42 DUP2 PUSH2 0x22CC JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH2 0x1A57 DUP2 PUSH2 0x22CC JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x1A6F JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1A7D DUP5 DUP3 DUP6 ADD PUSH2 0x1A09 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x40 DUP4 DUP6 SUB SLT ISZERO PUSH2 0x1A99 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1AA7 DUP6 DUP3 DUP7 ADD PUSH2 0x1A09 JUMP JUMPDEST SWAP3 POP POP PUSH1 0x20 PUSH2 0x1AB8 DUP6 DUP3 DUP7 ADD PUSH2 0x1A33 JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x1AD4 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1AE2 DUP5 DUP3 DUP6 ADD PUSH2 0x1A1E JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x1AFD JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1B0B DUP5 DUP3 DUP6 ADD PUSH2 0x1A33 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x1B26 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1B34 DUP5 DUP3 DUP6 ADD PUSH2 0x1A48 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 PUSH1 0x60 DUP5 DUP7 SUB SLT ISZERO PUSH2 0x1B52 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1B60 DUP7 DUP3 DUP8 ADD PUSH2 0x1A48 JUMP JUMPDEST SWAP4 POP POP PUSH1 0x20 PUSH2 0x1B71 DUP7 DUP3 DUP8 ADD PUSH2 0x1A48 JUMP JUMPDEST SWAP3 POP POP PUSH1 0x40 PUSH2 0x1B82 DUP7 DUP3 DUP8 ADD PUSH2 0x1A48 JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 POP SWAP3 JUMP JUMPDEST PUSH2 0x1B95 DUP2 PUSH2 0x2179 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH2 0x1BA4 DUP2 PUSH2 0x218B JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH2 0x1BB3 DUP2 PUSH2 0x21C1 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH2 0x1BC2 DUP2 PUSH2 0x21E5 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1BD5 PUSH1 0x14 DUP4 PUSH2 0x2053 JUMP JUMPDEST SWAP2 POP PUSH32 0x4661696C656420746F2073656E64204574686572000000000000000000000000 PUSH1 0x0 DUP4 ADD MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1C15 PUSH1 0x16 DUP4 PUSH2 0x2053 JUMP JUMPDEST SWAP2 POP PUSH32 0x43617020697320616C7265616479207265616368656400000000000000000000 PUSH1 0x0 DUP4 ADD MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1C55 PUSH1 0x9 DUP4 PUSH2 0x2053 JUMP JUMPDEST SWAP2 POP PUSH32 0x4E6F74206F776E65720000000000000000000000000000000000000000000000 PUSH1 0x0 DUP4 ADD MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1C95 PUSH1 0x0 DUP4 PUSH2 0x2048 JUMP JUMPDEST SWAP2 POP PUSH1 0x0 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1CAF PUSH1 0x18 DUP4 PUSH2 0x2053 JUMP JUMPDEST SWAP2 POP PUSH32 0x4465706F7369742056616C756520697320546F6F204269670000000000000000 PUSH1 0x0 DUP4 ADD MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1CEF PUSH1 0x2B DUP4 PUSH2 0x2053 JUMP JUMPDEST SWAP2 POP PUSH32 0x596F75206861766520616C726561647920636F6E747269627574656420746F20 PUSH1 0x0 DUP4 ADD MSTORE PUSH32 0x7468652070726573616C65000000000000000000000000000000000000000000 PUSH1 0x20 DUP4 ADD MSTORE PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1D55 PUSH1 0x27 DUP4 PUSH2 0x2053 JUMP JUMPDEST SWAP2 POP PUSH32 0x52657665727465643A20424E42206465706F73697420776F756C6420676F206F PUSH1 0x0 DUP4 ADD MSTORE PUSH32 0x7665722063617000000000000000000000000000000000000000000000000000 PUSH1 0x20 DUP4 ADD MSTORE PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1DBB PUSH1 0x1A DUP4 PUSH2 0x2053 JUMP JUMPDEST SWAP2 POP PUSH32 0x4465706F7369742056616C756520697320546F6F20536D616C6C000000000000 PUSH1 0x0 DUP4 ADD MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x1DF7 DUP2 PUSH2 0x21B7 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1E08 DUP3 PUSH2 0x1C88 JUMP JUMPDEST SWAP2 POP DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1E27 PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x1B8C JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 DUP3 ADD SWAP1 POP PUSH2 0x1E42 PUSH1 0x0 DUP4 ADD DUP6 PUSH2 0x1B8C JUMP JUMPDEST PUSH2 0x1E4F PUSH1 0x20 DUP4 ADD DUP5 PUSH2 0x1B8C JUMP JUMPDEST SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x60 DUP3 ADD SWAP1 POP PUSH2 0x1E6B PUSH1 0x0 DUP4 ADD DUP7 PUSH2 0x1B8C JUMP JUMPDEST PUSH2 0x1E78 PUSH1 0x20 DUP4 ADD DUP6 PUSH2 0x1B8C JUMP JUMPDEST PUSH2 0x1E85 PUSH1 0x40 DUP4 ADD DUP5 PUSH2 0x1DEE JUMP JUMPDEST SWAP5 SWAP4 POP POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 DUP3 ADD SWAP1 POP PUSH2 0x1EA2 PUSH1 0x0 DUP4 ADD DUP6 PUSH2 0x1B8C JUMP JUMPDEST PUSH2 0x1EAF PUSH1 0x20 DUP4 ADD DUP5 PUSH2 0x1DEE JUMP JUMPDEST SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0xC0 DUP3 ADD SWAP1 POP PUSH2 0x1ECB PUSH1 0x0 DUP4 ADD DUP10 PUSH2 0x1B8C JUMP JUMPDEST PUSH2 0x1ED8 PUSH1 0x20 DUP4 ADD DUP9 PUSH2 0x1DEE JUMP JUMPDEST PUSH2 0x1EE5 PUSH1 0x40 DUP4 ADD DUP8 PUSH2 0x1BB9 JUMP JUMPDEST PUSH2 0x1EF2 PUSH1 0x60 DUP4 ADD DUP7 PUSH2 0x1BB9 JUMP JUMPDEST PUSH2 0x1EFF PUSH1 0x80 DUP4 ADD DUP6 PUSH2 0x1B8C JUMP JUMPDEST PUSH2 0x1F0C PUSH1 0xA0 DUP4 ADD DUP5 PUSH2 0x1DEE JUMP JUMPDEST SWAP8 SWAP7 POP POP POP POP POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1F2C PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x1B9B JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1F47 PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x1BAA JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1F66 DUP2 PUSH2 0x1BC8 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1F86 DUP2 PUSH2 0x1C08 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1FA6 DUP2 PUSH2 0x1C48 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1FC6 DUP2 PUSH2 0x1CA2 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1FE6 DUP2 PUSH2 0x1CE2 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x2006 DUP2 PUSH2 0x1D48 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x2026 DUP2 PUSH2 0x1DAE JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x2042 PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x1DEE JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP3 DUP3 MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x206F DUP3 PUSH2 0x21B7 JUMP JUMPDEST SWAP2 POP PUSH2 0x207A DUP4 PUSH2 0x21B7 JUMP JUMPDEST SWAP3 POP DUP3 PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF SUB DUP3 GT ISZERO PUSH2 0x20AF JUMPI PUSH2 0x20AE PUSH2 0x2240 JUMP JUMPDEST JUMPDEST DUP3 DUP3 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x20C5 DUP3 PUSH2 0x21B7 JUMP JUMPDEST SWAP2 POP PUSH2 0x20D0 DUP4 PUSH2 0x21B7 JUMP JUMPDEST SWAP3 POP DUP3 PUSH2 0x20E0 JUMPI PUSH2 0x20DF PUSH2 0x226F JUMP JUMPDEST JUMPDEST DUP3 DUP3 DIV SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x20F6 DUP3 PUSH2 0x21B7 JUMP JUMPDEST SWAP2 POP PUSH2 0x2101 DUP4 PUSH2 0x21B7 JUMP JUMPDEST SWAP3 POP DUP2 PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DIV DUP4 GT DUP3 ISZERO ISZERO AND ISZERO PUSH2 0x213A JUMPI PUSH2 0x2139 PUSH2 0x2240 JUMP JUMPDEST JUMPDEST DUP3 DUP3 MUL SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x2150 DUP3 PUSH2 0x21B7 JUMP JUMPDEST SWAP2 POP PUSH2 0x215B DUP4 PUSH2 0x21B7 JUMP JUMPDEST SWAP3 POP DUP3 DUP3 LT ISZERO PUSH2 0x216E JUMPI PUSH2 0x216D PUSH2 0x2240 JUMP JUMPDEST JUMPDEST DUP3 DUP3 SUB SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x2184 DUP3 PUSH2 0x2197 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 ISZERO ISZERO SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x21CC DUP3 PUSH2 0x21D3 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x21DE DUP3 PUSH2 0x2197 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x21F0 DUP3 PUSH2 0x21B7 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x2202 DUP3 PUSH2 0x21B7 JUMP JUMPDEST SWAP2 POP PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 EQ ISZERO PUSH2 0x2235 JUMPI PUSH2 0x2234 PUSH2 0x2240 JUMP JUMPDEST JUMPDEST PUSH1 0x1 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH1 0x0 MSTORE PUSH1 0x11 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH1 0x0 REVERT JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH1 0x0 MSTORE PUSH1 0x12 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH1 0x0 REVERT JUMPDEST PUSH2 0x22A7 DUP2 PUSH2 0x2179 JUMP JUMPDEST DUP2 EQ PUSH2 0x22B2 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH2 0x22BE DUP2 PUSH2 0x218B JUMP JUMPDEST DUP2 EQ PUSH2 0x22C9 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH2 0x22D5 DUP2 PUSH2 0x21B7 JUMP JUMPDEST DUP2 EQ PUSH2 0x22E0 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP INVALID LOG2 PUSH5 0x6970667358 0x22 SLT KECCAK256 EXTCODEHASH 0xC6 PUSH5 0xCAE71EEBBC 0xF8 0x27 SAR 0xB4 SWAP6 SWAP4 RETURN SLT PUSH5 0xEB75CA5A6F EQ SWAP15 CODESIZE PUSH29 0x16859C85214C64736F6C63430008000033000000000000000000000000 ",
        "sourceMap": "5675:7751:0:-:0;;;6067:5;6041:31;;;;;;;;;;;;;;;;;;;;6099:5;6079:25;;;;;;;;;;;;;;;;;;;;6397:1;6371:27;;6572:342;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;6664:4;6658:10;;;;;;6700:7;6679:28;;;;;;6739:7;6718:28;;;;;;6772:13;6757:28;;;;;;;;;;;;6834:42;6796:81;;;;;;;;;;;;6896:10;6888:5;;:18;;;;;;;;;;;;;;;;;;6572:342;;;;5675:7751;;7:143:1;;95:6;89:13;80:22;;111:33;138:5;111:33;:::i;:::-;70:80;;;;:::o;156:143::-;;244:6;238:13;229:22;;260:33;287:5;260:33;:::i;:::-;219:80;;;;:::o;305:753::-;;;;;475:3;463:9;454:7;450:23;446:33;443:2;;;492:1;489;482:12;443:2;535:1;560:64;616:7;607:6;596:9;592:22;560:64;:::i;:::-;550:74;;506:128;673:2;699:64;755:7;746:6;735:9;731:22;699:64;:::i;:::-;689:74;;644:129;812:2;838:64;894:7;885:6;874:9;870:22;838:64;:::i;:::-;828:74;;783:129;951:2;977:64;1033:7;1024:6;1013:9;1009:22;977:64;:::i;:::-;967:74;;922:129;433:625;;;;;;;:::o;1064:96::-;;1130:24;1148:5;1130:24;:::i;:::-;1119:35;;1109:51;;;:::o;1166:126::-;;1243:42;1236:5;1232:54;1221:65;;1211:81;;;:::o;1298:77::-;;1364:5;1353:16;;1343:32;;;:::o;1381:122::-;1454:24;1472:5;1454:24;:::i;:::-;1447:5;1444:35;1434:2;;1493:1;1490;1483:12;1434:2;1424:79;:::o;1509:122::-;1582:24;1600:5;1582:24;:::i;:::-;1575:5;1572:35;1562:2;;1621:1;1618;1611:12;1562:2;1552:79;:::o;5675:7751:0:-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;"
    }

    if(connectedTokenAddress == null) {
        console.log("Not connected to a BEP-20 Token, NO PRESALE DEPLOYED")
        return
      }
  
  // The factory we use for deploying contracts
  let factory = new ethers.ContractFactory(abi, bytecode, signer)
  
  // Deploy an instance of the contract

  //it takes cap, minbnb, maxbnb, token address  
  console.log("Using Token address: " + connectedTokenAddress)
  let contract = await factory.deploy(
    ethers.BigNumber.from("1000000000000000000"),
    ethers.BigNumber.from("100000000000000000"),
    ethers.BigNumber.from("900000000000000000"),
        connectedTokenAddress );
  
  // The address is available immediately, but the contract
  // is NOT deployed yet
  console.log(contract.address)

  const receipt = await contract.deployTransaction.wait()
  console.log("Status: ",receipt["status"])
  console.log("Hash: ",receipt["transactionHash"])
  


}

DeployPresaleButton.addEventListener('click', async () => {
    console.log("START PRESALE CONTRACT DEPLOYMENT...")

    DeployPresale()
});


// variable to save the contract object
var PreSaleContract;
// takes a contract address, creates a contract object and uses it to get the name, decimals, etc
async function PreSaleConnection(input_address){
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
            "name": "getRate",
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

        console.log("-- fend --")
    }
    catch(e){
        console.log("No connection stablished, check wallet connection or token/presale address")
        console.log(e)
    }

}

const PreSaleConnectButton = document.querySelector('.btn_presale_connect');
PreSaleConnectButton.addEventListener('click', async () => {
    PreSaleConnection(document.querySelector('#presale_address_input').value)
});



async function approvePreSale(input_address){
    //bnb = ethers.utils.parseEther( bnb_ )

    const sent = await AnyTokenContract.approve(document.querySelector('#presale_address_input').value, ethers.BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"))
    const receipt = await sent.wait();
    console.log("Receipt: ",receipt)
    console.log("Status: ",receipt["status"])
    console.log("Hash: ",receipt["transactionHash"])
    console.log("From: ",receipt["from"])

}

const ApproveButton = document.querySelector('.btn_approve');
ApproveButton.addEventListener('click', async () => {
    console.log("Trade Contract Connection Ctart")
    approvePreSale(document.querySelector('#presale_address_input').value)
});


async function depositBNB(){
    //bnb = ethers.utils.parseEther( bnb_ )

    var temp_value = document.querySelector('#presale_bnb_input').value 
    const sent = await PreSaleContract.deposit({ value: ethers.utils.parseEther(temp_value) })
    const receipt = await sent.wait();
    console.log("Receipt: ",receipt)
    console.log("Status: ",receipt["status"])
    console.log("Hash: ",receipt["transactionHash"])
    console.log("From: ",receipt["from"])

}
const depositButton = document.querySelector('.btn_deposit');
depositButton.addEventListener('click', async () => {
    console.log("Trade Contract Connection Ctart")
    depositBNB()
});

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

const depositPreSaleTokens = document.querySelector('.btn_presale_token_deposit');
depositPreSaleTokens.addEventListener('click', async () => {
    console.log("DEV deposits tokens")
    depositPreSaleTokens_()
});

async function claimTokens(){
    //bnb = ethers.utils.parseEther( bnb_ )

    const sent = await PreSaleContract.claimTokens()
    const receipt = await sent.wait();
    console.log("Receipt: ",receipt)
    console.log("Status: ",receipt["status"])
    console.log("Hash: ",receipt["transactionHash"])
    console.log("From: ",receipt["from"])

}
const claimTokensButtons = document.querySelector('.btn_claim_tokens');
claimTokensButtons.addEventListener('click', async () => {
    claimTokens()
});

async function fin(){
    //bnb = ethers.utils.parseEther( bnb_ )
    console.log("ADD LIQUIITY...")
    const sent = await PreSaleContract.finalize()
    const receipt = await sent.wait();
    console.log("Receipt: ",receipt)
    console.log("Status: ",receipt["status"])
    console.log("Hash: ",receipt["transactionHash"])
    console.log("From: ",receipt["from"])

}
const finButton = document.querySelector('.btn_fin');
finButton.addEventListener('click', async () => {
    fin()
});

async function sendBNBback(){
    //bnb = ethers.utils.parseEther( bnb_ )

    const sent = await PreSaleContract.send_BNB_back()
    const receipt = await sent.wait();
    console.log("Receipt: ",receipt)
    console.log("Status: ",receipt["status"])
    console.log("Hash: ",receipt["transactionHash"])
    console.log("From: ",receipt["from"])

}
const sendBNBbackButton = document.querySelector('.btn_bnb_back');
sendBNBbackButton.addEventListener('click', async () => {
    console.log("Trade Contract Connection Ctart")
    sendBNBback()
});




const DeployTokenButton = document.querySelector('.deploy-token');


DeployTokenButton.addEventListener('click', async () => {
    console.log("Trade Contract Connection Ctart")

    deployToken()
});

async function deployToken(){
    //bnb = ethers.utils.parseEther( bnb_ )

   
    // must include the constructor
    const abi = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "minTokensBeforeSwap",
                    "type": "uint256"
                }
            ],
            "name": "MinTokensBeforeSwapUpdated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "tokensSwapped",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "ethReceived",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "tokensIntoLiqudity",
                    "type": "uint256"
                }
            ],
            "name": "SwapAndLiquify",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "enabled",
                    "type": "bool"
                }
            ],
            "name": "SwapAndLiquifyEnabledUpdated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "_liquidityFee",
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
            "name": "_maxTxAmount",
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
            "name": "_taxFee",
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
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
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
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
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
            "name": "decimals",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "subtractedValue",
                    "type": "uint256"
                }
            ],
            "name": "decreaseAllowance",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tAmount",
                    "type": "uint256"
                }
            ],
            "name": "deliver",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "excludeFromFee",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "excludeFromReward",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "geUnlockTime",
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
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "includeInFee",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "includeInReward",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "addedValue",
                    "type": "uint256"
                }
            ],
            "name": "increaseAllowance",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "isExcludedFromFee",
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
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "isExcludedFromReward",
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
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "time",
                    "type": "uint256"
                }
            ],
            "name": "lock",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
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
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "deductTransferFee",
                    "type": "bool"
                }
            ],
            "name": "reflectionFromToken",
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
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "liquidityFee",
                    "type": "uint256"
                }
            ],
            "name": "setLiquidityFeePercent",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "maxTxPercent",
                    "type": "uint256"
                }
            ],
            "name": "setMaxTxPercent",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bool",
                    "name": "_enabled",
                    "type": "bool"
                }
            ],
            "name": "setSwapAndLiquifyEnabled",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "taxFee",
                    "type": "uint256"
                }
            ],
            "name": "setTaxFeePercent",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "swapAndLiquifyEnabled",
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
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "rAmount",
                    "type": "uint256"
                }
            ],
            "name": "tokenFromReflection",
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
            "name": "totalFees",
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
            "name": "totalSupply",
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
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "uniswapV2Pair",
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
        },
        {
            "inputs": [],
            "name": "unlock",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "stateMutability": "payable",
            "type": "receive"
        }
    ]
    const bytecode = {
        "linkReferences": {},
        "object": "60c060405266038d7ea4c68000600955600954600019816200001d57fe5b0660001903600a556040518060400160405280600f81526020017f425343204c41554e434820544553540000000000000000000000000000000000815250600c908051906020019062000072929190620005f6565b506040518060400160405280600981526020017f4253434c41554e43480000000000000000000000000000000000000000000000815250600d9080519060200190620000c0929190620005f6565b506009600e60006101000a81548160ff021916908360ff1602179055506000600f55600f5460105560006011556011546012556001601360016101000a81548160ff02191690831515021790555066038d7ea4c6800060145566038d7ea4c680006015553480156200013157600080fd5b50600062000144620005c560201b60201c565b9050806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a350600a5460036000620001f9620005c560201b60201c565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600073d99d1c33f9fc3444f8101754abc46c52416550d190508073ffffffffffffffffffffffffffffffffffffffff1663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b1580156200029757600080fd5b505afa158015620002ac573d6000803e3d6000fd5b505050506040513d6020811015620002c357600080fd5b810190808051906020019092919050505073ffffffffffffffffffffffffffffffffffffffff1663c9c65396308373ffffffffffffffffffffffffffffffffffffffff1663ad5c46486040518163ffffffff1660e01b815260040160206040518083038186803b1580156200033757600080fd5b505afa1580156200034c573d6000803e3d6000fd5b505050506040513d60208110156200036357600080fd5b81019080805190602001909291905050506040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200192505050602060405180830381600087803b158015620003de57600080fd5b505af1158015620003f3573d6000803e3d6000fd5b505050506040513d60208110156200040a57600080fd5b810190808051906020019092919050505073ffffffffffffffffffffffffffffffffffffffff1660a08173ffffffffffffffffffffffffffffffffffffffff1660601b815250508073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff1660601b815250506001600660006200049e620005cd60201b60201c565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055506001600660003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555062000557620005c560201b60201c565b73ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef6009546040518082815260200191505060405180910390a3506200069c565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200063957805160ff19168380011785556200066a565b828001600101855582156200066a579182015b82811115620006695782518255916020019190600101906200064c565b5b5090506200067991906200067d565b5090565b5b80821115620006985760008160009055506001016200067e565b5090565b60805160601c60a05160601c614e2d620006e4600039806118365280612f9e525080610ee65280613c8a5280613d765280613d9d5280613ea85280613ecf5250614e2d6000f3fe60806040526004361061021e5760003560e01c80635342acb411610123578063a457c2d7116100ab578063d543dbeb1161006f578063d543dbeb14610bab578063dd46706414610be6578063dd62ed3e14610c21578063ea2f0b3714610ca6578063f2fde38b14610cf757610225565b8063a457c2d714610a4a578063a69df4b514610abb578063a9059cbb14610ad2578063b6c5232414610b43578063c49b9a8014610b6e57610225565b80637d1db4a5116100f25780637d1db4a5146108ac57806388f82020146108d75780638da5cb5b1461093e5780638ee88c531461097f57806395d89b41146109ba57610225565b80635342acb41461079e5780636bc87c3a1461080557806370a0823114610830578063715018a61461089557610225565b80633685d419116101a6578063437823ec11610175578063437823ec146106335780634549b0391461068457806349bd5a5e146106df5780634a74bb021461072057806352390c021461074d57610225565b80633685d4191461050b578063395093511461055c5780633b124fe7146105cd5780633bd5d173146105f857610225565b80631694505e116101ed5780631694505e1461039157806318160ddd146103d257806323b872dd146103fd5780632d8381191461048e578063313ce567146104dd57610225565b8063061c82d01461022a57806306fdde0314610265578063095ea7b3146102f557806313114a9d1461036657610225565b3661022557005b600080fd5b34801561023657600080fd5b506102636004803603602081101561024d57600080fd5b8101908080359060200190929190505050610d48565b005b34801561027157600080fd5b5061027a610e1a565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102ba57808201518184015260208101905061029f565b50505050905090810190601f1680156102e75780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561030157600080fd5b5061034e6004803603604081101561031857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610ebc565b60405180821515815260200191505060405180910390f35b34801561037257600080fd5b5061037b610eda565b6040518082815260200191505060405180910390f35b34801561039d57600080fd5b506103a6610ee4565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156103de57600080fd5b506103e7610f08565b6040518082815260200191505060405180910390f35b34801561040957600080fd5b506104766004803603606081101561042057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610f12565b60405180821515815260200191505060405180910390f35b34801561049a57600080fd5b506104c7600480360360208110156104b157600080fd5b8101908080359060200190929190505050610feb565b6040518082815260200191505060405180910390f35b3480156104e957600080fd5b506104f261106f565b604051808260ff16815260200191505060405180910390f35b34801561051757600080fd5b5061055a6004803603602081101561052e57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611086565b005b34801561056857600080fd5b506105b56004803603604081101561057f57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611410565b60405180821515815260200191505060405180910390f35b3480156105d957600080fd5b506105e26114c3565b6040518082815260200191505060405180910390f35b34801561060457600080fd5b506106316004803603602081101561061b57600080fd5b81019080803590602001909291905050506114c9565b005b34801561063f57600080fd5b506106826004803603602081101561065657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061165a565b005b34801561069057600080fd5b506106c9600480360360408110156106a757600080fd5b810190808035906020019092919080351515906020019092919050505061177d565b6040518082815260200191505060405180910390f35b3480156106eb57600080fd5b506106f4611834565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561072c57600080fd5b50610735611858565b60405180821515815260200191505060405180910390f35b34801561075957600080fd5b5061079c6004803603602081101561077057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061186b565b005b3480156107aa57600080fd5b506107ed600480360360208110156107c157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611b85565b60405180821515815260200191505060405180910390f35b34801561081157600080fd5b5061081a611bdb565b6040518082815260200191505060405180910390f35b34801561083c57600080fd5b5061087f6004803603602081101561085357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611be1565b6040518082815260200191505060405180910390f35b3480156108a157600080fd5b506108aa611ccc565b005b3480156108b857600080fd5b506108c1611e52565b6040518082815260200191505060405180910390f35b3480156108e357600080fd5b50610926600480360360208110156108fa57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611e58565b60405180821515815260200191505060405180910390f35b34801561094a57600080fd5b50610953611eae565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561098b57600080fd5b506109b8600480360360208110156109a257600080fd5b8101908080359060200190929190505050611ed7565b005b3480156109c657600080fd5b506109cf611fa9565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610a0f5780820151818401526020810190506109f4565b50505050905090810190601f168015610a3c5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b348015610a5657600080fd5b50610aa360048036036040811015610a6d57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061204b565b60405180821515815260200191505060405180910390f35b348015610ac757600080fd5b50610ad0612118565b005b348015610ade57600080fd5b50610b2b60048036036040811015610af557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050612335565b60405180821515815260200191505060405180910390f35b348015610b4f57600080fd5b50610b58612353565b6040518082815260200191505060405180910390f35b348015610b7a57600080fd5b50610ba960048036036020811015610b9157600080fd5b8101908080351515906020019092919050505061235d565b005b348015610bb757600080fd5b50610be460048036036020811015610bce57600080fd5b810190808035906020019092919050505061247b565b005b348015610bf257600080fd5b50610c1f60048036036020811015610c0957600080fd5b8101908080359060200190929190505050612574565b005b348015610c2d57600080fd5b50610c9060048036036040811015610c4457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050612765565b6040518082815260200191505060405180910390f35b348015610cb257600080fd5b50610cf560048036036020811015610cc957600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506127ec565b005b348015610d0357600080fd5b50610d4660048036036020811015610d1a57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061290f565b005b610d50612b1a565b73ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610e10576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b80600f8190555050565b6060600c8054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610eb25780601f10610e8757610100808354040283529160200191610eb2565b820191906000526020600020905b815481529060010190602001808311610e9557829003601f168201915b5050505050905090565b6000610ed0610ec9612b1a565b8484612b22565b6001905092915050565b6000600b54905090565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000600954905090565b6000610f1f848484612d19565b610fe084610f2b612b1a565b610fdb85604051806060016040528060288152602001614cea60289139600560008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000610f91612b1a565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546130de9092919063ffffffff16565b612b22565b600190509392505050565b6000600a54821115611048576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602a815260200180614c2f602a913960400191505060405180910390fd5b600061105261319e565b905061106781846131c990919063ffffffff16565b915050919050565b6000600e60009054906101000a900460ff16905090565b61108e612b1a565b73ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461114e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b600760008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1661120d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f4163636f756e7420697320616c7265616479206578636c75646564000000000081525060200191505060405180910390fd5b60005b60088054905081101561140c578173ffffffffffffffffffffffffffffffffffffffff166008828154811061124157fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156113ff5760086001600880549050038154811061129d57fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600882815481106112d557fe5b9060005260206000200160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506000600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555060088054806113c557fe5b6001900381819060005260206000200160006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055905561140c565b8080600101915050611210565b5050565b60006114b961141d612b1a565b846114b4856005600061142e612b1a565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461321390919063ffffffff16565b612b22565b6001905092915050565b600f5481565b60006114d3612b1a565b9050600760008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615611578576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602c815260200180614d84602c913960400191505060405180910390fd5b60006115838361329b565b505050505090506115dc81600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546132f790919063ffffffff16565b600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061163481600a546132f790919063ffffffff16565b600a8190555061164f83600b5461321390919063ffffffff16565b600b81905550505050565b611662612b1a565b73ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614611722576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b6001600660008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b60006009548311156117f7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f416d6f756e74206d757374206265206c657373207468616e20737570706c790081525060200191505060405180910390fd5b816118175760006118078461329b565b505050505090508091505061182e565b60006118228461329b565b50505050915050809150505b92915050565b7f000000000000000000000000000000000000000000000000000000000000000081565b601360019054906101000a900460ff1681565b611873612b1a565b73ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614611933576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b600760008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16156119f3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f4163636f756e7420697320616c7265616479206578636c75646564000000000081525060200191505060405180910390fd5b6000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541115611ac757611a83600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054610feb565b600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b6001600760008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055506008819080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000600660008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050919050565b60115481565b6000600760008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615611c7c57600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050611cc7565b611cc4600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054610feb565b90505b919050565b611cd4612b1a565b73ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614611d94576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a360008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b60145481565b6000600760008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050919050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b611edf612b1a565b73ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614611f9f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b8060118190555050565b6060600d8054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156120415780601f1061201657610100808354040283529160200191612041565b820191906000526020600020905b81548152906001019060200180831161202457829003601f168201915b5050505050905090565b600061210e612058612b1a565b8461210985604051806060016040528060258152602001614dd36025913960056000612082612b1a565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546130de9092919063ffffffff16565b612b22565b6001905092915050565b3373ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16146121be576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526023815260200180614db06023913960400191505060405180910390fd5b6002544211612235576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f436f6e7472616374206973206c6f636b656420756e74696c203720646179730081525060200191505060405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b6000612349612342612b1a565b8484612d19565b6001905092915050565b6000600254905090565b612365612b1a565b73ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614612425576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b80601360016101000a81548160ff0219169083151502179055507f53726dfcaf90650aa7eb35524f4d3220f07413c8d6cb404cc8c18bf5591bc1598160405180821515815260200191505060405180910390a150565b612483612b1a565b73ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614612543576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b61256b606461255d8360095461334190919063ffffffff16565b6131c990919063ffffffff16565b60148190555050565b61257c612b1a565b73ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461263c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550804201600281905550600073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a350565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b6127f4612b1a565b73ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16146128b4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b6000600660008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b612917612b1a565b73ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16146129d7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415612a5d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526026815260200180614c596026913960400191505060405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415612ba8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526024815260200180614d606024913960400191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415612c2e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526022815260200180614c7f6022913960400191505060405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040518082815260200191505060405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415612d9f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526025815260200180614d3b6025913960400191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415612e25576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526023815260200180614c0c6023913960400191505060405180910390fd5b60008111612e7e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526029815260200180614d126029913960400191505060405180910390fd5b612e86611eae565b73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614158015612ef45750612ec4611eae565b73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b15612f5557601454811115612f54576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526028815260200180614ca16028913960400191505060405180910390fd5b5b6000612f6030611be1565b90506014548110612f715760145490505b60006015548210159050808015612f955750601360009054906101000a900460ff16155b8015612fed57507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614155b80156130055750601360019054906101000a900460ff165b15613019576015549150613018826133c7565b5b600060019050600660008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16806130c05750600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff165b156130ca57600090505b6130d6868686846134a9565b505050505050565b600083831115829061318b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b83811015613150578082015181840152602081019050613135565b50505050905090810190601f16801561317d5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b5060008385039050809150509392505050565b60008060006131ab6137ba565b915091506131c281836131c990919063ffffffff16565b9250505090565b600061320b83836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f000000000000815250613a4b565b905092915050565b600080828401905083811015613291576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f536166654d6174683a206164646974696f6e206f766572666c6f77000000000081525060200191505060405180910390fd5b8091505092915050565b60008060008060008060008060006132b28a613b11565b92509250925060008060006132d08d86866132cb61319e565b613b6b565b9250925092508282828888889b509b509b509b509b509b5050505050505091939550919395565b600061333983836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f7700008152506130de565b905092915050565b60008083141561335457600090506133c1565b600082840290508284828161336557fe5b04146133bc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526021815260200180614cc96021913960400191505060405180910390fd5b809150505b92915050565b6001601360006101000a81548160ff02191690831515021790555060006133f86002836131c990919063ffffffff16565b9050600061340f82846132f790919063ffffffff16565b9050600047905061341f83613bf4565b600061343482476132f790919063ffffffff16565b90506134408382613ea2565b7f17bbfb9a6069321b6ded73bd96327c9e6b7212a5cd51ff219cd61370acafb56184828560405180848152602001838152602001828152602001935050505060405180910390a1505050506000601360006101000a81548160ff02191690831515021790555050565b806134b7576134b6613ff3565b5b600760008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16801561355a5750600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16155b1561356f5761356a848484614036565b6137a6565b600760008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161580156136125750600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff165b1561362757613622848484614296565b6137a5565b600760008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161580156136cb5750600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16155b156136e0576136db8484846144f6565b6137a4565b600760008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1680156137825750600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff165b15613797576137928484846146c1565b6137a3565b6137a28484846144f6565b5b5b5b5b806137b4576137b36149b6565b5b50505050565b6000806000600a5490506000600954905060005b600880549050811015613a0e578260036000600884815481106137ed57fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411806138d4575081600460006008848154811061386c57fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054115b156138eb57600a5460095494509450505050613a47565b61397460036000600884815481106138ff57fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054846132f790919063ffffffff16565b92506139ff600460006008848154811061398a57fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054836132f790919063ffffffff16565b915080806001019150506137ce565b50613a26600954600a546131c990919063ffffffff16565b821015613a3e57600a54600954935093505050613a47565b81819350935050505b9091565b60008083118290613af7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b83811015613abc578082015181840152602081019050613aa1565b50505050905090810190601f168015613ae95780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b506000838581613b0357fe5b049050809150509392505050565b600080600080613b20856149ca565b90506000613b2d866149fb565b90506000613b5682613b48858a6132f790919063ffffffff16565b6132f790919063ffffffff16565b90508083839550955095505050509193909250565b600080600080613b84858961334190919063ffffffff16565b90506000613b9b868961334190919063ffffffff16565b90506000613bb2878961334190919063ffffffff16565b90506000613bdb82613bcd85876132f790919063ffffffff16565b6132f790919063ffffffff16565b9050838184965096509650505050509450945094915050565b6060600267ffffffffffffffff81118015613c0e57600080fd5b50604051908082528060200260200182016040528015613c3d5781602001602082028036833780820191505090505b5090503081600081518110613c4e57fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663ad5c46486040518163ffffffff1660e01b815260040160206040518083038186803b158015613cee57600080fd5b505afa158015613d02573d6000803e3d6000fd5b505050506040513d6020811015613d1857600080fd5b810190808051906020019092919050505081600181518110613d3657fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050613d9b307f000000000000000000000000000000000000000000000000000000000000000084612b22565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663791ac9478360008430426040518663ffffffff1660e01b815260040180868152602001858152602001806020018473ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828103825285818151815260200191508051906020019060200280838360005b83811015613e5d578082015181840152602081019050613e42565b505050509050019650505050505050600060405180830381600087803b158015613e8657600080fd5b505af1158015613e9a573d6000803e3d6000fd5b505050505050565b613ecd307f000000000000000000000000000000000000000000000000000000000000000084612b22565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663f305d719823085600080613f17611eae565b426040518863ffffffff1660e01b8152600401808773ffffffffffffffffffffffffffffffffffffffff1681526020018681526020018581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200196505050505050506060604051808303818588803b158015613f9c57600080fd5b505af1158015613fb0573d6000803e3d6000fd5b50505050506040513d6060811015613fc757600080fd5b810190808051906020019092919080519060200190929190805190602001909291905050505050505050565b6000600f5414801561400757506000601154145b1561401157614034565b600f546010819055506011546012819055506000600f8190555060006011819055505b565b6000806000806000806140488761329b565b9550955095509550955095506140a687600460008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546132f790919063ffffffff16565b600460008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061413b86600360008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546132f790919063ffffffff16565b600360008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506141d085600360008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461321390919063ffffffff16565b600360008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061421c81614a2c565b6142268483614bd1565b8773ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040518082815260200191505060405180910390a3505050505050505050565b6000806000806000806142a88761329b565b95509550955095509550955061430686600360008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546132f790919063ffffffff16565b600360008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061439b83600460008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461321390919063ffffffff16565b600460008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061443085600360008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461321390919063ffffffff16565b600360008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061447c81614a2c565b6144868483614bd1565b8773ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040518082815260200191505060405180910390a3505050505050505050565b6000806000806000806145088761329b565b95509550955095509550955061456686600360008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546132f790919063ffffffff16565b600360008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506145fb85600360008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461321390919063ffffffff16565b600360008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061464781614a2c565b6146518483614bd1565b8773ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040518082815260200191505060405180910390a3505050505050505050565b6000806000806000806146d38761329b565b95509550955095509550955061473187600460008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546132f790919063ffffffff16565b600460008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506147c686600360008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546132f790919063ffffffff16565b600360008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061485b83600460008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461321390919063ffffffff16565b600460008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506148f085600360008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461321390919063ffffffff16565b600360008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061493c81614a2c565b6149468483614bd1565b8773ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040518082815260200191505060405180910390a3505050505050505050565b601054600f81905550601254601181905550565b60006149f460646149e6600f548561334190919063ffffffff16565b6131c990919063ffffffff16565b9050919050565b6000614a256064614a176011548561334190919063ffffffff16565b6131c990919063ffffffff16565b9050919050565b6000614a3661319e565b90506000614a4d828461334190919063ffffffff16565b9050614aa181600360003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461321390919063ffffffff16565b600360003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600760003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615614bcc57614b8883600460003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461321390919063ffffffff16565b600460003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b505050565b614be682600a546132f790919063ffffffff16565b600a81905550614c0181600b5461321390919063ffffffff16565b600b81905550505056fe45524332303a207472616e7366657220746f20746865207a65726f2061646472657373416d6f756e74206d757374206265206c657373207468616e20746f74616c207265666c656374696f6e734f776e61626c653a206e6577206f776e657220697320746865207a65726f206164647265737345524332303a20617070726f766520746f20746865207a65726f20616464726573735472616e7366657220616d6f756e74206578636565647320746865206d61785478416d6f756e742e536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f7745524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e63655472616e7366657220616d6f756e74206d7573742062652067726561746572207468616e207a65726f45524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f20616464726573734578636c75646564206164647265737365732063616e6e6f742063616c6c20746869732066756e6374696f6e596f7520646f6e27742068617665207065726d697373696f6e20746f20756e6c6f636b45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa2646970667358221220f4686d1ac1672734de3c1681fb07fa7167b269f44cc3674e970b7bc77d32ea0d64736f6c634300060c0033",
        "opcodes": "PUSH1 0xC0 PUSH1 0x40 MSTORE PUSH7 0x38D7EA4C68000 PUSH1 0x9 SSTORE PUSH1 0x9 SLOAD PUSH1 0x0 NOT DUP2 PUSH3 0x1D JUMPI INVALID JUMPDEST MOD PUSH1 0x0 NOT SUB PUSH1 0xA SSTORE PUSH1 0x40 MLOAD DUP1 PUSH1 0x40 ADD PUSH1 0x40 MSTORE DUP1 PUSH1 0xF DUP2 MSTORE PUSH1 0x20 ADD PUSH32 0x425343204C41554E434820544553540000000000000000000000000000000000 DUP2 MSTORE POP PUSH1 0xC SWAP1 DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 PUSH3 0x72 SWAP3 SWAP2 SWAP1 PUSH3 0x5F6 JUMP JUMPDEST POP PUSH1 0x40 MLOAD DUP1 PUSH1 0x40 ADD PUSH1 0x40 MSTORE DUP1 PUSH1 0x9 DUP2 MSTORE PUSH1 0x20 ADD PUSH32 0x4253434C41554E43480000000000000000000000000000000000000000000000 DUP2 MSTORE POP PUSH1 0xD SWAP1 DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 PUSH3 0xC0 SWAP3 SWAP2 SWAP1 PUSH3 0x5F6 JUMP JUMPDEST POP PUSH1 0x9 PUSH1 0xE PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 PUSH1 0xFF AND MUL OR SWAP1 SSTORE POP PUSH1 0x0 PUSH1 0xF SSTORE PUSH1 0xF SLOAD PUSH1 0x10 SSTORE PUSH1 0x0 PUSH1 0x11 SSTORE PUSH1 0x11 SLOAD PUSH1 0x12 SSTORE PUSH1 0x1 PUSH1 0x13 PUSH1 0x1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH7 0x38D7EA4C68000 PUSH1 0x14 SSTORE PUSH7 0x38D7EA4C68000 PUSH1 0x15 SSTORE CALLVALUE DUP1 ISZERO PUSH3 0x131 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x0 PUSH3 0x144 PUSH3 0x5C5 PUSH1 0x20 SHL PUSH1 0x20 SHR JUMP JUMPDEST SWAP1 POP DUP1 PUSH1 0x0 DUP1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP DUP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0x8BE0079C531659141344CD1FD0A4F28419497F9722A3DAAFE3B4186F6B6457E0 PUSH1 0x40 MLOAD PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP PUSH1 0xA SLOAD PUSH1 0x3 PUSH1 0x0 PUSH3 0x1F9 PUSH3 0x5C5 PUSH1 0x20 SHL PUSH1 0x20 SHR JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH1 0x0 PUSH20 0xD99D1C33F9FC3444F8101754ABC46C52416550D1 SWAP1 POP DUP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0xC45A0155 PUSH1 0x40 MLOAD DUP2 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP7 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH3 0x297 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS STATICCALL ISZERO DUP1 ISZERO PUSH3 0x2AC JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x20 DUP2 LT ISZERO PUSH3 0x2C3 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0xC9C65396 ADDRESS DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0xAD5C4648 PUSH1 0x40 MLOAD DUP2 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP7 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH3 0x337 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS STATICCALL ISZERO DUP1 ISZERO PUSH3 0x34C JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x20 DUP2 LT ISZERO PUSH3 0x363 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP3 POP POP POP PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH3 0x3DE JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH3 0x3F3 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x20 DUP2 LT ISZERO PUSH3 0x40A JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0xA0 DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x60 SHL DUP2 MSTORE POP POP DUP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x80 DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x60 SHL DUP2 MSTORE POP POP PUSH1 0x1 PUSH1 0x6 PUSH1 0x0 PUSH3 0x49E PUSH3 0x5CD PUSH1 0x20 SHL PUSH1 0x20 SHR JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH1 0x1 PUSH1 0x6 PUSH1 0x0 ADDRESS PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH3 0x557 PUSH3 0x5C5 PUSH1 0x20 SHL PUSH1 0x20 SHR JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0xDDF252AD1BE2C89B69C2B068FC378DAA952BA7F163C4A11628F55A4DF523B3EF PUSH1 0x9 SLOAD PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP PUSH3 0x69C JUMP JUMPDEST PUSH1 0x0 CALLER SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP SWAP1 JUMP JUMPDEST DUP3 DUP1 SLOAD PUSH1 0x1 DUP2 PUSH1 0x1 AND ISZERO PUSH2 0x100 MUL SUB AND PUSH1 0x2 SWAP1 DIV SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 SWAP1 PUSH1 0x1F ADD PUSH1 0x20 SWAP1 DIV DUP2 ADD SWAP3 DUP3 PUSH1 0x1F LT PUSH3 0x639 JUMPI DUP1 MLOAD PUSH1 0xFF NOT AND DUP4 DUP1 ADD OR DUP6 SSTORE PUSH3 0x66A JUMP JUMPDEST DUP3 DUP1 ADD PUSH1 0x1 ADD DUP6 SSTORE DUP3 ISZERO PUSH3 0x66A JUMPI SWAP2 DUP3 ADD JUMPDEST DUP3 DUP2 GT ISZERO PUSH3 0x669 JUMPI DUP3 MLOAD DUP3 SSTORE SWAP2 PUSH1 0x20 ADD SWAP2 SWAP1 PUSH1 0x1 ADD SWAP1 PUSH3 0x64C JUMP JUMPDEST JUMPDEST POP SWAP1 POP PUSH3 0x679 SWAP2 SWAP1 PUSH3 0x67D JUMP JUMPDEST POP SWAP1 JUMP JUMPDEST JUMPDEST DUP1 DUP3 GT ISZERO PUSH3 0x698 JUMPI PUSH1 0x0 DUP2 PUSH1 0x0 SWAP1 SSTORE POP PUSH1 0x1 ADD PUSH3 0x67E JUMP JUMPDEST POP SWAP1 JUMP JUMPDEST PUSH1 0x80 MLOAD PUSH1 0x60 SHR PUSH1 0xA0 MLOAD PUSH1 0x60 SHR PUSH2 0x4E2D PUSH3 0x6E4 PUSH1 0x0 CODECOPY DUP1 PUSH2 0x1836 MSTORE DUP1 PUSH2 0x2F9E MSTORE POP DUP1 PUSH2 0xEE6 MSTORE DUP1 PUSH2 0x3C8A MSTORE DUP1 PUSH2 0x3D76 MSTORE DUP1 PUSH2 0x3D9D MSTORE DUP1 PUSH2 0x3EA8 MSTORE DUP1 PUSH2 0x3ECF MSTORE POP PUSH2 0x4E2D PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE PUSH1 0x4 CALLDATASIZE LT PUSH2 0x21E JUMPI PUSH1 0x0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0x5342ACB4 GT PUSH2 0x123 JUMPI DUP1 PUSH4 0xA457C2D7 GT PUSH2 0xAB JUMPI DUP1 PUSH4 0xD543DBEB GT PUSH2 0x6F JUMPI DUP1 PUSH4 0xD543DBEB EQ PUSH2 0xBAB JUMPI DUP1 PUSH4 0xDD467064 EQ PUSH2 0xBE6 JUMPI DUP1 PUSH4 0xDD62ED3E EQ PUSH2 0xC21 JUMPI DUP1 PUSH4 0xEA2F0B37 EQ PUSH2 0xCA6 JUMPI DUP1 PUSH4 0xF2FDE38B EQ PUSH2 0xCF7 JUMPI PUSH2 0x225 JUMP JUMPDEST DUP1 PUSH4 0xA457C2D7 EQ PUSH2 0xA4A JUMPI DUP1 PUSH4 0xA69DF4B5 EQ PUSH2 0xABB JUMPI DUP1 PUSH4 0xA9059CBB EQ PUSH2 0xAD2 JUMPI DUP1 PUSH4 0xB6C52324 EQ PUSH2 0xB43 JUMPI DUP1 PUSH4 0xC49B9A80 EQ PUSH2 0xB6E JUMPI PUSH2 0x225 JUMP JUMPDEST DUP1 PUSH4 0x7D1DB4A5 GT PUSH2 0xF2 JUMPI DUP1 PUSH4 0x7D1DB4A5 EQ PUSH2 0x8AC JUMPI DUP1 PUSH4 0x88F82020 EQ PUSH2 0x8D7 JUMPI DUP1 PUSH4 0x8DA5CB5B EQ PUSH2 0x93E JUMPI DUP1 PUSH4 0x8EE88C53 EQ PUSH2 0x97F JUMPI DUP1 PUSH4 0x95D89B41 EQ PUSH2 0x9BA JUMPI PUSH2 0x225 JUMP JUMPDEST DUP1 PUSH4 0x5342ACB4 EQ PUSH2 0x79E JUMPI DUP1 PUSH4 0x6BC87C3A EQ PUSH2 0x805 JUMPI DUP1 PUSH4 0x70A08231 EQ PUSH2 0x830 JUMPI DUP1 PUSH4 0x715018A6 EQ PUSH2 0x895 JUMPI PUSH2 0x225 JUMP JUMPDEST DUP1 PUSH4 0x3685D419 GT PUSH2 0x1A6 JUMPI DUP1 PUSH4 0x437823EC GT PUSH2 0x175 JUMPI DUP1 PUSH4 0x437823EC EQ PUSH2 0x633 JUMPI DUP1 PUSH4 0x4549B039 EQ PUSH2 0x684 JUMPI DUP1 PUSH4 0x49BD5A5E EQ PUSH2 0x6DF JUMPI DUP1 PUSH4 0x4A74BB02 EQ PUSH2 0x720 JUMPI DUP1 PUSH4 0x52390C02 EQ PUSH2 0x74D JUMPI PUSH2 0x225 JUMP JUMPDEST DUP1 PUSH4 0x3685D419 EQ PUSH2 0x50B JUMPI DUP1 PUSH4 0x39509351 EQ PUSH2 0x55C JUMPI DUP1 PUSH4 0x3B124FE7 EQ PUSH2 0x5CD JUMPI DUP1 PUSH4 0x3BD5D173 EQ PUSH2 0x5F8 JUMPI PUSH2 0x225 JUMP JUMPDEST DUP1 PUSH4 0x1694505E GT PUSH2 0x1ED JUMPI DUP1 PUSH4 0x1694505E EQ PUSH2 0x391 JUMPI DUP1 PUSH4 0x18160DDD EQ PUSH2 0x3D2 JUMPI DUP1 PUSH4 0x23B872DD EQ PUSH2 0x3FD JUMPI DUP1 PUSH4 0x2D838119 EQ PUSH2 0x48E JUMPI DUP1 PUSH4 0x313CE567 EQ PUSH2 0x4DD JUMPI PUSH2 0x225 JUMP JUMPDEST DUP1 PUSH4 0x61C82D0 EQ PUSH2 0x22A JUMPI DUP1 PUSH4 0x6FDDE03 EQ PUSH2 0x265 JUMPI DUP1 PUSH4 0x95EA7B3 EQ PUSH2 0x2F5 JUMPI DUP1 PUSH4 0x13114A9D EQ PUSH2 0x366 JUMPI PUSH2 0x225 JUMP JUMPDEST CALLDATASIZE PUSH2 0x225 JUMPI STOP JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x236 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x263 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0x24D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0xD48 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x271 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x27A PUSH2 0xE1A JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE DUP4 DUP2 DUP2 MLOAD DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 DUP1 DUP4 DUP4 PUSH1 0x0 JUMPDEST DUP4 DUP2 LT ISZERO PUSH2 0x2BA JUMPI DUP1 DUP3 ADD MLOAD DUP2 DUP5 ADD MSTORE PUSH1 0x20 DUP2 ADD SWAP1 POP PUSH2 0x29F JUMP JUMPDEST POP POP POP POP SWAP1 POP SWAP1 DUP2 ADD SWAP1 PUSH1 0x1F AND DUP1 ISZERO PUSH2 0x2E7 JUMPI DUP1 DUP3 SUB DUP1 MLOAD PUSH1 0x1 DUP4 PUSH1 0x20 SUB PUSH2 0x100 EXP SUB NOT AND DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP JUMPDEST POP SWAP3 POP POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x301 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x34E PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x40 DUP2 LT ISZERO PUSH2 0x318 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0xEBC JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 ISZERO ISZERO DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x372 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x37B PUSH2 0xEDA JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x39D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x3A6 PUSH2 0xEE4 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x3DE JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x3E7 PUSH2 0xF08 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x409 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x476 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x60 DUP2 LT ISZERO PUSH2 0x420 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0xF12 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 ISZERO ISZERO DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x49A JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x4C7 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0x4B1 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0xFEB JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x4E9 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x4F2 PUSH2 0x106F JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 PUSH1 0xFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x517 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x55A PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0x52E JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x1086 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x568 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x5B5 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x40 DUP2 LT ISZERO PUSH2 0x57F JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x1410 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 ISZERO ISZERO DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x5D9 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x5E2 PUSH2 0x14C3 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x604 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x631 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0x61B JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x14C9 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x63F JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x682 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0x656 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x165A JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x690 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x6C9 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x40 DUP2 LT ISZERO PUSH2 0x6A7 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 DUP1 CALLDATALOAD ISZERO ISZERO SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x177D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x6EB JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x6F4 PUSH2 0x1834 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x72C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x735 PUSH2 0x1858 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 ISZERO ISZERO DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x759 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x79C PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0x770 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x186B JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x7AA JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x7ED PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0x7C1 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x1B85 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 ISZERO ISZERO DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x811 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x81A PUSH2 0x1BDB JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x83C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x87F PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0x853 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x1BE1 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x8A1 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x8AA PUSH2 0x1CCC JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x8B8 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x8C1 PUSH2 0x1E52 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x8E3 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x926 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0x8FA JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x1E58 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 ISZERO ISZERO DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x94A JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x953 PUSH2 0x1EAE JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x98B JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x9B8 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0x9A2 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x1ED7 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x9C6 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x9CF PUSH2 0x1FA9 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE DUP4 DUP2 DUP2 MLOAD DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 DUP1 DUP4 DUP4 PUSH1 0x0 JUMPDEST DUP4 DUP2 LT ISZERO PUSH2 0xA0F JUMPI DUP1 DUP3 ADD MLOAD DUP2 DUP5 ADD MSTORE PUSH1 0x20 DUP2 ADD SWAP1 POP PUSH2 0x9F4 JUMP JUMPDEST POP POP POP POP SWAP1 POP SWAP1 DUP2 ADD SWAP1 PUSH1 0x1F AND DUP1 ISZERO PUSH2 0xA3C JUMPI DUP1 DUP3 SUB DUP1 MLOAD PUSH1 0x1 DUP4 PUSH1 0x20 SUB PUSH2 0x100 EXP SUB NOT AND DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP JUMPDEST POP SWAP3 POP POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xA56 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xAA3 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x40 DUP2 LT ISZERO PUSH2 0xA6D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x204B JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 ISZERO ISZERO DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xAC7 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xAD0 PUSH2 0x2118 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xADE JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xB2B PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x40 DUP2 LT ISZERO PUSH2 0xAF5 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x2335 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 ISZERO ISZERO DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xB4F JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xB58 PUSH2 0x2353 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xB7A JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xBA9 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0xB91 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD ISZERO ISZERO SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x235D JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xBB7 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xBE4 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0xBCE JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x247B JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xBF2 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xC1F PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0xC09 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x2574 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xC2D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xC90 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x40 DUP2 LT ISZERO PUSH2 0xC44 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x2765 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xCB2 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xCF5 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0xCC9 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x27EC JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xD03 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xD46 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0xD1A JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x290F JUMP JUMPDEST STOP JUMPDEST PUSH2 0xD50 PUSH2 0x2B1A JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0xE10 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x20 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x4F776E61626C653A2063616C6C6572206973206E6F7420746865206F776E6572 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP1 PUSH1 0xF DUP2 SWAP1 SSTORE POP POP JUMP JUMPDEST PUSH1 0x60 PUSH1 0xC DUP1 SLOAD PUSH1 0x1 DUP2 PUSH1 0x1 AND ISZERO PUSH2 0x100 MUL SUB AND PUSH1 0x2 SWAP1 DIV DUP1 PUSH1 0x1F ADD PUSH1 0x20 DUP1 SWAP2 DIV MUL PUSH1 0x20 ADD PUSH1 0x40 MLOAD SWAP1 DUP2 ADD PUSH1 0x40 MSTORE DUP1 SWAP3 SWAP2 SWAP1 DUP2 DUP2 MSTORE PUSH1 0x20 ADD DUP3 DUP1 SLOAD PUSH1 0x1 DUP2 PUSH1 0x1 AND ISZERO PUSH2 0x100 MUL SUB AND PUSH1 0x2 SWAP1 DIV DUP1 ISZERO PUSH2 0xEB2 JUMPI DUP1 PUSH1 0x1F LT PUSH2 0xE87 JUMPI PUSH2 0x100 DUP1 DUP4 SLOAD DIV MUL DUP4 MSTORE SWAP2 PUSH1 0x20 ADD SWAP2 PUSH2 0xEB2 JUMP JUMPDEST DUP3 ADD SWAP2 SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 SWAP1 JUMPDEST DUP2 SLOAD DUP2 MSTORE SWAP1 PUSH1 0x1 ADD SWAP1 PUSH1 0x20 ADD DUP1 DUP4 GT PUSH2 0xE95 JUMPI DUP3 SWAP1 SUB PUSH1 0x1F AND DUP3 ADD SWAP2 JUMPDEST POP POP POP POP POP SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH2 0xED0 PUSH2 0xEC9 PUSH2 0x2B1A JUMP JUMPDEST DUP5 DUP5 PUSH2 0x2B22 JUMP JUMPDEST PUSH1 0x1 SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0xB SLOAD SWAP1 POP SWAP1 JUMP JUMPDEST PUSH32 0x0 DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x9 SLOAD SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH2 0xF1F DUP5 DUP5 DUP5 PUSH2 0x2D19 JUMP JUMPDEST PUSH2 0xFE0 DUP5 PUSH2 0xF2B PUSH2 0x2B1A JUMP JUMPDEST PUSH2 0xFDB DUP6 PUSH1 0x40 MLOAD DUP1 PUSH1 0x60 ADD PUSH1 0x40 MSTORE DUP1 PUSH1 0x28 DUP2 MSTORE PUSH1 0x20 ADD PUSH2 0x4CEA PUSH1 0x28 SWAP2 CODECOPY PUSH1 0x5 PUSH1 0x0 DUP12 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0xF91 PUSH2 0x2B1A JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x30DE SWAP1 SWAP3 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH2 0x2B22 JUMP JUMPDEST PUSH1 0x1 SWAP1 POP SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0xA SLOAD DUP3 GT ISZERO PUSH2 0x1048 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x2A DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH2 0x4C2F PUSH1 0x2A SWAP2 CODECOPY PUSH1 0x40 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1052 PUSH2 0x319E JUMP JUMPDEST SWAP1 POP PUSH2 0x1067 DUP2 DUP5 PUSH2 0x31C9 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST SWAP2 POP POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0xE PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH2 0x108E PUSH2 0x2B1A JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x114E JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x20 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x4F776E61626C653A2063616C6C6572206973206E6F7420746865206F776E6572 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x7 PUSH1 0x0 DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND PUSH2 0x120D JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x1B DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x4163636F756E7420697320616C7265616479206578636C756465640000000000 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 JUMPDEST PUSH1 0x8 DUP1 SLOAD SWAP1 POP DUP2 LT ISZERO PUSH2 0x140C JUMPI DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x8 DUP3 DUP2 SLOAD DUP2 LT PUSH2 0x1241 JUMPI INVALID JUMPDEST SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 ADD PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO PUSH2 0x13FF JUMPI PUSH1 0x8 PUSH1 0x1 PUSH1 0x8 DUP1 SLOAD SWAP1 POP SUB DUP2 SLOAD DUP2 LT PUSH2 0x129D JUMPI INVALID JUMPDEST SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 ADD PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x8 DUP3 DUP2 SLOAD DUP2 LT PUSH2 0x12D5 JUMPI INVALID JUMPDEST SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 ADD PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP PUSH1 0x0 PUSH1 0x4 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH1 0x0 PUSH1 0x7 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH1 0x8 DUP1 SLOAD DUP1 PUSH2 0x13C5 JUMPI INVALID JUMPDEST PUSH1 0x1 SWAP1 SUB DUP2 DUP2 SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 ADD PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD SWAP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 SSTORE SWAP1 SSTORE PUSH2 0x140C JUMP JUMPDEST DUP1 DUP1 PUSH1 0x1 ADD SWAP2 POP POP PUSH2 0x1210 JUMP JUMPDEST POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x14B9 PUSH2 0x141D PUSH2 0x2B1A JUMP JUMPDEST DUP5 PUSH2 0x14B4 DUP6 PUSH1 0x5 PUSH1 0x0 PUSH2 0x142E PUSH2 0x2B1A JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP10 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x3213 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH2 0x2B22 JUMP JUMPDEST PUSH1 0x1 SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0xF SLOAD DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH2 0x14D3 PUSH2 0x2B1A JUMP JUMPDEST SWAP1 POP PUSH1 0x7 PUSH1 0x0 DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND ISZERO PUSH2 0x1578 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x2C DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH2 0x4D84 PUSH1 0x2C SWAP2 CODECOPY PUSH1 0x40 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1583 DUP4 PUSH2 0x329B JUMP JUMPDEST POP POP POP POP POP SWAP1 POP PUSH2 0x15DC DUP2 PUSH1 0x3 PUSH1 0x0 DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0x3 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH2 0x1634 DUP2 PUSH1 0xA SLOAD PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0xA DUP2 SWAP1 SSTORE POP PUSH2 0x164F DUP4 PUSH1 0xB SLOAD PUSH2 0x3213 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0xB DUP2 SWAP1 SSTORE POP POP POP POP JUMP JUMPDEST PUSH2 0x1662 PUSH2 0x2B1A JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x1722 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x20 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x4F776E61626C653A2063616C6C6572206973206E6F7420746865206F776E6572 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x1 PUSH1 0x6 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x9 SLOAD DUP4 GT ISZERO PUSH2 0x17F7 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x1F DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x416D6F756E74206D757374206265206C657373207468616E20737570706C7900 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP2 PUSH2 0x1817 JUMPI PUSH1 0x0 PUSH2 0x1807 DUP5 PUSH2 0x329B JUMP JUMPDEST POP POP POP POP POP SWAP1 POP DUP1 SWAP2 POP POP PUSH2 0x182E JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1822 DUP5 PUSH2 0x329B JUMP JUMPDEST POP POP POP POP SWAP2 POP POP DUP1 SWAP2 POP POP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH32 0x0 DUP2 JUMP JUMPDEST PUSH1 0x13 PUSH1 0x1 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND DUP2 JUMP JUMPDEST PUSH2 0x1873 PUSH2 0x2B1A JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x1933 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x20 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x4F776E61626C653A2063616C6C6572206973206E6F7420746865206F776E6572 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x7 PUSH1 0x0 DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND ISZERO PUSH2 0x19F3 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x1B DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x4163636F756E7420697320616C7265616479206578636C756465640000000000 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 PUSH1 0x3 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD GT ISZERO PUSH2 0x1AC7 JUMPI PUSH2 0x1A83 PUSH1 0x3 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0xFEB JUMP JUMPDEST PUSH1 0x4 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP JUMPDEST PUSH1 0x1 PUSH1 0x7 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH1 0x8 DUP2 SWAP1 DUP1 PUSH1 0x1 DUP2 SLOAD ADD DUP1 DUP3 SSTORE DUP1 SWAP2 POP POP PUSH1 0x1 SWAP1 SUB SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 ADD PUSH1 0x0 SWAP1 SWAP2 SWAP1 SWAP2 SWAP1 SWAP2 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x6 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x11 SLOAD DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x7 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND ISZERO PUSH2 0x1C7C JUMPI PUSH1 0x4 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD SWAP1 POP PUSH2 0x1CC7 JUMP JUMPDEST PUSH2 0x1CC4 PUSH1 0x3 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0xFEB JUMP JUMPDEST SWAP1 POP JUMPDEST SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x1CD4 PUSH2 0x2B1A JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x1D94 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x20 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x4F776E61626C653A2063616C6C6572206973206E6F7420746865206F776E6572 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0x8BE0079C531659141344CD1FD0A4F28419497F9722A3DAAFE3B4186F6B6457E0 PUSH1 0x40 MLOAD PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 PUSH1 0x0 DUP1 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP JUMP JUMPDEST PUSH1 0x14 SLOAD DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x7 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH2 0x1EDF PUSH2 0x2B1A JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x1F9F JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x20 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x4F776E61626C653A2063616C6C6572206973206E6F7420746865206F776E6572 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP1 PUSH1 0x11 DUP2 SWAP1 SSTORE POP POP JUMP JUMPDEST PUSH1 0x60 PUSH1 0xD DUP1 SLOAD PUSH1 0x1 DUP2 PUSH1 0x1 AND ISZERO PUSH2 0x100 MUL SUB AND PUSH1 0x2 SWAP1 DIV DUP1 PUSH1 0x1F ADD PUSH1 0x20 DUP1 SWAP2 DIV MUL PUSH1 0x20 ADD PUSH1 0x40 MLOAD SWAP1 DUP2 ADD PUSH1 0x40 MSTORE DUP1 SWAP3 SWAP2 SWAP1 DUP2 DUP2 MSTORE PUSH1 0x20 ADD DUP3 DUP1 SLOAD PUSH1 0x1 DUP2 PUSH1 0x1 AND ISZERO PUSH2 0x100 MUL SUB AND PUSH1 0x2 SWAP1 DIV DUP1 ISZERO PUSH2 0x2041 JUMPI DUP1 PUSH1 0x1F LT PUSH2 0x2016 JUMPI PUSH2 0x100 DUP1 DUP4 SLOAD DIV MUL DUP4 MSTORE SWAP2 PUSH1 0x20 ADD SWAP2 PUSH2 0x2041 JUMP JUMPDEST DUP3 ADD SWAP2 SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 SWAP1 JUMPDEST DUP2 SLOAD DUP2 MSTORE SWAP1 PUSH1 0x1 ADD SWAP1 PUSH1 0x20 ADD DUP1 DUP4 GT PUSH2 0x2024 JUMPI DUP3 SWAP1 SUB PUSH1 0x1F AND DUP3 ADD SWAP2 JUMPDEST POP POP POP POP POP SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH2 0x210E PUSH2 0x2058 PUSH2 0x2B1A JUMP JUMPDEST DUP5 PUSH2 0x2109 DUP6 PUSH1 0x40 MLOAD DUP1 PUSH1 0x60 ADD PUSH1 0x40 MSTORE DUP1 PUSH1 0x25 DUP2 MSTORE PUSH1 0x20 ADD PUSH2 0x4DD3 PUSH1 0x25 SWAP2 CODECOPY PUSH1 0x5 PUSH1 0x0 PUSH2 0x2082 PUSH2 0x2B1A JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP11 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x30DE SWAP1 SWAP3 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH2 0x2B22 JUMP JUMPDEST PUSH1 0x1 SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x21BE JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x23 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH2 0x4DB0 PUSH1 0x23 SWAP2 CODECOPY PUSH1 0x40 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x2 SLOAD TIMESTAMP GT PUSH2 0x2235 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x1F DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x436F6E7472616374206973206C6F636B656420756E74696C2037206461797300 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0x8BE0079C531659141344CD1FD0A4F28419497F9722A3DAAFE3B4186F6B6457E0 PUSH1 0x40 MLOAD PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 PUSH1 0x1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x2349 PUSH2 0x2342 PUSH2 0x2B1A JUMP JUMPDEST DUP5 DUP5 PUSH2 0x2D19 JUMP JUMPDEST PUSH1 0x1 SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x2 SLOAD SWAP1 POP SWAP1 JUMP JUMPDEST PUSH2 0x2365 PUSH2 0x2B1A JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x2425 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x20 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x4F776E61626C653A2063616C6C6572206973206E6F7420746865206F776E6572 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP1 PUSH1 0x13 PUSH1 0x1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH32 0x53726DFCAF90650AA7EB35524F4D3220F07413C8D6CB404CC8C18BF5591BC159 DUP2 PUSH1 0x40 MLOAD DUP1 DUP3 ISZERO ISZERO DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG1 POP JUMP JUMPDEST PUSH2 0x2483 PUSH2 0x2B1A JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x2543 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x20 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x4F776E61626C653A2063616C6C6572206973206E6F7420746865206F776E6572 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x256B PUSH1 0x64 PUSH2 0x255D DUP4 PUSH1 0x9 SLOAD PUSH2 0x3341 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH2 0x31C9 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0x14 DUP2 SWAP1 SSTORE POP POP JUMP JUMPDEST PUSH2 0x257C PUSH2 0x2B1A JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x263C JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x20 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x4F776E61626C653A2063616C6C6572206973206E6F7420746865206F776E6572 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x1 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP PUSH1 0x0 DUP1 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP DUP1 TIMESTAMP ADD PUSH1 0x2 DUP2 SWAP1 SSTORE POP PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0x8BE0079C531659141344CD1FD0A4F28419497F9722A3DAAFE3B4186F6B6457E0 PUSH1 0x40 MLOAD PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x5 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH2 0x27F4 PUSH2 0x2B1A JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x28B4 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x20 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x4F776E61626C653A2063616C6C6572206973206E6F7420746865206F776E6572 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 PUSH1 0x6 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP POP JUMP JUMPDEST PUSH2 0x2917 PUSH2 0x2B1A JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x29D7 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x20 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x4F776E61626C653A2063616C6C6572206973206E6F7420746865206F776E6572 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO PUSH2 0x2A5D JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x26 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH2 0x4C59 PUSH1 0x26 SWAP2 CODECOPY PUSH1 0x40 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0x8BE0079C531659141344CD1FD0A4F28419497F9722A3DAAFE3B4186F6B6457E0 PUSH1 0x40 MLOAD PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 DUP1 PUSH1 0x0 DUP1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP POP JUMP JUMPDEST PUSH1 0x0 CALLER SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO PUSH2 0x2BA8 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x24 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH2 0x4D60 PUSH1 0x24 SWAP2 CODECOPY PUSH1 0x40 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO PUSH2 0x2C2E JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x22 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH2 0x4C7F PUSH1 0x22 SWAP2 CODECOPY PUSH1 0x40 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP1 PUSH1 0x5 PUSH1 0x0 DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0x8C5BE1E5EBEC7D5BD14F71427D1E84F3DD0314C0F7B2291E5B200AC8C7C3B925 DUP4 PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO PUSH2 0x2D9F JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x25 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH2 0x4D3B PUSH1 0x25 SWAP2 CODECOPY PUSH1 0x40 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO PUSH2 0x2E25 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x23 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH2 0x4C0C PUSH1 0x23 SWAP2 CODECOPY PUSH1 0x40 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 DUP2 GT PUSH2 0x2E7E JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x29 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH2 0x4D12 PUSH1 0x29 SWAP2 CODECOPY PUSH1 0x40 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x2E86 PUSH2 0x1EAE JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO DUP1 ISZERO PUSH2 0x2EF4 JUMPI POP PUSH2 0x2EC4 PUSH2 0x1EAE JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO JUMPDEST ISZERO PUSH2 0x2F55 JUMPI PUSH1 0x14 SLOAD DUP2 GT ISZERO PUSH2 0x2F54 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x28 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH2 0x4CA1 PUSH1 0x28 SWAP2 CODECOPY PUSH1 0x40 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST JUMPDEST PUSH1 0x0 PUSH2 0x2F60 ADDRESS PUSH2 0x1BE1 JUMP JUMPDEST SWAP1 POP PUSH1 0x14 SLOAD DUP2 LT PUSH2 0x2F71 JUMPI PUSH1 0x14 SLOAD SWAP1 POP JUMPDEST PUSH1 0x0 PUSH1 0x15 SLOAD DUP3 LT ISZERO SWAP1 POP DUP1 DUP1 ISZERO PUSH2 0x2F95 JUMPI POP PUSH1 0x13 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND ISZERO JUMPDEST DUP1 ISZERO PUSH2 0x2FED JUMPI POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO JUMPDEST DUP1 ISZERO PUSH2 0x3005 JUMPI POP PUSH1 0x13 PUSH1 0x1 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND JUMPDEST ISZERO PUSH2 0x3019 JUMPI PUSH1 0x15 SLOAD SWAP2 POP PUSH2 0x3018 DUP3 PUSH2 0x33C7 JUMP JUMPDEST JUMPDEST PUSH1 0x0 PUSH1 0x1 SWAP1 POP PUSH1 0x6 PUSH1 0x0 DUP8 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND DUP1 PUSH2 0x30C0 JUMPI POP PUSH1 0x6 PUSH1 0x0 DUP7 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND JUMPDEST ISZERO PUSH2 0x30CA JUMPI PUSH1 0x0 SWAP1 POP JUMPDEST PUSH2 0x30D6 DUP7 DUP7 DUP7 DUP5 PUSH2 0x34A9 JUMP JUMPDEST POP POP POP POP POP POP JUMP JUMPDEST PUSH1 0x0 DUP4 DUP4 GT ISZERO DUP3 SWAP1 PUSH2 0x318B JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE DUP4 DUP2 DUP2 MLOAD DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 DUP1 DUP4 DUP4 PUSH1 0x0 JUMPDEST DUP4 DUP2 LT ISZERO PUSH2 0x3150 JUMPI DUP1 DUP3 ADD MLOAD DUP2 DUP5 ADD MSTORE PUSH1 0x20 DUP2 ADD SWAP1 POP PUSH2 0x3135 JUMP JUMPDEST POP POP POP POP SWAP1 POP SWAP1 DUP2 ADD SWAP1 PUSH1 0x1F AND DUP1 ISZERO PUSH2 0x317D JUMPI DUP1 DUP3 SUB DUP1 MLOAD PUSH1 0x1 DUP4 PUSH1 0x20 SUB PUSH2 0x100 EXP SUB NOT AND DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP JUMPDEST POP SWAP3 POP POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST POP PUSH1 0x0 DUP4 DUP6 SUB SWAP1 POP DUP1 SWAP2 POP POP SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 PUSH2 0x31AB PUSH2 0x37BA JUMP JUMPDEST SWAP2 POP SWAP2 POP PUSH2 0x31C2 DUP2 DUP4 PUSH2 0x31C9 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST SWAP3 POP POP POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH2 0x320B DUP4 DUP4 PUSH1 0x40 MLOAD DUP1 PUSH1 0x40 ADD PUSH1 0x40 MSTORE DUP1 PUSH1 0x1A DUP2 MSTORE PUSH1 0x20 ADD PUSH32 0x536166654D6174683A206469766973696F6E206279207A65726F000000000000 DUP2 MSTORE POP PUSH2 0x3A4B JUMP JUMPDEST SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 DUP3 DUP5 ADD SWAP1 POP DUP4 DUP2 LT ISZERO PUSH2 0x3291 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x1B DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x536166654D6174683A206164646974696F6E206F766572666C6F770000000000 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP1 SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH1 0x0 PUSH2 0x32B2 DUP11 PUSH2 0x3B11 JUMP JUMPDEST SWAP3 POP SWAP3 POP SWAP3 POP PUSH1 0x0 DUP1 PUSH1 0x0 PUSH2 0x32D0 DUP14 DUP7 DUP7 PUSH2 0x32CB PUSH2 0x319E JUMP JUMPDEST PUSH2 0x3B6B JUMP JUMPDEST SWAP3 POP SWAP3 POP SWAP3 POP DUP3 DUP3 DUP3 DUP9 DUP9 DUP9 SWAP12 POP SWAP12 POP SWAP12 POP SWAP12 POP SWAP12 POP SWAP12 POP POP POP POP POP POP POP SWAP2 SWAP4 SWAP6 POP SWAP2 SWAP4 SWAP6 JUMP JUMPDEST PUSH1 0x0 PUSH2 0x3339 DUP4 DUP4 PUSH1 0x40 MLOAD DUP1 PUSH1 0x40 ADD PUSH1 0x40 MSTORE DUP1 PUSH1 0x1E DUP2 MSTORE PUSH1 0x20 ADD PUSH32 0x536166654D6174683A207375627472616374696F6E206F766572666C6F770000 DUP2 MSTORE POP PUSH2 0x30DE JUMP JUMPDEST SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 DUP4 EQ ISZERO PUSH2 0x3354 JUMPI PUSH1 0x0 SWAP1 POP PUSH2 0x33C1 JUMP JUMPDEST PUSH1 0x0 DUP3 DUP5 MUL SWAP1 POP DUP3 DUP5 DUP3 DUP2 PUSH2 0x3365 JUMPI INVALID JUMPDEST DIV EQ PUSH2 0x33BC JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x21 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH2 0x4CC9 PUSH1 0x21 SWAP2 CODECOPY PUSH1 0x40 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP1 SWAP2 POP POP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x1 PUSH1 0x13 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH1 0x0 PUSH2 0x33F8 PUSH1 0x2 DUP4 PUSH2 0x31C9 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST SWAP1 POP PUSH1 0x0 PUSH2 0x340F DUP3 DUP5 PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST SWAP1 POP PUSH1 0x0 SELFBALANCE SWAP1 POP PUSH2 0x341F DUP4 PUSH2 0x3BF4 JUMP JUMPDEST PUSH1 0x0 PUSH2 0x3434 DUP3 SELFBALANCE PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST SWAP1 POP PUSH2 0x3440 DUP4 DUP3 PUSH2 0x3EA2 JUMP JUMPDEST PUSH32 0x17BBFB9A6069321B6DED73BD96327C9E6B7212A5CD51FF219CD61370ACAFB561 DUP5 DUP3 DUP6 PUSH1 0x40 MLOAD DUP1 DUP5 DUP2 MSTORE PUSH1 0x20 ADD DUP4 DUP2 MSTORE PUSH1 0x20 ADD DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP4 POP POP POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG1 POP POP POP POP PUSH1 0x0 PUSH1 0x13 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP POP JUMP JUMPDEST DUP1 PUSH2 0x34B7 JUMPI PUSH2 0x34B6 PUSH2 0x3FF3 JUMP JUMPDEST JUMPDEST PUSH1 0x7 PUSH1 0x0 DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND DUP1 ISZERO PUSH2 0x355A JUMPI POP PUSH1 0x7 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND ISZERO JUMPDEST ISZERO PUSH2 0x356F JUMPI PUSH2 0x356A DUP5 DUP5 DUP5 PUSH2 0x4036 JUMP JUMPDEST PUSH2 0x37A6 JUMP JUMPDEST PUSH1 0x7 PUSH1 0x0 DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND ISZERO DUP1 ISZERO PUSH2 0x3612 JUMPI POP PUSH1 0x7 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND JUMPDEST ISZERO PUSH2 0x3627 JUMPI PUSH2 0x3622 DUP5 DUP5 DUP5 PUSH2 0x4296 JUMP JUMPDEST PUSH2 0x37A5 JUMP JUMPDEST PUSH1 0x7 PUSH1 0x0 DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND ISZERO DUP1 ISZERO PUSH2 0x36CB JUMPI POP PUSH1 0x7 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND ISZERO JUMPDEST ISZERO PUSH2 0x36E0 JUMPI PUSH2 0x36DB DUP5 DUP5 DUP5 PUSH2 0x44F6 JUMP JUMPDEST PUSH2 0x37A4 JUMP JUMPDEST PUSH1 0x7 PUSH1 0x0 DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND DUP1 ISZERO PUSH2 0x3782 JUMPI POP PUSH1 0x7 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND JUMPDEST ISZERO PUSH2 0x3797 JUMPI PUSH2 0x3792 DUP5 DUP5 DUP5 PUSH2 0x46C1 JUMP JUMPDEST PUSH2 0x37A3 JUMP JUMPDEST PUSH2 0x37A2 DUP5 DUP5 DUP5 PUSH2 0x44F6 JUMP JUMPDEST JUMPDEST JUMPDEST JUMPDEST JUMPDEST DUP1 PUSH2 0x37B4 JUMPI PUSH2 0x37B3 PUSH2 0x49B6 JUMP JUMPDEST JUMPDEST POP POP POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 PUSH1 0xA SLOAD SWAP1 POP PUSH1 0x0 PUSH1 0x9 SLOAD SWAP1 POP PUSH1 0x0 JUMPDEST PUSH1 0x8 DUP1 SLOAD SWAP1 POP DUP2 LT ISZERO PUSH2 0x3A0E JUMPI DUP3 PUSH1 0x3 PUSH1 0x0 PUSH1 0x8 DUP5 DUP2 SLOAD DUP2 LT PUSH2 0x37ED JUMPI INVALID JUMPDEST SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 ADD PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD GT DUP1 PUSH2 0x38D4 JUMPI POP DUP2 PUSH1 0x4 PUSH1 0x0 PUSH1 0x8 DUP5 DUP2 SLOAD DUP2 LT PUSH2 0x386C JUMPI INVALID JUMPDEST SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 ADD PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD GT JUMPDEST ISZERO PUSH2 0x38EB JUMPI PUSH1 0xA SLOAD PUSH1 0x9 SLOAD SWAP5 POP SWAP5 POP POP POP POP PUSH2 0x3A47 JUMP JUMPDEST PUSH2 0x3974 PUSH1 0x3 PUSH1 0x0 PUSH1 0x8 DUP5 DUP2 SLOAD DUP2 LT PUSH2 0x38FF JUMPI INVALID JUMPDEST SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 ADD PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD DUP5 PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST SWAP3 POP PUSH2 0x39FF PUSH1 0x4 PUSH1 0x0 PUSH1 0x8 DUP5 DUP2 SLOAD DUP2 LT PUSH2 0x398A JUMPI INVALID JUMPDEST SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 ADD PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD DUP4 PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST SWAP2 POP DUP1 DUP1 PUSH1 0x1 ADD SWAP2 POP POP PUSH2 0x37CE JUMP JUMPDEST POP PUSH2 0x3A26 PUSH1 0x9 SLOAD PUSH1 0xA SLOAD PUSH2 0x31C9 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST DUP3 LT ISZERO PUSH2 0x3A3E JUMPI PUSH1 0xA SLOAD PUSH1 0x9 SLOAD SWAP4 POP SWAP4 POP POP POP PUSH2 0x3A47 JUMP JUMPDEST DUP2 DUP2 SWAP4 POP SWAP4 POP POP POP JUMPDEST SWAP1 SWAP2 JUMP JUMPDEST PUSH1 0x0 DUP1 DUP4 GT DUP3 SWAP1 PUSH2 0x3AF7 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE DUP4 DUP2 DUP2 MLOAD DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 DUP1 DUP4 DUP4 PUSH1 0x0 JUMPDEST DUP4 DUP2 LT ISZERO PUSH2 0x3ABC JUMPI DUP1 DUP3 ADD MLOAD DUP2 DUP5 ADD MSTORE PUSH1 0x20 DUP2 ADD SWAP1 POP PUSH2 0x3AA1 JUMP JUMPDEST POP POP POP POP SWAP1 POP SWAP1 DUP2 ADD SWAP1 PUSH1 0x1F AND DUP1 ISZERO PUSH2 0x3AE9 JUMPI DUP1 DUP3 SUB DUP1 MLOAD PUSH1 0x1 DUP4 PUSH1 0x20 SUB PUSH2 0x100 EXP SUB NOT AND DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP JUMPDEST POP SWAP3 POP POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST POP PUSH1 0x0 DUP4 DUP6 DUP2 PUSH2 0x3B03 JUMPI INVALID JUMPDEST DIV SWAP1 POP DUP1 SWAP2 POP POP SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH2 0x3B20 DUP6 PUSH2 0x49CA JUMP JUMPDEST SWAP1 POP PUSH1 0x0 PUSH2 0x3B2D DUP7 PUSH2 0x49FB JUMP JUMPDEST SWAP1 POP PUSH1 0x0 PUSH2 0x3B56 DUP3 PUSH2 0x3B48 DUP6 DUP11 PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST SWAP1 POP DUP1 DUP4 DUP4 SWAP6 POP SWAP6 POP SWAP6 POP POP POP POP SWAP2 SWAP4 SWAP1 SWAP3 POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH2 0x3B84 DUP6 DUP10 PUSH2 0x3341 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST SWAP1 POP PUSH1 0x0 PUSH2 0x3B9B DUP7 DUP10 PUSH2 0x3341 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST SWAP1 POP PUSH1 0x0 PUSH2 0x3BB2 DUP8 DUP10 PUSH2 0x3341 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST SWAP1 POP PUSH1 0x0 PUSH2 0x3BDB DUP3 PUSH2 0x3BCD DUP6 DUP8 PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST SWAP1 POP DUP4 DUP2 DUP5 SWAP7 POP SWAP7 POP SWAP7 POP POP POP POP POP SWAP5 POP SWAP5 POP SWAP5 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x60 PUSH1 0x2 PUSH8 0xFFFFFFFFFFFFFFFF DUP2 GT DUP1 ISZERO PUSH2 0x3C0E JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x40 MLOAD SWAP1 DUP1 DUP3 MSTORE DUP1 PUSH1 0x20 MUL PUSH1 0x20 ADD DUP3 ADD PUSH1 0x40 MSTORE DUP1 ISZERO PUSH2 0x3C3D JUMPI DUP2 PUSH1 0x20 ADD PUSH1 0x20 DUP3 MUL DUP1 CALLDATASIZE DUP4 CALLDATACOPY DUP1 DUP3 ADD SWAP2 POP POP SWAP1 POP JUMPDEST POP SWAP1 POP ADDRESS DUP2 PUSH1 0x0 DUP2 MLOAD DUP2 LT PUSH2 0x3C4E JUMPI INVALID JUMPDEST PUSH1 0x20 MUL PUSH1 0x20 ADD ADD SWAP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE POP POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0xAD5C4648 PUSH1 0x40 MLOAD DUP2 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP7 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x3CEE JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS STATICCALL ISZERO DUP1 ISZERO PUSH2 0x3D02 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x20 DUP2 LT ISZERO PUSH2 0x3D18 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP DUP2 PUSH1 0x1 DUP2 MLOAD DUP2 LT PUSH2 0x3D36 JUMPI INVALID JUMPDEST PUSH1 0x20 MUL PUSH1 0x20 ADD ADD SWAP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE POP POP PUSH2 0x3D9B ADDRESS PUSH32 0x0 DUP5 PUSH2 0x2B22 JUMP JUMPDEST PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x791AC947 DUP4 PUSH1 0x0 DUP5 ADDRESS TIMESTAMP PUSH1 0x40 MLOAD DUP7 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP7 DUP2 MSTORE PUSH1 0x20 ADD DUP6 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH1 0x20 ADD DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD DUP4 DUP2 MSTORE PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE DUP6 DUP2 DUP2 MLOAD DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 PUSH1 0x20 MUL DUP1 DUP4 DUP4 PUSH1 0x0 JUMPDEST DUP4 DUP2 LT ISZERO PUSH2 0x3E5D JUMPI DUP1 DUP3 ADD MLOAD DUP2 DUP5 ADD MSTORE PUSH1 0x20 DUP2 ADD SWAP1 POP PUSH2 0x3E42 JUMP JUMPDEST POP POP POP POP SWAP1 POP ADD SWAP7 POP POP POP POP POP POP POP PUSH1 0x0 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x3E86 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x3E9A JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP POP POP JUMP JUMPDEST PUSH2 0x3ECD ADDRESS PUSH32 0x0 DUP5 PUSH2 0x2B22 JUMP JUMPDEST PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0xF305D719 DUP3 ADDRESS DUP6 PUSH1 0x0 DUP1 PUSH2 0x3F17 PUSH2 0x1EAE JUMP JUMPDEST TIMESTAMP PUSH1 0x40 MLOAD DUP9 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP8 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD DUP7 DUP2 MSTORE PUSH1 0x20 ADD DUP6 DUP2 MSTORE PUSH1 0x20 ADD DUP5 DUP2 MSTORE PUSH1 0x20 ADD DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP7 POP POP POP POP POP POP POP PUSH1 0x60 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP9 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x3F9C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x3FB0 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x60 DUP2 LT ISZERO PUSH2 0x3FC7 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP POP POP POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0xF SLOAD EQ DUP1 ISZERO PUSH2 0x4007 JUMPI POP PUSH1 0x0 PUSH1 0x11 SLOAD EQ JUMPDEST ISZERO PUSH2 0x4011 JUMPI PUSH2 0x4034 JUMP JUMPDEST PUSH1 0xF SLOAD PUSH1 0x10 DUP2 SWAP1 SSTORE POP PUSH1 0x11 SLOAD PUSH1 0x12 DUP2 SWAP1 SSTORE POP PUSH1 0x0 PUSH1 0xF DUP2 SWAP1 SSTORE POP PUSH1 0x0 PUSH1 0x11 DUP2 SWAP1 SSTORE POP JUMPDEST JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH2 0x4048 DUP8 PUSH2 0x329B JUMP JUMPDEST SWAP6 POP SWAP6 POP SWAP6 POP SWAP6 POP SWAP6 POP SWAP6 POP PUSH2 0x40A6 DUP8 PUSH1 0x4 PUSH1 0x0 DUP13 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0x4 PUSH1 0x0 DUP12 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH2 0x413B DUP7 PUSH1 0x3 PUSH1 0x0 DUP13 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0x3 PUSH1 0x0 DUP12 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH2 0x41D0 DUP6 PUSH1 0x3 PUSH1 0x0 DUP12 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x3213 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0x3 PUSH1 0x0 DUP11 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH2 0x421C DUP2 PUSH2 0x4A2C JUMP JUMPDEST PUSH2 0x4226 DUP5 DUP4 PUSH2 0x4BD1 JUMP JUMPDEST DUP8 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP10 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0xDDF252AD1BE2C89B69C2B068FC378DAA952BA7F163C4A11628F55A4DF523B3EF DUP6 PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP POP POP POP POP POP POP POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH2 0x42A8 DUP8 PUSH2 0x329B JUMP JUMPDEST SWAP6 POP SWAP6 POP SWAP6 POP SWAP6 POP SWAP6 POP SWAP6 POP PUSH2 0x4306 DUP7 PUSH1 0x3 PUSH1 0x0 DUP13 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0x3 PUSH1 0x0 DUP12 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH2 0x439B DUP4 PUSH1 0x4 PUSH1 0x0 DUP12 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x3213 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0x4 PUSH1 0x0 DUP11 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH2 0x4430 DUP6 PUSH1 0x3 PUSH1 0x0 DUP12 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x3213 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0x3 PUSH1 0x0 DUP11 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH2 0x447C DUP2 PUSH2 0x4A2C JUMP JUMPDEST PUSH2 0x4486 DUP5 DUP4 PUSH2 0x4BD1 JUMP JUMPDEST DUP8 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP10 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0xDDF252AD1BE2C89B69C2B068FC378DAA952BA7F163C4A11628F55A4DF523B3EF DUP6 PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP POP POP POP POP POP POP POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH2 0x4508 DUP8 PUSH2 0x329B JUMP JUMPDEST SWAP6 POP SWAP6 POP SWAP6 POP SWAP6 POP SWAP6 POP SWAP6 POP PUSH2 0x4566 DUP7 PUSH1 0x3 PUSH1 0x0 DUP13 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0x3 PUSH1 0x0 DUP12 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH2 0x45FB DUP6 PUSH1 0x3 PUSH1 0x0 DUP12 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x3213 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0x3 PUSH1 0x0 DUP11 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH2 0x4647 DUP2 PUSH2 0x4A2C JUMP JUMPDEST PUSH2 0x4651 DUP5 DUP4 PUSH2 0x4BD1 JUMP JUMPDEST DUP8 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP10 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0xDDF252AD1BE2C89B69C2B068FC378DAA952BA7F163C4A11628F55A4DF523B3EF DUP6 PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP POP POP POP POP POP POP POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH2 0x46D3 DUP8 PUSH2 0x329B JUMP JUMPDEST SWAP6 POP SWAP6 POP SWAP6 POP SWAP6 POP SWAP6 POP SWAP6 POP PUSH2 0x4731 DUP8 PUSH1 0x4 PUSH1 0x0 DUP13 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0x4 PUSH1 0x0 DUP12 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH2 0x47C6 DUP7 PUSH1 0x3 PUSH1 0x0 DUP13 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0x3 PUSH1 0x0 DUP12 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH2 0x485B DUP4 PUSH1 0x4 PUSH1 0x0 DUP12 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x3213 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0x4 PUSH1 0x0 DUP11 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH2 0x48F0 DUP6 PUSH1 0x3 PUSH1 0x0 DUP12 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x3213 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0x3 PUSH1 0x0 DUP11 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH2 0x493C DUP2 PUSH2 0x4A2C JUMP JUMPDEST PUSH2 0x4946 DUP5 DUP4 PUSH2 0x4BD1 JUMP JUMPDEST DUP8 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP10 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0xDDF252AD1BE2C89B69C2B068FC378DAA952BA7F163C4A11628F55A4DF523B3EF DUP6 PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP POP POP POP POP POP POP POP POP JUMP JUMPDEST PUSH1 0x10 SLOAD PUSH1 0xF DUP2 SWAP1 SSTORE POP PUSH1 0x12 SLOAD PUSH1 0x11 DUP2 SWAP1 SSTORE POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x49F4 PUSH1 0x64 PUSH2 0x49E6 PUSH1 0xF SLOAD DUP6 PUSH2 0x3341 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH2 0x31C9 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x4A25 PUSH1 0x64 PUSH2 0x4A17 PUSH1 0x11 SLOAD DUP6 PUSH2 0x3341 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH2 0x31C9 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x4A36 PUSH2 0x319E JUMP JUMPDEST SWAP1 POP PUSH1 0x0 PUSH2 0x4A4D DUP3 DUP5 PUSH2 0x3341 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST SWAP1 POP PUSH2 0x4AA1 DUP2 PUSH1 0x3 PUSH1 0x0 ADDRESS PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x3213 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0x3 PUSH1 0x0 ADDRESS PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH1 0x7 PUSH1 0x0 ADDRESS PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND ISZERO PUSH2 0x4BCC JUMPI PUSH2 0x4B88 DUP4 PUSH1 0x4 PUSH1 0x0 ADDRESS PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x3213 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0x4 PUSH1 0x0 ADDRESS PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP JUMPDEST POP POP POP JUMP JUMPDEST PUSH2 0x4BE6 DUP3 PUSH1 0xA SLOAD PUSH2 0x32F7 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0xA DUP2 SWAP1 SSTORE POP PUSH2 0x4C01 DUP2 PUSH1 0xB SLOAD PUSH2 0x3213 SWAP1 SWAP2 SWAP1 PUSH4 0xFFFFFFFF AND JUMP JUMPDEST PUSH1 0xB DUP2 SWAP1 SSTORE POP POP POP JUMP INVALID GASLIMIT MSTORE NUMBER ORIGIN ADDRESS GASPRICE KECCAK256 PUSH21 0x72616E7366657220746F20746865207A65726F2061 PUSH5 0x6472657373 COINBASE PUSH14 0x6F756E74206D757374206265206C PUSH6 0x737320746861 PUSH15 0x20746F74616C207265666C65637469 PUSH16 0x6E734F776E61626C653A206E6577206F PUSH24 0x6E657220697320746865207A65726F206164647265737345 MSTORE NUMBER ORIGIN ADDRESS GASPRICE KECCAK256 PUSH2 0x7070 PUSH19 0x6F766520746F20746865207A65726F20616464 PUSH19 0x6573735472616E7366657220616D6F756E7420 PUSH6 0x786365656473 KECCAK256 PUSH21 0x6865206D61785478416D6F756E742E536166654D61 PUSH21 0x683A206D756C7469706C69636174696F6E206F7665 PUSH19 0x666C6F7745524332303A207472616E73666572 KECCAK256 PUSH2 0x6D6F PUSH22 0x6E74206578636565647320616C6C6F77616E63655472 PUSH2 0x6E73 PUSH7 0x657220616D6F75 PUSH15 0x74206D757374206265206772656174 PUSH6 0x72207468616E KECCAK256 PUSH27 0x65726F45524332303A207472616E736665722066726F6D20746865 KECCAK256 PUSH27 0x65726F206164647265737345524332303A20617070726F76652066 PUSH19 0x6F6D20746865207A65726F2061646472657373 GASLIMIT PUSH25 0x636C75646564206164647265737365732063616E6E6F742063 PUSH2 0x6C6C KECCAK256 PUSH21 0x6869732066756E6374696F6E596F7520646F6E2774 KECCAK256 PUSH9 0x617665207065726D69 PUSH20 0x73696F6E20746F20756E6C6F636B45524332303A KECCAK256 PUSH5 0x6563726561 PUSH20 0x656420616C6C6F77616E63652062656C6F77207A PUSH6 0x726FA2646970 PUSH7 0x7358221220F468 PUSH14 0x1AC1672734DE3C1681FB07FA7167 0xB2 PUSH10 0xF44CC3674E970B7BC77D ORIGIN 0xEA 0xD PUSH5 0x736F6C6343 STOP MOD 0xC STOP CALLER ",
        "sourceMap": "25002:17891:0:-:0;;;25515:17;25489:43;;25578:7;;25481:1;25472:11;25572:13;;;;;;25481:1;25472:11;25565:21;25538:49;;25626:40;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;25672:36;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;25740:1;25714:27;;;;;;;;;;;;;;;;;;;;25777:1;25752:26;;25818:7;;25784:41;;25867:1;25836:32;;25914:13;;25874:53;;26103:4;26067:40;;;;;;;;;;;;;;;;;;;;26148:17;26118:47;;26219:17;26171:65;;26617:693;;;;;;;;;;15022:17;15042:12;:10;;;:12;;:::i;:::-;15022:32;;15073:9;15064:6;;:18;;;;;;;;;;;;;;;;;;15130:9;15097:43;;15126:1;15097:43;;;;;;;;;;;;14988:159;26673:7;;26649;:21;26657:12;:10;;;:12;;:::i;:::-;26649:21;;;;;;;;;;;;;;;:31;;;;26699:35;26756:42;26699:100;;26896:16;:24;;;:26;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;26878:69;;;26956:4;26963:16;:21;;;:23;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;26878:109;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;26862:125;;;;;;;;;;;;27066:16;27048:34;;;;;;;;;;;;27182:4;27152:18;:27;27171:7;:5;;;:7;;:::i;:::-;27152:27;;;;;;;;;;;;;;;;:34;;;;;;;;;;;;;;;;;;27232:4;27196:18;:33;27223:4;27196:33;;;;;;;;;;;;;;;;:40;;;;;;;;;;;;;;;;;;27281:12;:10;;;:12;;:::i;:::-;27260:43;;27277:1;27260:43;;;27295:7;;27260:43;;;;;;;;;;;;;;;;;;26617:693;25002:17891;;7811:104;7864:15;7898:10;7891:17;;7811:104;:::o;15223:77::-;15261:7;15287:6;;;;;;;;;;;15280:13;;15223:77;:::o;25002:17891::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;"
    }
  
  // The factory we use for deploying contracts
  let factory = new ethers.ContractFactory(abi, bytecode, signer)
  
  // Deploy an instance of the contract
  let contract = await factory.deploy();
  
  // The address is available immediately, but the contract
  // is NOT deployed yet
  console.log(contract.address)

  const receipt = await contract.deployTransaction.wait()
  console.log("Status: ",receipt["status"])
  console.log("Hash: ",receipt["transactionHash"])

  document.querySelector("#token_deployed_address").textContent = contract.address;
  
}
