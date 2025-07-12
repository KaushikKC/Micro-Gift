"use client"

import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'

export function Web3Status() {
  const [mounted, setMounted] = useState(false)
  const { authenticated, user, ready } = usePrivy()

  useEffect(() => {
    setMounted(true)
  }, [])

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
      </div>
    </div>
  )
} 