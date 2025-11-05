import express from 'express';
import { ethers, Contract } from 'ethers';
import { BUNDLER_PRIVATE_KEY, RPC_URL } from './config';
import EntryPointAbi from './abi/EntryPoint.json';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const bundlerWallet = new ethers.Wallet(BUNDLER_PRIVATE_KEY, provider);

console.log(`Bundler address: ${bundlerWallet.address}`);

app.get('/', (req, res) => {
  res.send('Foresight Relayer is running!');
});

app.post('/', async (req, res) => {
  try {
    const { userOp, entryPointAddress } = req.body;

    if (!userOp || !entryPointAddress) {
      return res.status(400).json({
        jsonrpc: '2.0',
        id: req.body.id,
        error: {
          code: -32602,
          message: 'Invalid params: userOp and entryPointAddress are required.',
        },
      });
    }

    console.log('Received UserOperation:');
    console.log(userOp);
    console.log('EntryPoint Address:', entryPointAddress);

    const entryPoint = new Contract(entryPointAddress, EntryPointAbi, bundlerWallet);

    // For simplicity, we are bundling a single UserOperation.
    // A production bundler would aggregate multiple UserOperations.
    const tx = await entryPoint.handleOps([userOp], bundlerWallet.address);
    
    console.log('Transaction sent, waiting for confirmation...');
    const receipt = await tx.wait();
    console.log('Transaction confirmed! Hash:', receipt.hash);

    res.json({
      jsonrpc: '2.0',
      id: req.body.id,
      result: receipt.hash,
    });
  } catch (error: any) {
    console.error('Error processing UserOperation:', error);
    res.status(500).json({
      jsonrpc: '2.0',
      id: req.body.id,
      error: {
        code: -32602,
        message: 'Internal error',
        data: error.message,
      },
    });
  }
});

app.listen(PORT, () => {
  console.log(`Relayer server listening on port ${PORT}`);
});