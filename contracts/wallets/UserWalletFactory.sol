// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@safe-global/safe-contracts/contracts/interfaces/ISafe.sol";
import "@safe-global/safe-contracts/contracts/proxies/ISafeProxyFactory.sol";

/**
 * @title UserWalletFactory
 * @dev A factory for creating and managing user-specific Gnosis Safe wallets.
 * This contract uses the Gnosis Safe proxy factory to efficiently deploy new
 * smart contract wallets for users, enabling account abstraction features.
 */
contract UserWalletFactory {
    ISafeProxyFactory public immutable safeProxyFactory;
    address public immutable safeSingleton;

    // Mapping from a user's External Owned Account (EOA) to their Safe proxy address.
    mapping(address => address) public userWallets;

    // Event emitted when a new wallet is created for a user.
    event WalletCreated(address indexed user, address indexed walletAddress);

    /**
     * @param _proxyFactory The address of the Gnosis Safe Proxy Factory.
     * @param _safeSingleton The address of the Gnosis Safe singleton (master copy).
     */
    constructor(address _proxyFactory, address _safeSingleton) {
        require(_proxyFactory != address(0), "Invalid proxy factory address");
        require(_safeSingleton != address(0), "Invalid singleton address");
        safeProxyFactory = ISafeProxyFactory(_proxyFactory);
        safeSingleton = _safeSingleton;
    }

    /**
     * @dev Creates a new Gnosis Safe proxy for the message sender.
     * The sender will be the sole owner of the newly created wallet.
     * Reverts if the user already has a wallet.
     */
    function createWallet() external returns (address) {
        require(userWallets[msg.sender] == address(0), "Wallet already exists");

        // Prepare the setup data to initialize the Safe.
        // This sets the sender as the sole owner with a threshold of 1.
        address[] memory owners = new address[](1);
        owners[0] = msg.sender;
        bytes memory initializer = abi.encodeWithSelector(
            ISafe.setup.selector,
            owners,         // owners
            1,              // threshold
            address(0),     // to (for setup call)
            bytes(""),       // data (for setup call)
            address(0),     // fallback handler
            address(0),     // payment token
            0,              // payment
            address(0)      // payment receiver
        );

        // Use the factory to create a new proxy instance.
        // A unique nonce (salt) is used to ensure a deterministic address.
        ISafeProxy proxy = safeProxyFactory.createProxyWithNonce(
            safeSingleton,
            initializer,
            uint256(uint160(msg.sender)) // Nonce based on user address
        );

        address walletAddress = address(proxy);
        userWallets[msg.sender] = walletAddress;

        emit WalletCreated(msg.sender, walletAddress);
        return walletAddress;
    }

    /**
     * @dev Retrieves the wallet address for a given user.
     * @param _user The user's EOA.
     * @return The address of the user's smart contract wallet, or address(0) if not created.
     */
    function getWallet(address _user) external view returns (address) {
        return userWallets[_user];
    }
}