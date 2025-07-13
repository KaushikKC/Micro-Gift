"use client"

import { usePrivy } from '@privy-io/react-auth'
import { InteractiveButton } from './interactive-button'
import { Wallet, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ConnectWallet() {
  const [mounted, setMounted] = useState(false)
  const { login, logout, authenticated, user, ready } = usePrivy()

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
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
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-sm text-secondary">
            {formatAddress(user.wallet.address)}
          </span>
          <span className="text-xs text-muted">
            Connected Wallet
          </span>
        </div>
        
        <InteractiveButton
          variant="outline"
          size="sm"
          onClick={logout}
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