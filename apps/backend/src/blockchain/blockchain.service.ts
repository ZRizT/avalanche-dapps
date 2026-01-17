import { 
  Injectable, 
  InternalServerErrorException, 
  ServiceUnavailableException 
} from '@nestjs/common';
import { createPublicClient, http } from 'viem';
import { avalancheFuji } from 'viem/chains';
import { SIMPLE_STORAGE_ABI } from './simple-storage.abi';

@Injectable()
export class BlockchainService {
  private client;

  private contractAddress: `0x${string}` = '0xb0ab403026f463972f9af3538f2b17faaacf081b';
//   private contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  constructor() {
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http('https://avalanche-fuji-c-chain.publicnode.com',{
    //   transport: http('https://rpc.ankr.com/avalanche_fuji', {
        timeout: 60_000, 
      }),
    });
  }

  // --- 1. Read Number ---
  async getLatestValue() {
    try {
      const value = await this.client.readContract({
        address: this.contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'getValue',
      });
      // Convert BigInt ke String agar aman di JSON
      return { value: value.toString() };
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  // --- 2. Read Identity/String ---
  async getIdentity() {
    try {
      const message = await this.client.readContract({
        address: this.contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'getMessage',
      });
      return { identity: message };
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  // --- 3. Fetch Events ---
  async getHistory() {
    try {
      const currentBlock = await this.client.getBlockNumber();
      const fromBlock = currentBlock - 2000n; 

      const valueLogs = await this.client.getLogs({
        address: this.contractAddress,
        event: { type: 'event', name: 'ValueUpdated', inputs: [{ type: 'uint256', name: 'newValue' }] },
        fromBlock: fromBlock, 
        toBlock: 'latest',
      });

      const messageLogs = await this.client.getLogs({
        address: this.contractAddress,
        event: { type: 'event', name: 'MessageUpdated', inputs: [{ type: 'string', name: 'newMessage' }] },
        fromBlock: fromBlock,
        toBlock: 'latest',
      });
      
      const formattedValues = valueLogs.map(log => ({
        type: 'Number Update',
        blockNumber: log.blockNumber.toString(),
        value: log.args.newValue.toString(),
        txHash: log.transactionHash,
      }));

      const formattedMessages = messageLogs.map(log => ({
        type: 'Identity Update',
        blockNumber: log.blockNumber.toString(),
        value: log.args.newMessage,
        txHash: log.transactionHash,
      }));

      return [...formattedValues, ...formattedMessages].sort((a, b) => 
        Number(b.blockNumber) - Number(a.blockNumber)
      );

    } catch (error) {
      this.handleRpcError(error);
    }
  }

  // --- Error Handler ---
  private handleRpcError(error: any): never {
    console.error("Blockchain Error:", error); // log error asli ke terminal backend
    const message = error?.message?.toLowerCase() || '';

    if (message.includes('timeout')) {
      throw new ServiceUnavailableException('RPC timeout. Silakan coba beberapa saat lagi.');
    }
    if (message.includes('network') || message.includes('fetch') || message.includes('failed')) {
      throw new ServiceUnavailableException('Tidak dapat terhubung ke blockchain RPC.');
    }
    throw new InternalServerErrorException('Terjadi kesalahan saat membaca data blockchain.');
  }
}