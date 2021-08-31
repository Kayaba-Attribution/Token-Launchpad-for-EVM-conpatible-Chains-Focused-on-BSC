// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface IUniswapV2Router01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);

    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}



// pragma solidity >=0.6.2;

interface IUniswapV2Router02 is IUniswapV2Router01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountETH);
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}    

contract preSale {

    address public owner;

    // preSale static information
    address private immutable tokenAddress;
    uint private immutable cap;
    uint private immutable minBNBContribution;
    uint private immutable maxBNBContribution;

    // preSale dynamic information
    uint private tokensAvaliable;
    uint private weiRaised;
    bool private capReached = false;
    bool private open = false;
    
    //preSale tokens information
    uint public liqTokens;
    uint public saleTokens;
    
    IUniswapV2Router02 public immutable uniswapV2Router;

    // contribution (bnb) mapping, indexing, and number of contributors 
    uint total_contributors = 0;
    mapping (address => uint) public contributions;
    mapping (uint => address) private contributor_indices;
   // mapping (address => uint) public t_balances;

    constructor (uint _cap, uint _minBNB, uint _maxBNB, address _tokenAddress) {
        cap = _cap;
        minBNBContribution = _minBNB;
        maxBNBContribution = _maxBNB;
        tokenAddress = _tokenAddress;
        uniswapV2Router =  IUniswapV2Router02(0xD99D1c33F9fC3444f8101754aBC46c52416550D1);
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    function owner_() public view returns (address){
        return owner;
    }
    function moneyRaised() public view returns (uint){
        return weiRaised;
    }
    function preSaleCompleted() public view returns (bool){
        return capReached;
    }
    function tokenAddress_() public view returns (address){
        return tokenAddress;
    }
    function minBNB() public view returns (uint){
        return minBNBContribution;
    }
    function maxBNB() public view returns (uint){
        return maxBNBContribution;
    }
    function cap_() public view returns (uint){
        return cap;
    }
    function isOpen() public view returns (bool){
        return open;
    }
    function liqTokens_() public view returns (uint){
        return liqTokens;
    }

    function SeeAddressContribution(address _addr) external view returns (uint) {
        return contributions[_addr];
    }
    

    
    function calculateOffset(uint _value) pure private returns ( uint ) {
        // store the calculation in a big enough value
        uint result = ( 99 * _value ) / 100;

        // convert result
        return uint( result );
    }

    function deposit() public payable {
        require(msg.value >= minBNBContribution, "Deposit Value is Too Small");
        require(msg.value <= maxBNBContribution, "Deposit Value is Too Big");
        require(!capReached, "Cap is already reached");

        weiRaised += msg.value;
        require(weiRaised <= cap, "Reverted: BNB deposit would go over cap");
        
        // 1% offset see calculateOffset for details
        if (weiRaised >= calculateOffset(cap)){
            capReached = true;
        }

        bool found = false;

        for(uint i = 0; i < total_contributors; i++)
        {
            if(contributor_indices[i] == msg.sender)
            {
                found = true;
            }
        }

        require(found == false, "You have already contributed to the presale");
        contributor_indices[total_contributors] = msg.sender;
        contributions[msg.sender] = msg.value;
        total_contributors++;
    }

    function send_BNB_back() external onlyOwner {
        for (uint i = 0 ; i < total_contributors; i++) {
            // use inner mapping to get address, get bnb amount with address, send back that bnb value
            address temp_A = contributor_indices[i];
            uint temp_V = contributions[temp_A];
            (bool success, ) = payable(temp_A).call{value:temp_V}("");
            require(success, "Failed to send Ether");
            weiRaised -= temp_V;
            delete contributor_indices[i];
            delete contributions[temp_A];
        }
        capReached = false;
    }

    function EmergencyWithdraw() public onlyOwner {
        // get the amount of Ether stored in this contract
        uint amount = address(this).balance;

        // send all Ether to owner
        // Owner can receive Ether since the address of owner is payable
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Failed to send Ether");
    }

    
    //no
    function seeAllowance(address _owner) public view returns (uint) {
         //approve the tokens from the sender to this contract
         return IERC20(tokenAddress).allowance(_owner, address(this));
    }
    //no
    function seeBalance( address _addr) public view returns (uint) {
         return IERC20(tokenAddress).balanceOf(_addr);
    }
     
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }
    
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }
    
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }
    
    //import safemath
    

    function depositPreSaleTokens(uint amount_) public {
        
        IERC20(tokenAddress).transferFrom( msg.sender, address(this), amount_);

        open = true;
        
        liqTokens = div(amount_, 2);
        saleTokens = sub(amount_, liqTokens);
    }
     //no use
    function sendTokens(address to_, uint amount_) public {
         IERC20(tokenAddress).approve(address(this), amount_);
         IERC20(tokenAddress).transferFrom(address(this), to_, amount_);
         
    }
     

    function finalize() public {
        addLiquidity(liqTokens, weiRaised);
    }
     
     
    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        // approve token transfer to cover all possible scenarios
        IERC20(tokenAddress).approve(address(uniswapV2Router), tokenAmount);

        // add the liquidity
        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            tokenAddress,
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            owner,
            block.timestamp
        );
    }

    // function getRate() public view returns (uint){
    //     uint rate_ = div(saleTokens, cap);
    //     return rate_; 
    // }
    
    function tokenAllocation(address addr_) public view returns (uint) {
        uint allocation = (mul(contributions[addr_], (div(saleTokens, cap))));
        return allocation;
    }
    

    function claimTokens() public {
        uint amount_ = 250000000000000;
        IERC20(tokenAddress).approve(address(this), amount_);
        IERC20(tokenAddress).transferFrom(address(this), msg.sender, amount_);
        contributions[msg.sender] = 0;
         
    }



}
