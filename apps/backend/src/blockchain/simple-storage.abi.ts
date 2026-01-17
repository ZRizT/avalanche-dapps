export const SIMPLE_STORAGE_ABI = [
  // numerik
  {
    inputs: [],
    name: 'getValue',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: 'newValue', type: 'uint256' }],
    name: 'ValueUpdated',
    type: 'event',
  },
  
  // string
  {
    inputs: [],
    name: 'getMessage',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: 'newMessage', type: 'string' }],
    name: 'MessageUpdated',
    type: 'event',
  }
] as const;