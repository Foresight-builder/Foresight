// relayer/src/config.ts

// IMPORTANT: Replace these placeholder values with your actual data.
// You should use environment variables to store sensitive data in a production environment.

// The private key of the wallet that will pay for the gas fees (the bundler).
// PLEASE DO NOT COMMIT THIS KEY TO VERSION CONTROL.
export const BUNDLER_PRIVATE_KEY = '0x0000000000000000000000000000000000000000000000000000000000000001';

// The RPC URL of the Ethereum node to connect to.
export const RPC_URL = 'http://127.0.0.1:8545'; // Example for a local Hardhat node