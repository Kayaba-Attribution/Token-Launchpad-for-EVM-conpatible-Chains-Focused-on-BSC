# Secure and Improved Token Launchpad for EVM conpatible Chains (Focused on BSC)

- This project was build as the capstone project of [Preethi Kasireddy's Ethereum Bootcamp](https://maven.com/preethi/ethereum-bootcamp).
- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## PURPOSE

Build a token LaunchPad tailored to the average memecoins/speculation tokens consumer, where they have some level of protection against scams/honeypots/rugpulls by developing and integrating a series of new requirements and special tools.

## PROBLEM AND WHY NOW

With the rise in popularity, rate of adoption, and hype around the whole crypto ecosystem in 2020 and 2021 a special subset of speculative tokens has been reborn, memecoins. Most notably on the BSC (Binance Smart Chain) where the low transaction cost, a low entry barrier and the promise of 1000X returns led thousands if not millions of inexperienced traders to buy into these pump-and-dump schemes and lose tens of thousands of dollars which they have little to none protection against.

Over time the users developed ways to protect themselves, but the majority of these are still based on trust, “Doxxed” developers, and influencers backing up projects. Only a handful of users would ever go and look into a token source code, even less understand its workings. On top of all these, the most populars launchpads are victims of bots and have loose to none interest in customer security.


## SOLUTION

Our project will set up standards to prevent scam coins from taking advantage of users. 
On the developer side, we will manage the funds raised by pre-sales, add liquidity to the token, and lock the liquidity provider tokens (lp) automatically. Eliminating the risks of the devs running away with the funds, not adding liquidity and selling all the liquidity upon listing (rugpull).
On the user side, our platform will scan the project's source code for common vulnerabilities, set minimum lock up times, and provide ratings on each token. Giving the average user insights and confidence that simply couldn’t be achieved before.  

## PRODUCT OVERVIEW

1. The token developer fills out a form stating their project,  pre-sale, and token lock times information.
2. The token contract information is added to our splash page, along with any warnings about the contract source code.
3. Users looking to learn about new projects can navigate to the site to learn more and invest.
4. Token developer initialized the sale.
5. Upon pre-sale completion, liquidity is added, lp tokens are locked and users can claim their tokens, trade them instantly on PancakeSwap and see the lock's duration.

## IMPLEMENTATION

- For this MVP we are using the smart contract for ‘milestone’ data, Google Sheets as a temporary smart contract list “database” (1) and ReactJS for the front end (2).
- Using the token address submitted on the project form (3) we pull the token details from the blockchain using Ethers.js (4) and compile the pre-sale contract  (5) with various parameters passed to the contract constructor. We will prioritize storing as much important token information in a smart contract as possible.
- We pull the contract source code from bscscan testnet (6), scan it for common vulnerabilities, and display the results.
- When the developer initializes the pre-sale the compiled contract is deployed onto the blockchain (7).
- Users can see the amount of BNB raised, deposit bnb (within the pre-sale min and max) only once (7).
- Once the cap is reached, the contract won't allow any more deposits, will add liquidity, lock it and allow users to claim their tokens (7).


## MORE

- [Project WhitePaper](https://docs.google.com/document/d/1z46EiQLBtJiaQVPaq94mIS1pxNQedxTsbeXa56R0aKs/edit)
- [Final Presentation](https://docs.google.com/presentation/d/17jICGBR9S8UtsoFhkAk173dG9ozMni0h-7Mu0or3pDA/edit?usp=sharing)
# LIVE DEMO and presentation (11 min || 7 min only demo)    :)
- [Presentation and Live Demo](https://drive.google.com/file/d/1qlO9J8mauGLfES8k4wfLzpkS8UkQUT_h/view?usp=sharing)



