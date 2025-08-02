/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { usePrivy } from '@privy-io/react-auth'
import { InteractiveButton } from './interactive-button'
import { Wallet, LogOut, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator } from './ui/dropdown-menu'
import { Web3Status } from './web3-status'
import { isOnMorphHolesky, switchToMorphHolesky, MOCK_USDT_ADDRESS } from '@/lib/web3'
import { ethers } from 'ethers'

export function ConnectWallet() {
  const [mounted, setMounted] = useState(false)
  const { login, logout, authenticated, user, ready } = usePrivy()
  const [minting, setMinting] = useState(false)
  const [networkSwitching, setNetworkSwitching] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-switch to Morph Holesky when wallet connects
  useEffect(() => {
    const checkAndSwitchNetwork = async () => {
      if (!authenticated || !user?.wallet) return
      
      try {
        setNetworkSwitching(true)
        const ethereum = (window as any).ethereum as any
        if (!ethereum) return

        const onMorph = await isOnMorphHolesky(ethereum)
        if (!onMorph) {
          console.log('Switching to Morph Holesky network...')
          await switchToMorphHolesky(ethereum)
          console.log('Successfully switched to Morph Holesky network')
        }
      } catch (error) {
        console.error('Failed to switch network:', error)
        // Don't show alert here as it might be too intrusive
      } finally {
        setNetworkSwitching(false)
      }
    }

    checkAndSwitchNetwork()
  }, [authenticated, user?.wallet])

  // Listen for network changes and auto-switch if needed
  useEffect(() => {
    if (!authenticated || !user?.wallet) return

    const ethereum = (window as any).ethereum as any
    if (!ethereum) return

    const handleNetworkChange = async () => {
      try {
        const onMorph = await isOnMorphHolesky(ethereum)
        if (!onMorph) {
          console.log('Network changed, switching back to Morph Holesky...')
          setNetworkSwitching(true)
          await switchToMorphHolesky(ethereum)
          console.log('Successfully switched back to Morph Holesky network')
        }
      } catch (error) {
        console.error('Failed to switch network on change:', error)
      } finally {
        setNetworkSwitching(false)
      }
    }

    // Listen for chainId changes
    ethereum.on('chainChanged', handleNetworkChange)

    return () => {
      ethereum.removeListener('chainChanged', handleNetworkChange)
    }
  }, [authenticated, user?.wallet])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Handler for minting 100 USDT
  const handleMintUSDT = async () => {
    if (!user?.wallet?.address) return
    setMinting(true)
    try {
      // Type as 'any' because window.ethereum is injected by wallet providers
      const ethereum = (window as any).ethereum as any
      if (!ethereum) throw new Error('No wallet provider found')
      // Check network
      const onMorph = await isOnMorphHolesky(ethereum)
      if (!onMorph) {
        await switchToMorphHolesky(ethereum)
      }
      // Call mint/faucet (assume public mint(address,uint256) exists)
      const provider = new ethers.BrowserProvider(ethereum)
      const signer = await provider.getSigner()
      const usdt = new ethers.Contract(
        MOCK_USDT_ADDRESS,
        ["function mint(address to, uint256 amount) public"],
        signer
      )
      console.log("usdt",usdt)
      // Mint 100 USDT (100 * 1e6)
      const tx = await usdt.mint(user.wallet.address, 100 * 1e6)
      console.log("wallet address",user.wallet.address)
      await tx.wait()
      alert('100 USDT minted to your wallet! Please refresh the balance in the dropdown.')
    } catch (err: unknown) {
      const error = err as Error
      alert(error?.message || 'Mint failed')
    } finally {
      setMinting(false)
    }
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || !ready) {
    return (
      <div className="flex items-center gap-2">
        <InteractiveButton variant="outline" size="sm" disabled>
         <div className="flex items-center">
         <Wallet className="w-4 h-4 mr-2" />
         Loading...
         </div>
        </InteractiveButton>
      </div>
    )
  }

  if (authenticated && user?.wallet) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-soft/60 hover:bg-accent/80 text-primary font-mono text-sm font-medium-modern transition-colors">
              {formatAddress(user.wallet.address)}
              {networkSwitching && (
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              )}
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-0 rounded-xl border-soft shadow-xl bg-white/90">
            <div className="p-4 pb-2">
              <Web3Status />
            </div>
            <DropdownMenuSeparator />
            <div className="p-4 pt-2 flex flex-col gap-2">
              <InteractiveButton
                variant="floating"
                size="md"
                className="w-full"
                onClick={handleMintUSDT}
                disabled={minting || networkSwitching}
              >
                {minting ? 'Minting...' : networkSwitching ? 'Switching Network...' : 'Get 100 USDT'}
              </InteractiveButton>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <InteractiveButton
          variant="outline"
          size="sm"
          onClick={logout}
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
        </InteractiveButton>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <InteractiveButton
        variant="outline"
        size="sm"
        onClick={login}
      >
        <div className="flex items-center">
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
        </div>
      </InteractiveButton>
    </div>
  )
} 