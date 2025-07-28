/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { MOCK_USDT_ADDRESS } from '@/lib/web3'
import { RefreshCw } from 'lucide-react'

// ERC20 ABI for balanceOf
const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
]

export function Web3Status() {
  const [mounted, setMounted] = useState(false)
  const [usdtBalance, setUsdtBalance] = useState<string>("0")
  const [loadingBalance, setLoadingBalance] = useState(false)
  const { authenticated, user, ready } = usePrivy()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch USDT balance
  const fetchUSDTBalance = async () => {
    if (!authenticated || !user?.wallet?.address) return
    
    setLoadingBalance(true)
    try {
      // Type as 'any' because window.ethereum is injected by wallet providers
      const ethereum = (window as any).ethereum as any
      if (!ethereum) return
      
      const provider = new ethers.BrowserProvider(ethereum)
      const usdtContract = new ethers.Contract(MOCK_USDT_ADDRESS, ERC20_ABI, provider)
      
      const balance = await usdtContract.balanceOf(user.wallet.address)
      const decimals = await usdtContract.decimals()
      console.log("balance",balance)
      
      setUsdtBalance(ethers.formatUnits(balance, decimals))
    } catch (error) {
      console.error('Failed to fetch USDT balance:', error)
      setUsdtBalance("0")
    } finally {
      setLoadingBalance(false)
    }
  }

  // Fetch balance when user changes
  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetchUSDTBalance()
    }
  }, [authenticated, user?.wallet?.address])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || !ready) {
    return (
      <div className="card-modern p-6 text-center">
        <h3 className="text-lg font-semibold-modern text-primary mb-2">
          Loading...
        </h3>
      </div>
    )
  }

  if (!authenticated || !user?.wallet) {
    return (
      <div className="card-modern p-6 text-center">
        <h3 className="text-lg font-semibold-modern text-primary mb-2">
          Wallet Not Connected
        </h3>
        <p className="text-secondary">
          Connect your wallet to start using Morph Gift
        </p>
      </div>
    )
  }

  return (
    <div className="card-modern p-6">
      <h3 className="text-lg font-semibold-modern text-primary mb-4">
        Wallet Status
      </h3>
      <div className="space-y-3">
        <div>
          <span className="text-sm text-secondary">Address: </span>
          <span className="text-sm font-medium-modern text-primary">
            {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
          </span>
        </div>
        <div>
          <span className="text-sm text-secondary">Network: </span>
          <span className="text-sm font-medium-modern text-primary">
            Morph Holesky
          </span>
        </div>
        <div>
          <span className="text-sm text-secondary">Login Method: </span>
          <span className="text-sm font-medium-modern text-primary">
            {user.linkedAccounts?.[0]?.type || 'Wallet'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-secondary">USDT Balance: </span>
            <span className="text-sm font-medium-modern text-primary">
              {loadingBalance ? "Loading..." : `${usdtBalance} USDT`}
            </span>
          </div>
          <button
            onClick={fetchUSDTBalance}
            disabled={loadingBalance}
            className="p-1 text-secondary hover:text-primary transition-colors disabled:opacity-50"
            title="Refresh balance"
          >
            <RefreshCw className={`w-4 h-4 ${loadingBalance ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  )
} 