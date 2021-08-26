// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


contract preSale {

    address payable public owner;

    address private tokenAddress;
    uint private rate;
    uint private cap = 1 ether;
    uint private minBNBContribution = 0.1 ether;
    uint private maxBNBContribution = 1 ether;

    uint private tokensAvaliable;
    uint private weiRaised;
    bool private capReached = false;

    mapping(address => uint) private contributions;
    mapping ( address => uint256 ) public t_balances;

    function SeeTokenAddress() public view returns (address) {
        return tokenAddress;
    }

    function approveTokens(uint tokens) public {

        // approve the tokens from the sender to this contract
        IERC20(tokenAddress).approve(address(this), tokens);
    }

    function seeAllowance(address _owner) public view returns (uint) {

        // approve the tokens from the sender to this contract
        return IERC20(tokenAddress).allowance(_owner, address(this));
    }

    function seeBalance( address _addr) public view returns (uint) {
        return IERC20(tokenAddress).balanceOf(_addr);
    }

    function depositTokens(uint tokens) public {

        // add the deposited tokens into existing balance 
        t_balances[msg.sender]+= tokens;

        // transfer the tokens from the sender to this contract
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), tokens);
    }

    function returnTokens() public {
        uint256 amount = t_balances[msg.sender];
        t_balances[msg.sender] = 0;
        IERC20(tokenAddress).transfer(msg.sender, amount);
    }

    function SeeRate() public view returns (uint) {
        return rate;
    }

    function SeeCap() public view returns (uint) {
        return cap;
    }

    function seeMinContribution() public view returns (uint) {
        return minBNBContribution;
    }

    function seeMaxContribution() public view returns (uint) {
        return maxBNBContribution;
    }

    function SeeWeiRaised() public view returns (uint) {
        return weiRaised;
    }

    function SeeAddressContribution(address _addr) public view returns (uint) {
        return contributions[_addr];
    }

    function capReached_() public view returns (bool) {
        return capReached;
    }

    constructor() payable{
        
        owner = payable(msg.sender);
    }

    function setTokenAddress(address _addr) public {
        // Update the value at this address
        tokenAddress = _addr;
    }

    function deposit(uint amount) public payable {
        require(msg.value == amount);
        require(msg.value >= 0.1 ether, "Deposit Value is Too Small ");
        require(msg.value <= 1 ether, "Deposit Value is Too Big");
        require(capReached == false, "Cap is already reached");


        weiRaised += amount;
        require(weiRaised <= cap, "Reverted: BNB deposit would go over cap");

        if (weiRaised == cap){
            capReached = true;
        }

        contributions[msg.sender] = amount;
    }

    function withdraw() public onlyOwner {
        // get the amount of Ether stored in this contract
        uint amount = address(this).balance;

        // send all Ether to owner
        // Owner can receive Ether since the address of owner is payable
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Failed to send Ether");
    }


    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

}