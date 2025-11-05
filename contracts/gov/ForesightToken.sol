// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/**
 * @title ForesightToken
 * @dev The governance token for the Foresight prediction market platform.
 * It is an ERC20 token with voting and delegation capabilities provided by OpenZeppelin's ERC20Votes.
 */
contract ForesightToken is ERC20Votes {
    /**
     * @dev Mints the initial supply of tokens and assigns them to the deployer.
     * The deployer is then responsible for distributing the tokens to the community,
     * for example, through liquidity mining, airdrops, or a treasury.
     */
    constructor() ERC20("Foresight Token", "FST") ERC20Permit("Foresight Token") {
        // Mint 100 million tokens to the deployer.
        _mint(msg.sender, 100_000_000 * 10**decimals());
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }
}