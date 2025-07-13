import { defineChain } from 'viem'

export const morphHolesky = defineChain({
  id: 2810, // Correct Chain ID for Morph Holesky
  name: 'Morph Holesky',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-quicknode-holesky.morphl2.io'], // Better RPC endpoint
    },
    public: {
      http: [
        'https://rpc-quicknode-holesky.morphl2.io',
        'https://rpc-holesky.morphl2.io',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Morph Holesky Explorer',
      url: 'https://explorer-holesky.morphl2.io',
    },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1,
    },
  },
  network: ''
}) 