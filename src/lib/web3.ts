// src/lib/web3.ts
import { BrowserProvider, JsonRpcProvider, Contract, Provider, Signer } from 'ethers'

// GiftVoucher contract ABI (all functions and events)
export const GIFT_VOUCHER_ABI = [
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "_recipients",
				"type": "address[]"
			},
			{
				"internalType": "uint64[]",
				"name": "_amounts",
				"type": "uint64[]"
			},
			{
				"internalType": "bytes[]",
				"name": "_messages",
				"type": "bytes[]"
			}
		],
		"name": "batchCreateVouchers",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "",
				"type": "bytes32[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_recipient",
				"type": "address"
			},
			{
				"internalType": "uint64",
				"name": "_amount",
				"type": "uint64"
			},
			{
				"internalType": "bytes",
				"name": "_message",
				"type": "bytes"
			}
		],
		"name": "createVoucher",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_voucherId",
				"type": "bytes32"
			}
		],
		"name": "redeemVoucher",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_voucherId",
				"type": "bytes32"
			}
		],
		"name": "refundVoucher",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_usdtAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "ReentrancyGuardReentrantCall",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32[]",
				"name": "voucherIds",
				"type": "bytes32[]"
			}
		],
		"name": "BatchVouchersCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "voucherId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "amount",
				"type": "uint64"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "message",
				"type": "bytes"
			}
		],
		"name": "VoucherCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "voucherId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "amount",
				"type": "uint64"
			}
		],
		"name": "VoucherRedeemed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "voucherId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "amount",
				"type": "uint64"
			}
		],
		"name": "VoucherRefunded",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getContractUSDTBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_voucherId",
				"type": "bytes32"
			}
		],
		"name": "getVoucher",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "recipient",
						"type": "address"
					},
					{
						"internalType": "uint64",
						"name": "amount",
						"type": "uint64"
					},
					{
						"internalType": "bytes",
						"name": "message",
						"type": "bytes"
					},
					{
						"internalType": "uint32",
						"name": "createdAt",
						"type": "uint32"
					},
					{
						"internalType": "bool",
						"name": "redeemed",
						"type": "bool"
					}
				],
				"internalType": "struct GiftVoucher.Voucher",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "usdt",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "VOUCHER_EXPIRY",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "vouchers",
		"outputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint64",
				"name": "amount",
				"type": "uint64"
			},
			{
				"internalType": "bytes",
				"name": "message",
				"type": "bytes"
			},
			{
				"internalType": "uint32",
				"name": "createdAt",
				"type": "uint32"
			},
			{
				"internalType": "bool",
				"name": "redeemed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]


export const ERC20_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// Contract addresses (update as needed)
export const GIFT_VOUCHER_ADDRESS = "0xD24F42a4bb0Ca8fd5862B6Fb9cb24d2347Ff18b4"
export const MOCK_USDT_ADDRESS = "0xdbE600c434eA6275b4257DB065215581C12686D0"


// Morph Holesky network configuration
export const MORPH_HOLESKY_CHAIN_ID = 2810
export const MORPH_HOLESKY_RPC = "https://rpc-quicknode-holesky.morphl2.io"

// Fallback RPC endpoints for redundancy
export const MORPH_HOLESKY_RPC_FALLBACK = [
  "https://rpc-quicknode-holesky.morphl2.io",
  "https://rpc-holesky.morphl2.io"
]

// Get Ethers.js provider with fallback support
export function getProvider(privyProvider?: unknown): Provider {
  // If a provider is passed (from Privy or window.ethereum), always use BrowserProvider for user wallet
  if (privyProvider) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new BrowserProvider(privyProvider as any)
  }
  // Only use JsonRpcProvider for read-only fallback (no signer)
  return new JsonRpcProvider(MORPH_HOLESKY_RPC)
}

// Get signer from Privy provider (must be a BrowserProvider)
export function getSigner(privyProvider: unknown): Promise<Signer> {
  const provider = getProvider(privyProvider)
  if (!(provider instanceof BrowserProvider)) {
    throw new Error('Signer requires a BrowserProvider (wallet provider)')
  }
  return provider.getSigner()
}

// Get GiftVoucher contract instance (read-only)
export function getGiftVoucherContract(privyProvider?: unknown): Contract {
  const provider = getProvider(privyProvider)
  return new Contract(GIFT_VOUCHER_ADDRESS, GIFT_VOUCHER_ABI, provider)
}

// Get GiftVoucher contract instance with signer (for write operations)
export async function getGiftVoucherContractWithSigner(privyProvider: unknown): Promise<Contract> {
  const provider = getProvider(privyProvider)
  if (!(provider instanceof BrowserProvider)) {
    throw new Error('Write operations require a wallet provider (BrowserProvider)')
  }
  const signer = await provider.getSigner()
  return new Contract(GIFT_VOUCHER_ADDRESS, GIFT_VOUCHER_ABI, signer)
}

// Network configuration for wallet connection
export const MORPH_HOLESKY_NETWORK = {
  chainId: MORPH_HOLESKY_CHAIN_ID,
  name: 'Morph Holesky',
  currency: 'ETH',
  explorerUrl: 'https://explorer-holesky.morphl2.io',
  rpcUrl: MORPH_HOLESKY_RPC
}

// Helper function to add/switch to Morph Holesky network
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function switchToMorphHolesky(ethereum: any): Promise<void> {
  try {
    // Try to switch to the network
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${MORPH_HOLESKY_CHAIN_ID.toString(16)}` }],
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${MORPH_HOLESKY_CHAIN_ID.toString(16)}`,
              chainName: 'Morph Holesky',
              nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: [MORPH_HOLESKY_RPC],
              blockExplorerUrls: ['https://explorer-holesky.morphl2.io'],
            },
          ],
        })
      } catch (addError) {
        console.error('Failed to add Morph Holesky network:', addError)
        throw addError
      }
    } else {
      console.error('Failed to switch to Morph Holesky network:', switchError)
      throw switchError
    }
  }
}

// Helper function to check if user is on correct network
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function isOnMorphHolesky(ethereum: any): Promise<boolean> {
  try {
    const chainId = await ethereum.request({ method: 'eth_chainId' })
    return parseInt(chainId, 16) === MORPH_HOLESKY_CHAIN_ID
  } catch (error) {
    console.error('Failed to check network:', error)
    return false
  }
}