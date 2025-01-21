// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MemeCoin is ERC20 {
    address public owner;

    event Mint(address indexed to, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * (10 ** decimals()));
        owner = msg.sender;
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == owner, "Only owner can mint");
        _mint(to, amount);
        emit Mint(to, amount); 
    }

    function transferOwnership(address newOwner) public {
        require(msg.sender == owner, "Only owner can transfer ownership");
        require(newOwner != address(0), "New owner is the zero address");
        owner = newOwner;
    }
}
