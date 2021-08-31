

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
        const balance = await AnyTokenContract.balanceOf(await signer.getAddress()) 
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
    console.log("START PRESALE CONTRACT DEPLOYMENT...")
    //bnb = ethers.utils.parseEther( bnb_ )

    const abi = [
        {
            "inputs": [],
            "name": "claimTokens",
            "outputs": [],
            "stateMutability": "nonpayable",
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
            "name": "EmergencyWithdraw",
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
        "object": "6101206040526000600360006101000a81548160ff0219169083151502179055506000600360016101000a81548160ff02191690831515021790555060006006553480156200004d57600080fd5b50604051620025dc380380620025dc833981810160405281019062000073919062000186565b8360a081815250508260c081815250508160e081815250508073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff1660601b8152505073d99d1c33f9fc3444f8101754abc46c52416550d173ffffffffffffffffffffffffffffffffffffffff166101008173ffffffffffffffffffffffffffffffffffffffff1660601b81525050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505062000264565b600081519050620001698162000230565b92915050565b60008151905062000180816200024a565b92915050565b600080600080608085870312156200019d57600080fd5b6000620001ad878288016200016f565b9450506020620001c0878288016200016f565b9350506040620001d3878288016200016f565b9250506060620001e68782880162000158565b91505092959194509250565b6000620001ff8262000206565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6200023b81620001f2565b81146200024757600080fd5b50565b620002558162000226565b81146200026157600080fd5b50565b60805160601c60a05160c05160e0516101005160601c6122af6200032d600039600081816107730152818161177401526118060152600081816107990152611154015260008181610aa501526110f101526000818161071b015281816108400152818161122001526112880152600081816105b7015281816106650152818161074d0152818161089a0152818161094801528181610acb01528181610bbe01528181610c9401528181610d9801528181610e4601528181611738015261184301526122af6000f3fe6080604052600436106101815760003560e01c80634b0b945e116100d15780639136a5ec1161008a578063cc6a1a0611610064578063cc6a1a0614610552578063d0e30db014610569578063d33aa8e514610573578063e76630791461058a57610181565b80639136a5ec146104d357806392ab244214610510578063b0b9603b1461052757610181565b80634b0b945e146103d55780634bb278f314610400578063517311ea14610417578063521886b3146104425780638aeb87071461046b5780638da5cb5b146104a857610181565b80634123fec71161013e578063440e1e6911610118578063440e1e691461031957806347535d7b1461035657806348c54b9d14610381578063490035511461039857610181565b80634123fec71461028657806342e94c90146102b157806343248084146102ee57610181565b806305ab421d1461018657806307fb363a146101af5780630d056513146101da57806310051089146102055780631694505e146102305780631e377df01461025b575b600080fd5b34801561019257600080fd5b506101ad60048036038101906101a891906119bc565b6105b5565b005b3480156101bb57600080fd5b506101c4610717565b6040516101d19190611e55565b60405180910390f35b3480156101e657600080fd5b506101ef61073f565b6040516101fc9190611e55565b60405180910390f35b34801561021157600080fd5b5061021a610749565b6040516102279190611c3a565b60405180910390f35b34801561023c57600080fd5b50610245610771565b6040516102529190611d5a565b60405180910390f35b34801561026757600080fd5b50610270610795565b60405161027d9190611e55565b60405180910390f35b34801561029257600080fd5b5061029b6107bd565b6040516102a89190611e55565b60405180910390f35b3480156102bd57600080fd5b506102d860048036038101906102d39190611993565b6107c3565b6040516102e59190611e55565b60405180910390f35b3480156102fa57600080fd5b506103036107db565b6040516103109190611d3f565b60405180910390f35b34801561032557600080fd5b50610340600480360381019061033b9190611993565b6107f2565b60405161034d9190611e55565b60405180910390f35b34801561036257600080fd5b5061036b610874565b6040516103789190611d3f565b60405180910390f35b34801561038d57600080fd5b5061039661088b565b005b3480156103a457600080fd5b506103bf60048036038101906103ba9190611993565b610a3e565b6040516103cc9190611e55565b60405180910390f35b3480156103e157600080fd5b506103ea610a87565b6040516103f79190611e55565b60405180910390f35b34801561040c57600080fd5b50610415610a91565b005b34801561042357600080fd5b5061042c610aa1565b6040516104399190611e55565b60405180910390f35b34801561044e57600080fd5b5061046960048036038101906104649190611a21565b610ac9565b005b34801561047757600080fd5b50610492600480360381019061048d9190611993565b610bba565b60405161049f9190611e55565b60405180910390f35b3480156104b457600080fd5b506104bd610c6c565b6040516104ca9190611c3a565b60405180910390f35b3480156104df57600080fd5b506104fa60048036038101906104f59190611993565b610c90565b6040516105079190611e55565b60405180910390f35b34801561051c57600080fd5b50610525610d44565b005b34801561053357600080fd5b5061053c610f85565b6040516105499190611e55565b60405180910390f35b34801561055e57600080fd5b50610567610f8b565b005b6105716110ef565b005b34801561057f57600080fd5b50610588611458565b005b34801561059657600080fd5b5061059f6116e1565b6040516105ac9190611c3a565b60405180910390f35b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663095ea7b330836040518363ffffffff1660e01b8152600401610610929190611cb5565b602060405180830381600087803b15801561062a57600080fd5b505af115801561063e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061066291906119f8565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd3084846040518463ffffffff1660e01b81526004016106c093929190611c7e565b602060405180830381600087803b1580156106da57600080fd5b505af11580156106ee573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061071291906119f8565b505050565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b6000600454905090565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b7f000000000000000000000000000000000000000000000000000000000000000081565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b60045481565b60076020528060005260406000206000915090505481565b6000600360009054906101000a900460ff16905090565b600080610869600760008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546108646005547f000000000000000000000000000000000000000000000000000000000000000061170a565b611720565b905080915050919050565b6000600360019054906101000a900460ff16905090565b6000610896336107f2565b90507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663095ea7b330836040518363ffffffff1660e01b81526004016108f3929190611cb5565b602060405180830381600087803b15801561090d57600080fd5b505af1158015610921573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061094591906119f8565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd3033846040518463ffffffff1660e01b81526004016109a393929190611c7e565b602060405180830381600087803b1580156109bd57600080fd5b505af11580156109d1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109f591906119f8565b506000600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555050565b6000600760008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6000600254905090565b610a9f600454600254611736565b565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd3330846040518463ffffffff1660e01b8152600401610b2693929190611c7e565b602060405180830381600087803b158015610b4057600080fd5b505af1158015610b54573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b7891906119f8565b506001600360016101000a81548160ff021916908315150217905550610b9f81600261170a565b600481905550610bb181600454611902565b60058190555050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231836040518263ffffffff1660e01b8152600401610c159190611c3a565b60206040518083038186803b158015610c2d57600080fd5b505afa158015610c41573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c659190611a4a565b9050919050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e83306040518363ffffffff1660e01b8152600401610ced929190611c55565b60206040518083038186803b158015610d0557600080fd5b505afa158015610d19573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d3d9190611a4a565b9050919050565b60005b600654811015610f825760006008600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506000610d94826107f2565b90507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663095ea7b330836040518363ffffffff1660e01b8152600401610df1929190611cb5565b602060405180830381600087803b158015610e0b57600080fd5b505af1158015610e1f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e4391906119f8565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd3084846040518463ffffffff1660e01b8152600401610ea193929190611c7e565b602060405180830381600087803b158015610ebb57600080fd5b505af1158015610ecf573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ef391906119f8565b506008600084815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600760008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000905550508080610f7a9061201f565b915050610d47565b50565b60055481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611019576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161101090611db5565b60405180910390fd5b600047905060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168260405161106590611c25565b60006040518083038185875af1925050503d80600081146110a2576040519150601f19603f3d011682016040523d82523d6000602084013e6110a7565b606091505b50509050806110eb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110e290611d75565b60405180910390fd5b5050565b7f0000000000000000000000000000000000000000000000000000000000000000341015611152576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161114990611e35565b60405180910390fd5b7f00000000000000000000000000000000000000000000000000000000000000003411156111b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111ac90611dd5565b60405180910390fd5b600360009054906101000a900460ff1615611205576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111fc90611d95565b60405180910390fd5b34600260008282546112179190611e8c565b925050819055507f00000000000000000000000000000000000000000000000000000000000000006002541115611283576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161127a90611e15565b60405180910390fd5b6112ac7f0000000000000000000000000000000000000000000000000000000000000000611918565b600254106112d0576001600360006101000a81548160ff0219169083151502179055505b6000805b60065481101561135d573373ffffffffffffffffffffffffffffffffffffffff166008600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141561134a57600191505b80806113559061201f565b9150506112d4565b5060001515811515146113a5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161139c90611df5565b60405180910390fd5b3360086000600654815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600660008154809291906114509061201f565b919050555050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146114e6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114dd90611db5565b60405180910390fd5b60005b6006548110156116c35760006008600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506000600760008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905060008273ffffffffffffffffffffffffffffffffffffffff168260405161159590611c25565b60006040518083038185875af1925050503d80600081146115d2576040519150601f19603f3d011682016040523d82523d6000602084013e6115d7565b606091505b505090508061161b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161161290611d75565b60405180910390fd5b816002600082825461162d9190611f6d565b925050819055506008600085815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000905550505080806116bb9061201f565b9150506114e9565b506000600360006101000a81548160ff021916908315150217905550565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600081836117189190611ee2565b905092915050565b6000818361172e9190611f13565b905092915050565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663095ea7b37f0000000000000000000000000000000000000000000000000000000000000000846040518363ffffffff1660e01b81526004016117b1929190611cb5565b602060405180830381600087803b1580156117cb57600080fd5b505af11580156117df573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061180391906119f8565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663f305d719827f00000000000000000000000000000000000000000000000000000000000000008560008060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff16426040518863ffffffff1660e01b81526004016118a996959493929190611cde565b6060604051808303818588803b1580156118c257600080fd5b505af11580156118d6573d6000803e3d6000fd5b50505050506040513d601f19601f820116820180604052508101906118fb9190611a73565b5050505050565b600081836119109190611f6d565b905092915050565b600080606483606361192a9190611f13565b6119349190611ee2565b905080915050919050565b60008135905061194e81612234565b92915050565b6000815190506119638161224b565b92915050565b60008135905061197881612262565b92915050565b60008151905061198d81612262565b92915050565b6000602082840312156119a557600080fd5b60006119b38482850161193f565b91505092915050565b600080604083850312156119cf57600080fd5b60006119dd8582860161193f565b92505060206119ee85828601611969565b9150509250929050565b600060208284031215611a0a57600080fd5b6000611a1884828501611954565b91505092915050565b600060208284031215611a3357600080fd5b6000611a4184828501611969565b91505092915050565b600060208284031215611a5c57600080fd5b6000611a6a8482850161197e565b91505092915050565b600080600060608486031215611a8857600080fd5b6000611a968682870161197e565b9350506020611aa78682870161197e565b9250506040611ab88682870161197e565b9150509250925092565b611acb81611fa1565b82525050565b611ada81611fb3565b82525050565b611ae981611fe9565b82525050565b611af88161200d565b82525050565b6000611b0b601483611e7b565b9150611b16826120c6565b602082019050919050565b6000611b2e601683611e7b565b9150611b39826120ef565b602082019050919050565b6000611b51600983611e7b565b9150611b5c82612118565b602082019050919050565b6000611b74600083611e70565b9150611b7f82612141565b600082019050919050565b6000611b97601883611e7b565b9150611ba282612144565b602082019050919050565b6000611bba602b83611e7b565b9150611bc58261216d565b604082019050919050565b6000611bdd602783611e7b565b9150611be8826121bc565b604082019050919050565b6000611c00601a83611e7b565b9150611c0b8261220b565b602082019050919050565b611c1f81611fdf565b82525050565b6000611c3082611b67565b9150819050919050565b6000602082019050611c4f6000830184611ac2565b92915050565b6000604082019050611c6a6000830185611ac2565b611c776020830184611ac2565b9392505050565b6000606082019050611c936000830186611ac2565b611ca06020830185611ac2565b611cad6040830184611c16565b949350505050565b6000604082019050611cca6000830185611ac2565b611cd76020830184611c16565b9392505050565b600060c082019050611cf36000830189611ac2565b611d006020830188611c16565b611d0d6040830187611aef565b611d1a6060830186611aef565b611d276080830185611ac2565b611d3460a0830184611c16565b979650505050505050565b6000602082019050611d546000830184611ad1565b92915050565b6000602082019050611d6f6000830184611ae0565b92915050565b60006020820190508181036000830152611d8e81611afe565b9050919050565b60006020820190508181036000830152611dae81611b21565b9050919050565b60006020820190508181036000830152611dce81611b44565b9050919050565b60006020820190508181036000830152611dee81611b8a565b9050919050565b60006020820190508181036000830152611e0e81611bad565b9050919050565b60006020820190508181036000830152611e2e81611bd0565b9050919050565b60006020820190508181036000830152611e4e81611bf3565b9050919050565b6000602082019050611e6a6000830184611c16565b92915050565b600081905092915050565b600082825260208201905092915050565b6000611e9782611fdf565b9150611ea283611fdf565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115611ed757611ed6612068565b5b828201905092915050565b6000611eed82611fdf565b9150611ef883611fdf565b925082611f0857611f07612097565b5b828204905092915050565b6000611f1e82611fdf565b9150611f2983611fdf565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615611f6257611f61612068565b5b828202905092915050565b6000611f7882611fdf565b9150611f8383611fdf565b925082821015611f9657611f95612068565b5b828203905092915050565b6000611fac82611fbf565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6000611ff482611ffb565b9050919050565b600061200682611fbf565b9050919050565b600061201882611fdf565b9050919050565b600061202a82611fdf565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561205d5761205c612068565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4661696c656420746f2073656e64204574686572000000000000000000000000600082015250565b7f43617020697320616c7265616479207265616368656400000000000000000000600082015250565b7f4e6f74206f776e65720000000000000000000000000000000000000000000000600082015250565b50565b7f4465706f7369742056616c756520697320546f6f204269670000000000000000600082015250565b7f596f75206861766520616c726561647920636f6e747269627574656420746f2060008201527f7468652070726573616c65000000000000000000000000000000000000000000602082015250565b7f52657665727465643a20424e42206465706f73697420776f756c6420676f206f60008201527f7665722063617000000000000000000000000000000000000000000000000000602082015250565b7f4465706f7369742056616c756520697320546f6f20536d616c6c000000000000600082015250565b61223d81611fa1565b811461224857600080fd5b50565b61225481611fb3565b811461225f57600080fd5b50565b61226b81611fdf565b811461227657600080fd5b5056fea2646970667358221220933f762d1d9d93a4033c07371249870670d73dece0ad782563a18b27a5679e4664736f6c63430008030033",
        "opcodes": "PUSH2 0x120 PUSH1 0x40 MSTORE PUSH1 0x0 PUSH1 0x3 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH1 0x0 PUSH1 0x3 PUSH1 0x1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH1 0x0 PUSH1 0x6 SSTORE CALLVALUE DUP1 ISZERO PUSH3 0x4D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x40 MLOAD PUSH3 0x25DC CODESIZE SUB DUP1 PUSH3 0x25DC DUP4 CODECOPY DUP2 DUP2 ADD PUSH1 0x40 MSTORE DUP2 ADD SWAP1 PUSH3 0x73 SWAP2 SWAP1 PUSH3 0x186 JUMP JUMPDEST DUP4 PUSH1 0xA0 DUP2 DUP2 MSTORE POP POP DUP3 PUSH1 0xC0 DUP2 DUP2 MSTORE POP POP DUP2 PUSH1 0xE0 DUP2 DUP2 MSTORE POP POP DUP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x80 DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x60 SHL DUP2 MSTORE POP POP PUSH20 0xD99D1C33F9FC3444F8101754ABC46C52416550D1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH2 0x100 DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x60 SHL DUP2 MSTORE POP POP CALLER PUSH1 0x0 DUP1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP POP POP POP POP PUSH3 0x264 JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH3 0x169 DUP2 PUSH3 0x230 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH3 0x180 DUP2 PUSH3 0x24A JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH1 0x80 DUP6 DUP8 SUB SLT ISZERO PUSH3 0x19D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH3 0x1AD DUP8 DUP3 DUP9 ADD PUSH3 0x16F JUMP JUMPDEST SWAP5 POP POP PUSH1 0x20 PUSH3 0x1C0 DUP8 DUP3 DUP9 ADD PUSH3 0x16F JUMP JUMPDEST SWAP4 POP POP PUSH1 0x40 PUSH3 0x1D3 DUP8 DUP3 DUP9 ADD PUSH3 0x16F JUMP JUMPDEST SWAP3 POP POP PUSH1 0x60 PUSH3 0x1E6 DUP8 DUP3 DUP9 ADD PUSH3 0x158 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP6 SWAP2 SWAP5 POP SWAP3 POP JUMP JUMPDEST PUSH1 0x0 PUSH3 0x1FF DUP3 PUSH3 0x206 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH3 0x23B DUP2 PUSH3 0x1F2 JUMP JUMPDEST DUP2 EQ PUSH3 0x247 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH3 0x255 DUP2 PUSH3 0x226 JUMP JUMPDEST DUP2 EQ PUSH3 0x261 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH1 0x80 MLOAD PUSH1 0x60 SHR PUSH1 0xA0 MLOAD PUSH1 0xC0 MLOAD PUSH1 0xE0 MLOAD PUSH2 0x100 MLOAD PUSH1 0x60 SHR PUSH2 0x22AF PUSH3 0x32D PUSH1 0x0 CODECOPY PUSH1 0x0 DUP2 DUP2 PUSH2 0x773 ADD MSTORE DUP2 DUP2 PUSH2 0x1774 ADD MSTORE PUSH2 0x1806 ADD MSTORE PUSH1 0x0 DUP2 DUP2 PUSH2 0x799 ADD MSTORE PUSH2 0x1154 ADD MSTORE PUSH1 0x0 DUP2 DUP2 PUSH2 0xAA5 ADD MSTORE PUSH2 0x10F1 ADD MSTORE PUSH1 0x0 DUP2 DUP2 PUSH2 0x71B ADD MSTORE DUP2 DUP2 PUSH2 0x840 ADD MSTORE DUP2 DUP2 PUSH2 0x1220 ADD MSTORE PUSH2 0x1288 ADD MSTORE PUSH1 0x0 DUP2 DUP2 PUSH2 0x5B7 ADD MSTORE DUP2 DUP2 PUSH2 0x665 ADD MSTORE DUP2 DUP2 PUSH2 0x74D ADD MSTORE DUP2 DUP2 PUSH2 0x89A ADD MSTORE DUP2 DUP2 PUSH2 0x948 ADD MSTORE DUP2 DUP2 PUSH2 0xACB ADD MSTORE DUP2 DUP2 PUSH2 0xBBE ADD MSTORE DUP2 DUP2 PUSH2 0xC94 ADD MSTORE DUP2 DUP2 PUSH2 0xD98 ADD MSTORE DUP2 DUP2 PUSH2 0xE46 ADD MSTORE DUP2 DUP2 PUSH2 0x1738 ADD MSTORE PUSH2 0x1843 ADD MSTORE PUSH2 0x22AF PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE PUSH1 0x4 CALLDATASIZE LT PUSH2 0x181 JUMPI PUSH1 0x0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0x4B0B945E GT PUSH2 0xD1 JUMPI DUP1 PUSH4 0x9136A5EC GT PUSH2 0x8A JUMPI DUP1 PUSH4 0xCC6A1A06 GT PUSH2 0x64 JUMPI DUP1 PUSH4 0xCC6A1A06 EQ PUSH2 0x552 JUMPI DUP1 PUSH4 0xD0E30DB0 EQ PUSH2 0x569 JUMPI DUP1 PUSH4 0xD33AA8E5 EQ PUSH2 0x573 JUMPI DUP1 PUSH4 0xE7663079 EQ PUSH2 0x58A JUMPI PUSH2 0x181 JUMP JUMPDEST DUP1 PUSH4 0x9136A5EC EQ PUSH2 0x4D3 JUMPI DUP1 PUSH4 0x92AB2442 EQ PUSH2 0x510 JUMPI DUP1 PUSH4 0xB0B9603B EQ PUSH2 0x527 JUMPI PUSH2 0x181 JUMP JUMPDEST DUP1 PUSH4 0x4B0B945E EQ PUSH2 0x3D5 JUMPI DUP1 PUSH4 0x4BB278F3 EQ PUSH2 0x400 JUMPI DUP1 PUSH4 0x517311EA EQ PUSH2 0x417 JUMPI DUP1 PUSH4 0x521886B3 EQ PUSH2 0x442 JUMPI DUP1 PUSH4 0x8AEB8707 EQ PUSH2 0x46B JUMPI DUP1 PUSH4 0x8DA5CB5B EQ PUSH2 0x4A8 JUMPI PUSH2 0x181 JUMP JUMPDEST DUP1 PUSH4 0x4123FEC7 GT PUSH2 0x13E JUMPI DUP1 PUSH4 0x440E1E69 GT PUSH2 0x118 JUMPI DUP1 PUSH4 0x440E1E69 EQ PUSH2 0x319 JUMPI DUP1 PUSH4 0x47535D7B EQ PUSH2 0x356 JUMPI DUP1 PUSH4 0x48C54B9D EQ PUSH2 0x381 JUMPI DUP1 PUSH4 0x49003551 EQ PUSH2 0x398 JUMPI PUSH2 0x181 JUMP JUMPDEST DUP1 PUSH4 0x4123FEC7 EQ PUSH2 0x286 JUMPI DUP1 PUSH4 0x42E94C90 EQ PUSH2 0x2B1 JUMPI DUP1 PUSH4 0x43248084 EQ PUSH2 0x2EE JUMPI PUSH2 0x181 JUMP JUMPDEST DUP1 PUSH4 0x5AB421D EQ PUSH2 0x186 JUMPI DUP1 PUSH4 0x7FB363A EQ PUSH2 0x1AF JUMPI DUP1 PUSH4 0xD056513 EQ PUSH2 0x1DA JUMPI DUP1 PUSH4 0x10051089 EQ PUSH2 0x205 JUMPI DUP1 PUSH4 0x1694505E EQ PUSH2 0x230 JUMPI DUP1 PUSH4 0x1E377DF0 EQ PUSH2 0x25B JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x192 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x1AD PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x1A8 SWAP2 SWAP1 PUSH2 0x19BC JUMP JUMPDEST PUSH2 0x5B5 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x1BB JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x1C4 PUSH2 0x717 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x1D1 SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x1E6 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x1EF PUSH2 0x73F JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x1FC SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x211 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x21A PUSH2 0x749 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x227 SWAP2 SWAP1 PUSH2 0x1C3A JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x23C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x245 PUSH2 0x771 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x252 SWAP2 SWAP1 PUSH2 0x1D5A JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x267 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x270 PUSH2 0x795 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x27D SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x292 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x29B PUSH2 0x7BD JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x2A8 SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x2BD JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x2D8 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x2D3 SWAP2 SWAP1 PUSH2 0x1993 JUMP JUMPDEST PUSH2 0x7C3 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x2E5 SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x2FA JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x303 PUSH2 0x7DB JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x310 SWAP2 SWAP1 PUSH2 0x1D3F JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x325 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x340 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x33B SWAP2 SWAP1 PUSH2 0x1993 JUMP JUMPDEST PUSH2 0x7F2 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x34D SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x362 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x36B PUSH2 0x874 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x378 SWAP2 SWAP1 PUSH2 0x1D3F JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x38D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x396 PUSH2 0x88B JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x3A4 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x3BF PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x3BA SWAP2 SWAP1 PUSH2 0x1993 JUMP JUMPDEST PUSH2 0xA3E JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x3CC SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x3E1 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x3EA PUSH2 0xA87 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x3F7 SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x40C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x415 PUSH2 0xA91 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x423 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x42C PUSH2 0xAA1 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x439 SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x44E JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x469 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x464 SWAP2 SWAP1 PUSH2 0x1A21 JUMP JUMPDEST PUSH2 0xAC9 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x477 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x492 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x48D SWAP2 SWAP1 PUSH2 0x1993 JUMP JUMPDEST PUSH2 0xBBA JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x49F SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x4B4 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x4BD PUSH2 0xC6C JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x4CA SWAP2 SWAP1 PUSH2 0x1C3A JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x4DF JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x4FA PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x4F5 SWAP2 SWAP1 PUSH2 0x1993 JUMP JUMPDEST PUSH2 0xC90 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x507 SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x51C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x525 PUSH2 0xD44 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x533 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x53C PUSH2 0xF85 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x549 SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x55E JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x567 PUSH2 0xF8B JUMP JUMPDEST STOP JUMPDEST PUSH2 0x571 PUSH2 0x10EF JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x57F JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x588 PUSH2 0x1458 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x596 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x59F PUSH2 0x16E1 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x5AC SWAP2 SWAP1 PUSH2 0x1C3A JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x95EA7B3 ADDRESS DUP4 PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x610 SWAP3 SWAP2 SWAP1 PUSH2 0x1CB5 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x62A JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x63E JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x662 SWAP2 SWAP1 PUSH2 0x19F8 JUMP JUMPDEST POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x23B872DD ADDRESS DUP5 DUP5 PUSH1 0x40 MLOAD DUP5 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x6C0 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1C7E JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x6DA JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x6EE JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x712 SWAP2 SWAP1 PUSH2 0x19F8 JUMP JUMPDEST POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x4 SLOAD SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH32 0x0 DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x4 SLOAD DUP2 JUMP JUMPDEST PUSH1 0x7 PUSH1 0x20 MSTORE DUP1 PUSH1 0x0 MSTORE PUSH1 0x40 PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP2 POP SWAP1 POP SLOAD DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x3 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH2 0x869 PUSH1 0x7 PUSH1 0x0 DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x864 PUSH1 0x5 SLOAD PUSH32 0x0 PUSH2 0x170A JUMP JUMPDEST PUSH2 0x1720 JUMP JUMPDEST SWAP1 POP DUP1 SWAP2 POP POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x3 PUSH1 0x1 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH2 0x896 CALLER PUSH2 0x7F2 JUMP JUMPDEST SWAP1 POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x95EA7B3 ADDRESS DUP4 PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x8F3 SWAP3 SWAP2 SWAP1 PUSH2 0x1CB5 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x90D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x921 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x945 SWAP2 SWAP1 PUSH2 0x19F8 JUMP JUMPDEST POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x23B872DD ADDRESS CALLER DUP5 PUSH1 0x40 MLOAD DUP5 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x9A3 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1C7E JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x9BD JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x9D1 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x9F5 SWAP2 SWAP1 PUSH2 0x19F8 JUMP JUMPDEST POP PUSH1 0x0 PUSH1 0x7 PUSH1 0x0 CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x7 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x2 SLOAD SWAP1 POP SWAP1 JUMP JUMPDEST PUSH2 0xA9F PUSH1 0x4 SLOAD PUSH1 0x2 SLOAD PUSH2 0x1736 JUMP JUMPDEST JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x23B872DD CALLER ADDRESS DUP5 PUSH1 0x40 MLOAD DUP5 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xB26 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1C7E JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xB40 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0xB54 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xB78 SWAP2 SWAP1 PUSH2 0x19F8 JUMP JUMPDEST POP PUSH1 0x1 PUSH1 0x3 PUSH1 0x1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH2 0xB9F DUP2 PUSH1 0x2 PUSH2 0x170A JUMP JUMPDEST PUSH1 0x4 DUP2 SWAP1 SSTORE POP PUSH2 0xBB1 DUP2 PUSH1 0x4 SLOAD PUSH2 0x1902 JUMP JUMPDEST PUSH1 0x5 DUP2 SWAP1 SSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x70A08231 DUP4 PUSH1 0x40 MLOAD DUP3 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xC15 SWAP2 SWAP1 PUSH2 0x1C3A JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP7 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xC2D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS STATICCALL ISZERO DUP1 ISZERO PUSH2 0xC41 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xC65 SWAP2 SWAP1 PUSH2 0x1A4A JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0xDD62ED3E DUP4 ADDRESS PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xCED SWAP3 SWAP2 SWAP1 PUSH2 0x1C55 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP7 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xD05 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS STATICCALL ISZERO DUP1 ISZERO PUSH2 0xD19 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xD3D SWAP2 SWAP1 PUSH2 0x1A4A JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 JUMPDEST PUSH1 0x6 SLOAD DUP2 LT ISZERO PUSH2 0xF82 JUMPI PUSH1 0x0 PUSH1 0x8 PUSH1 0x0 DUP4 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP PUSH1 0x0 PUSH2 0xD94 DUP3 PUSH2 0x7F2 JUMP JUMPDEST SWAP1 POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x95EA7B3 ADDRESS DUP4 PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xDF1 SWAP3 SWAP2 SWAP1 PUSH2 0x1CB5 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xE0B JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0xE1F JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xE43 SWAP2 SWAP1 PUSH2 0x19F8 JUMP JUMPDEST POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x23B872DD ADDRESS DUP5 DUP5 PUSH1 0x40 MLOAD DUP5 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xEA1 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1C7E JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xEBB JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0xECF JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xEF3 SWAP2 SWAP1 PUSH2 0x19F8 JUMP JUMPDEST POP PUSH1 0x8 PUSH1 0x0 DUP5 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD SWAP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 SSTORE PUSH1 0x7 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SSTORE POP POP DUP1 DUP1 PUSH2 0xF7A SWAP1 PUSH2 0x201F JUMP JUMPDEST SWAP2 POP POP PUSH2 0xD47 JUMP JUMPDEST POP JUMP JUMPDEST PUSH1 0x5 SLOAD DUP2 JUMP JUMPDEST PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x1019 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1010 SWAP1 PUSH2 0x1DB5 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 SELFBALANCE SWAP1 POP PUSH1 0x0 DUP1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH1 0x40 MLOAD PUSH2 0x1065 SWAP1 PUSH2 0x1C25 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP8 GAS CALL SWAP3 POP POP POP RETURNDATASIZE DUP1 PUSH1 0x0 DUP2 EQ PUSH2 0x10A2 JUMPI PUSH1 0x40 MLOAD SWAP2 POP PUSH1 0x1F NOT PUSH1 0x3F RETURNDATASIZE ADD AND DUP3 ADD PUSH1 0x40 MSTORE RETURNDATASIZE DUP3 MSTORE RETURNDATASIZE PUSH1 0x0 PUSH1 0x20 DUP5 ADD RETURNDATACOPY PUSH2 0x10A7 JUMP JUMPDEST PUSH1 0x60 SWAP2 POP JUMPDEST POP POP SWAP1 POP DUP1 PUSH2 0x10EB JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x10E2 SWAP1 PUSH2 0x1D75 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST POP POP JUMP JUMPDEST PUSH32 0x0 CALLVALUE LT ISZERO PUSH2 0x1152 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1149 SWAP1 PUSH2 0x1E35 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH32 0x0 CALLVALUE GT ISZERO PUSH2 0x11B5 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x11AC SWAP1 PUSH2 0x1DD5 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x3 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND ISZERO PUSH2 0x1205 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x11FC SWAP1 PUSH2 0x1D95 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST CALLVALUE PUSH1 0x2 PUSH1 0x0 DUP3 DUP3 SLOAD PUSH2 0x1217 SWAP2 SWAP1 PUSH2 0x1E8C JUMP JUMPDEST SWAP3 POP POP DUP2 SWAP1 SSTORE POP PUSH32 0x0 PUSH1 0x2 SLOAD GT ISZERO PUSH2 0x1283 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x127A SWAP1 PUSH2 0x1E15 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x12AC PUSH32 0x0 PUSH2 0x1918 JUMP JUMPDEST PUSH1 0x2 SLOAD LT PUSH2 0x12D0 JUMPI PUSH1 0x1 PUSH1 0x3 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP JUMPDEST PUSH1 0x0 DUP1 JUMPDEST PUSH1 0x6 SLOAD DUP2 LT ISZERO PUSH2 0x135D JUMPI CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x8 PUSH1 0x0 DUP4 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO PUSH2 0x134A JUMPI PUSH1 0x1 SWAP2 POP JUMPDEST DUP1 DUP1 PUSH2 0x1355 SWAP1 PUSH2 0x201F JUMP JUMPDEST SWAP2 POP POP PUSH2 0x12D4 JUMP JUMPDEST POP PUSH1 0x0 ISZERO ISZERO DUP2 ISZERO ISZERO EQ PUSH2 0x13A5 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x139C SWAP1 PUSH2 0x1DF5 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST CALLER PUSH1 0x8 PUSH1 0x0 PUSH1 0x6 SLOAD DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP CALLVALUE PUSH1 0x7 PUSH1 0x0 CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH1 0x6 PUSH1 0x0 DUP2 SLOAD DUP1 SWAP3 SWAP2 SWAP1 PUSH2 0x1450 SWAP1 PUSH2 0x201F JUMP JUMPDEST SWAP2 SWAP1 POP SSTORE POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x14E6 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x14DD SWAP1 PUSH2 0x1DB5 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 JUMPDEST PUSH1 0x6 SLOAD DUP2 LT ISZERO PUSH2 0x16C3 JUMPI PUSH1 0x0 PUSH1 0x8 PUSH1 0x0 DUP4 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP PUSH1 0x0 PUSH1 0x7 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD SWAP1 POP PUSH1 0x0 DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH1 0x40 MLOAD PUSH2 0x1595 SWAP1 PUSH2 0x1C25 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP8 GAS CALL SWAP3 POP POP POP RETURNDATASIZE DUP1 PUSH1 0x0 DUP2 EQ PUSH2 0x15D2 JUMPI PUSH1 0x40 MLOAD SWAP2 POP PUSH1 0x1F NOT PUSH1 0x3F RETURNDATASIZE ADD AND DUP3 ADD PUSH1 0x40 MSTORE RETURNDATASIZE DUP3 MSTORE RETURNDATASIZE PUSH1 0x0 PUSH1 0x20 DUP5 ADD RETURNDATACOPY PUSH2 0x15D7 JUMP JUMPDEST PUSH1 0x60 SWAP2 POP JUMPDEST POP POP SWAP1 POP DUP1 PUSH2 0x161B JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1612 SWAP1 PUSH2 0x1D75 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP2 PUSH1 0x2 PUSH1 0x0 DUP3 DUP3 SLOAD PUSH2 0x162D SWAP2 SWAP1 PUSH2 0x1F6D JUMP JUMPDEST SWAP3 POP POP DUP2 SWAP1 SSTORE POP PUSH1 0x8 PUSH1 0x0 DUP6 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD SWAP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 SSTORE PUSH1 0x7 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SSTORE POP POP POP DUP1 DUP1 PUSH2 0x16BB SWAP1 PUSH2 0x201F JUMP JUMPDEST SWAP2 POP POP PUSH2 0x14E9 JUMP JUMPDEST POP PUSH1 0x0 PUSH1 0x3 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 DUP2 DUP4 PUSH2 0x1718 SWAP2 SWAP1 PUSH2 0x1EE2 JUMP JUMPDEST SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 DUP4 PUSH2 0x172E SWAP2 SWAP1 PUSH2 0x1F13 JUMP JUMPDEST SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x95EA7B3 PUSH32 0x0 DUP5 PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x17B1 SWAP3 SWAP2 SWAP1 PUSH2 0x1CB5 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x17CB JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x17DF JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x1803 SWAP2 SWAP1 PUSH2 0x19F8 JUMP JUMPDEST POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0xF305D719 DUP3 PUSH32 0x0 DUP6 PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND TIMESTAMP PUSH1 0x40 MLOAD DUP9 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x18A9 SWAP7 SWAP6 SWAP5 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1CDE JUMP JUMPDEST PUSH1 0x60 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP9 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x18C2 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x18D6 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x18FB SWAP2 SWAP1 PUSH2 0x1A73 JUMP JUMPDEST POP POP POP POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 DUP4 PUSH2 0x1910 SWAP2 SWAP1 PUSH2 0x1F6D JUMP JUMPDEST SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x64 DUP4 PUSH1 0x63 PUSH2 0x192A SWAP2 SWAP1 PUSH2 0x1F13 JUMP JUMPDEST PUSH2 0x1934 SWAP2 SWAP1 PUSH2 0x1EE2 JUMP JUMPDEST SWAP1 POP DUP1 SWAP2 POP POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x194E DUP2 PUSH2 0x2234 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH2 0x1963 DUP2 PUSH2 0x224B JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x1978 DUP2 PUSH2 0x2262 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH2 0x198D DUP2 PUSH2 0x2262 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x19A5 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x19B3 DUP5 DUP3 DUP6 ADD PUSH2 0x193F JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x40 DUP4 DUP6 SUB SLT ISZERO PUSH2 0x19CF JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x19DD DUP6 DUP3 DUP7 ADD PUSH2 0x193F JUMP JUMPDEST SWAP3 POP POP PUSH1 0x20 PUSH2 0x19EE DUP6 DUP3 DUP7 ADD PUSH2 0x1969 JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x1A0A JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1A18 DUP5 DUP3 DUP6 ADD PUSH2 0x1954 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x1A33 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1A41 DUP5 DUP3 DUP6 ADD PUSH2 0x1969 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x1A5C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1A6A DUP5 DUP3 DUP6 ADD PUSH2 0x197E JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 PUSH1 0x60 DUP5 DUP7 SUB SLT ISZERO PUSH2 0x1A88 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1A96 DUP7 DUP3 DUP8 ADD PUSH2 0x197E JUMP JUMPDEST SWAP4 POP POP PUSH1 0x20 PUSH2 0x1AA7 DUP7 DUP3 DUP8 ADD PUSH2 0x197E JUMP JUMPDEST SWAP3 POP POP PUSH1 0x40 PUSH2 0x1AB8 DUP7 DUP3 DUP8 ADD PUSH2 0x197E JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 POP SWAP3 JUMP JUMPDEST PUSH2 0x1ACB DUP2 PUSH2 0x1FA1 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH2 0x1ADA DUP2 PUSH2 0x1FB3 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH2 0x1AE9 DUP2 PUSH2 0x1FE9 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH2 0x1AF8 DUP2 PUSH2 0x200D JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1B0B PUSH1 0x14 DUP4 PUSH2 0x1E7B JUMP JUMPDEST SWAP2 POP PUSH2 0x1B16 DUP3 PUSH2 0x20C6 JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1B2E PUSH1 0x16 DUP4 PUSH2 0x1E7B JUMP JUMPDEST SWAP2 POP PUSH2 0x1B39 DUP3 PUSH2 0x20EF JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1B51 PUSH1 0x9 DUP4 PUSH2 0x1E7B JUMP JUMPDEST SWAP2 POP PUSH2 0x1B5C DUP3 PUSH2 0x2118 JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1B74 PUSH1 0x0 DUP4 PUSH2 0x1E70 JUMP JUMPDEST SWAP2 POP PUSH2 0x1B7F DUP3 PUSH2 0x2141 JUMP JUMPDEST PUSH1 0x0 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1B97 PUSH1 0x18 DUP4 PUSH2 0x1E7B JUMP JUMPDEST SWAP2 POP PUSH2 0x1BA2 DUP3 PUSH2 0x2144 JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1BBA PUSH1 0x2B DUP4 PUSH2 0x1E7B JUMP JUMPDEST SWAP2 POP PUSH2 0x1BC5 DUP3 PUSH2 0x216D JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1BDD PUSH1 0x27 DUP4 PUSH2 0x1E7B JUMP JUMPDEST SWAP2 POP PUSH2 0x1BE8 DUP3 PUSH2 0x21BC JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1C00 PUSH1 0x1A DUP4 PUSH2 0x1E7B JUMP JUMPDEST SWAP2 POP PUSH2 0x1C0B DUP3 PUSH2 0x220B JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x1C1F DUP2 PUSH2 0x1FDF JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1C30 DUP3 PUSH2 0x1B67 JUMP JUMPDEST SWAP2 POP DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1C4F PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x1AC2 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 DUP3 ADD SWAP1 POP PUSH2 0x1C6A PUSH1 0x0 DUP4 ADD DUP6 PUSH2 0x1AC2 JUMP JUMPDEST PUSH2 0x1C77 PUSH1 0x20 DUP4 ADD DUP5 PUSH2 0x1AC2 JUMP JUMPDEST SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x60 DUP3 ADD SWAP1 POP PUSH2 0x1C93 PUSH1 0x0 DUP4 ADD DUP7 PUSH2 0x1AC2 JUMP JUMPDEST PUSH2 0x1CA0 PUSH1 0x20 DUP4 ADD DUP6 PUSH2 0x1AC2 JUMP JUMPDEST PUSH2 0x1CAD PUSH1 0x40 DUP4 ADD DUP5 PUSH2 0x1C16 JUMP JUMPDEST SWAP5 SWAP4 POP POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 DUP3 ADD SWAP1 POP PUSH2 0x1CCA PUSH1 0x0 DUP4 ADD DUP6 PUSH2 0x1AC2 JUMP JUMPDEST PUSH2 0x1CD7 PUSH1 0x20 DUP4 ADD DUP5 PUSH2 0x1C16 JUMP JUMPDEST SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0xC0 DUP3 ADD SWAP1 POP PUSH2 0x1CF3 PUSH1 0x0 DUP4 ADD DUP10 PUSH2 0x1AC2 JUMP JUMPDEST PUSH2 0x1D00 PUSH1 0x20 DUP4 ADD DUP9 PUSH2 0x1C16 JUMP JUMPDEST PUSH2 0x1D0D PUSH1 0x40 DUP4 ADD DUP8 PUSH2 0x1AEF JUMP JUMPDEST PUSH2 0x1D1A PUSH1 0x60 DUP4 ADD DUP7 PUSH2 0x1AEF JUMP JUMPDEST PUSH2 0x1D27 PUSH1 0x80 DUP4 ADD DUP6 PUSH2 0x1AC2 JUMP JUMPDEST PUSH2 0x1D34 PUSH1 0xA0 DUP4 ADD DUP5 PUSH2 0x1C16 JUMP JUMPDEST SWAP8 SWAP7 POP POP POP POP POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1D54 PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x1AD1 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1D6F PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x1AE0 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1D8E DUP2 PUSH2 0x1AFE JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1DAE DUP2 PUSH2 0x1B21 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1DCE DUP2 PUSH2 0x1B44 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1DEE DUP2 PUSH2 0x1B8A JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1E0E DUP2 PUSH2 0x1BAD JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1E2E DUP2 PUSH2 0x1BD0 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1E4E DUP2 PUSH2 0x1BF3 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1E6A PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x1C16 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP3 DUP3 MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1E97 DUP3 PUSH2 0x1FDF JUMP JUMPDEST SWAP2 POP PUSH2 0x1EA2 DUP4 PUSH2 0x1FDF JUMP JUMPDEST SWAP3 POP DUP3 PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF SUB DUP3 GT ISZERO PUSH2 0x1ED7 JUMPI PUSH2 0x1ED6 PUSH2 0x2068 JUMP JUMPDEST JUMPDEST DUP3 DUP3 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1EED DUP3 PUSH2 0x1FDF JUMP JUMPDEST SWAP2 POP PUSH2 0x1EF8 DUP4 PUSH2 0x1FDF JUMP JUMPDEST SWAP3 POP DUP3 PUSH2 0x1F08 JUMPI PUSH2 0x1F07 PUSH2 0x2097 JUMP JUMPDEST JUMPDEST DUP3 DUP3 DIV SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1F1E DUP3 PUSH2 0x1FDF JUMP JUMPDEST SWAP2 POP PUSH2 0x1F29 DUP4 PUSH2 0x1FDF JUMP JUMPDEST SWAP3 POP DUP2 PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DIV DUP4 GT DUP3 ISZERO ISZERO AND ISZERO PUSH2 0x1F62 JUMPI PUSH2 0x1F61 PUSH2 0x2068 JUMP JUMPDEST JUMPDEST DUP3 DUP3 MUL SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1F78 DUP3 PUSH2 0x1FDF JUMP JUMPDEST SWAP2 POP PUSH2 0x1F83 DUP4 PUSH2 0x1FDF JUMP JUMPDEST SWAP3 POP DUP3 DUP3 LT ISZERO PUSH2 0x1F96 JUMPI PUSH2 0x1F95 PUSH2 0x2068 JUMP JUMPDEST JUMPDEST DUP3 DUP3 SUB SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1FAC DUP3 PUSH2 0x1FBF JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 ISZERO ISZERO SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1FF4 DUP3 PUSH2 0x1FFB JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x2006 DUP3 PUSH2 0x1FBF JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x2018 DUP3 PUSH2 0x1FDF JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x202A DUP3 PUSH2 0x1FDF JUMP JUMPDEST SWAP2 POP PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 EQ ISZERO PUSH2 0x205D JUMPI PUSH2 0x205C PUSH2 0x2068 JUMP JUMPDEST JUMPDEST PUSH1 0x1 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH1 0x0 MSTORE PUSH1 0x11 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH1 0x0 REVERT JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH1 0x0 MSTORE PUSH1 0x12 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH1 0x0 REVERT JUMPDEST PUSH32 0x4661696C656420746F2073656E64204574686572000000000000000000000000 PUSH1 0x0 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH32 0x43617020697320616C7265616479207265616368656400000000000000000000 PUSH1 0x0 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH32 0x4E6F74206F776E65720000000000000000000000000000000000000000000000 PUSH1 0x0 DUP3 ADD MSTORE POP JUMP JUMPDEST POP JUMP JUMPDEST PUSH32 0x4465706F7369742056616C756520697320546F6F204269670000000000000000 PUSH1 0x0 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH32 0x596F75206861766520616C726561647920636F6E747269627574656420746F20 PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x7468652070726573616C65000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH32 0x52657665727465643A20424E42206465706F73697420776F756C6420676F206F PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x7665722063617000000000000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH32 0x4465706F7369742056616C756520697320546F6F20536D616C6C000000000000 PUSH1 0x0 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH2 0x223D DUP2 PUSH2 0x1FA1 JUMP JUMPDEST DUP2 EQ PUSH2 0x2248 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH2 0x2254 DUP2 PUSH2 0x1FB3 JUMP JUMPDEST DUP2 EQ PUSH2 0x225F JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH2 0x226B DUP2 PUSH2 0x1FDF JUMP JUMPDEST DUP2 EQ PUSH2 0x2276 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP INVALID LOG2 PUSH5 0x6970667358 0x22 SLT KECCAK256 SWAP4 EXTCODEHASH PUSH23 0x2D1D9D93A4033C07371249870670D73DECE0AD782563A1 DUP12 0x27 0xA5 PUSH8 0x9E4664736F6C6343 STOP ADDMOD SUB STOP CALLER ",
        "sourceMap": "5514:7622:0:-:0;;;5893:5;5867:31;;;;;;;;;;;;;;;;;;;;5924:5;5904:25;;;;;;;;;;;;;;;;;;;;6190:1;6164:27;;6360:335;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;6451:4;6445:10;;;;;;6486:7;6465:28;;;;;;6524:7;6503:28;;;;;;6556:13;6541:28;;;;;;;;;;;;6617:42;6579:81;;;;;;;;;;;;6678:10;6670:5;;:18;;;;;;;;;;;;;;;;;;6360:335;;;;5514:7622;;7:143:1;;95:6;89:13;80:22;;111:33;138:5;111:33;:::i;:::-;70:80;;;;:::o;156:143::-;;244:6;238:13;229:22;;260:33;287:5;260:33;:::i;:::-;219:80;;;;:::o;305:753::-;;;;;475:3;463:9;454:7;450:23;446:33;443:2;;;492:1;489;482:12;443:2;535:1;560:64;616:7;607:6;596:9;592:22;560:64;:::i;:::-;550:74;;506:128;673:2;699:64;755:7;746:6;735:9;731:22;699:64;:::i;:::-;689:74;;644:129;812:2;838:64;894:7;885:6;874:9;870:22;838:64;:::i;:::-;828:74;;783:129;951:2;977:64;1033:7;1024:6;1013:9;1009:22;977:64;:::i;:::-;967:74;;922:129;433:625;;;;;;;:::o;1064:96::-;;1130:24;1148:5;1130:24;:::i;:::-;1119:35;;1109:51;;;:::o;1166:126::-;;1243:42;1236:5;1232:54;1221:65;;1211:81;;;:::o;1298:77::-;;1364:5;1353:16;;1343:32;;;:::o;1381:122::-;1454:24;1472:5;1454:24;:::i;:::-;1447:5;1444:35;1434:2;;1493:1;1490;1483:12;1434:2;1424:79;:::o;1509:122::-;1582:24;1600:5;1582:24;:::i;:::-;1575:5;1572:35;1562:2;;1621:1;1618;1611:12;1562:2;1552:79;:::o;5514:7622:0:-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;"
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
