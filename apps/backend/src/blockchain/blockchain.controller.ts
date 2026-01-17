import { Controller, Get } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  // GET http://localhost:3000/blockchain/value
  @Get('value')
  async getValue() {
    return this.blockchainService.getLatestValue();
  }

  // GET http://localhost:3000/blockchain/identity
  @Get('identity')
  async getIdentity() {
    return this.blockchainService.getIdentity();
  }

  // GET http://localhost:3000/blockchain/events
  @Get('events')
  async getEvents() {
    return this.blockchainService.getHistory();
  }
}