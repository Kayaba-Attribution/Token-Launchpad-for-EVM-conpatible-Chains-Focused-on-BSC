// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

interface IUniswapV2Router01 {
    function factory() external pure returns (address);

    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    )
        external
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        );

    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    )
        external
        payable
        returns (
            uint256 amountToken,
            uint256 amountETH,
            uint256 liquidity
        );

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB);

    function removeLiquidityETH(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountToken, uint256 amountETH);

    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint256 amountA, uint256 amountB);

    function removeLiquidityETHWithPermit(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint256 amountToken, uint256 amountETH);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function swapTokensForExactETH(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapETHForExactTokens(
        uint256 amountOut,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function quote(
        uint256 amountA,
        uint256 reserveA,
        uint256 reserveB
    ) external pure returns (uint256 amountB);

    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) external pure returns (uint256 amountOut);

    function getAmountIn(
        uint256 amountOut,
        uint256 reserveIn,
        uint256 reserveOut
    ) external pure returns (uint256 amountIn);

    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);

    function getAmountsIn(uint256 amountOut, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);
}

// pragma solidity >=0.6.2;

interface IUniswapV2Router02 is IUniswapV2Router01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountETH);

    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint256 amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable;

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;
}

contract preSale {
    address public owner;

    // preSale static information
    address private immutable tokenAddress;
    uint256 private immutable cap;
    uint256 private immutable minBNBContribution;
    uint256 private immutable maxBNBContribution;

    // preSale dynamic information
    uint256 private tokensAvaliable;
    uint256 private weiRaised;
    bool private capReached = false;
    bool private open = false;

    //preSale tokens information
    uint256 public liqTokens;
    uint256 public saleTokens;

    IUniswapV2Router02 public immutable uniswapV2Router;

    // contribution (bnb) mapping, indexing, and number of contributors
    uint256 total_contributors = 0;
    mapping(address => uint256) public contributions;
    mapping(uint256 => address) private contributor_indices;

    // mapping (address => uint) public t_balances;

    constructor(
        uint256 _cap,
        uint256 _minBNB,
        uint256 _maxBNB,
        address _tokenAddress
    ) {
        cap = _cap;
        minBNBContribution = _minBNB;
        maxBNBContribution = _maxBNB;
        tokenAddress = _tokenAddress;
        uniswapV2Router = IUniswapV2Router02(
            0xD99D1c33F9fC3444f8101754aBC46c52416550D1
        );
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function owner_() public view returns (address) {
        return owner;
    }

    function moneyRaised() public view returns (uint256) {
        return weiRaised;
    }

    function preSaleCompleted() public view returns (bool) {
        return capReached;
    }

    function tokenAddress_() public view returns (address) {
        return tokenAddress;
    }

    function minBNB() public view returns (uint256) {
        return minBNBContribution;
    }

    function maxBNB() public view returns (uint256) {
        return maxBNBContribution;
    }

    function cap_() public view returns (uint256) {
        return cap;
    }

    function isOpen() public view returns (bool) {
        return open;
    }

    function liqTokens_() public view returns (uint256) {
        return liqTokens;
    }

    function SeeAddressContribution(address _addr)
        external
        view
        returns (uint256)
    {
        return contributions[_addr];
    }

    function calculateOffset(uint256 _value) private pure returns (uint256) {
        // store the calculation in a big enough value
        uint256 result = (99 * _value) / 100;

        // convert result
        return uint256(result);
    }

    function deposit() public payable {
        require(msg.value >= minBNBContribution, "Deposit Value is Too Small");
        require(msg.value <= maxBNBContribution, "Deposit Value is Too Big");
        require(!capReached, "Cap is already reached");

        weiRaised += msg.value;
        require(weiRaised <= cap, "Reverted: BNB deposit would go over cap");

        // 1% offset see calculateOffset for details
        if (weiRaised >= calculateOffset(cap)) {
            capReached = true;
        }

        bool found = false;

        for (uint256 i = 0; i < total_contributors; i++) {
            if (contributor_indices[i] == msg.sender) {
                found = true;
            }
        }

        require(found == false, "You have already contributed to the presale");
        contributor_indices[total_contributors] = msg.sender;
        contributions[msg.sender] = msg.value;
        total_contributors++;
    }

    function send_BNB_back() external onlyOwner {
        for (uint256 i = 0; i < total_contributors; i++) {
            // use inner mapping to get address, get bnb amount with address, send back that bnb value
            address temp_A = contributor_indices[i];
            uint256 temp_V = contributions[temp_A];
            (bool success, ) = payable(temp_A).call{value: temp_V}("");
            require(success, "Failed to send Ether");
            weiRaised -= temp_V;
            delete contributor_indices[i];
            delete contributions[temp_A];
        }
        capReached = false;
    }

    function EmergencyWithdraw() public onlyOwner {
        // get the amount of Ether stored in this contract
        uint256 amount = address(this).balance;

        // send all Ether to owner
        // Owner can receive Ether since the address of owner is payable
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Failed to send Ether");
    }

    //no
    function seeAllowance(address _owner) public view returns (uint256) {
        //approve the tokens from the sender to this contract
        return IERC20(tokenAddress).allowance(_owner, address(this));
    }

    //no
    function seeBalance(address _addr) public view returns (uint256) {
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

    function depositPreSaleTokens(uint256 amount_) public {
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount_);

        open = true;

        liqTokens = div(amount_, 2);
        saleTokens = sub(amount_, liqTokens);
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


    function tokenAllocation(address addr_) public view returns (uint256) {
        uint256 allocation = (
            mul(contributions[addr_], (div(saleTokens, cap)))
        );
        return allocation;
    }


    function claimTokens() public {
        uint256 amount_ = tokenAllocation(msg.sender);
        IERC20(tokenAddress).approve(address(this), amount_);
        IERC20(tokenAddress).transferFrom(address(this), msg.sender, amount_);
        contributions[msg.sender] = 0;
    }
}
