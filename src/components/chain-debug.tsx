"use client"

import { usePrivy } from '@privy-io/react-auth'
import { morphHolesky } from '@/lib/chains'
import { useEffect, useState } from 'react'

export function ChainDebug() {
  const [mounted, setMounted] = useState(false)
  const { authenticated, user, ready } = usePrivy()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !ready) {
    return <div>Loading...</div>
  }

  return (
    <div className="card-modern p-4 text-sm">
      <h4 className="font-semibold-modern text-primary mb-2">Privy Debug Info</h4>
      <div className="space-y-1">
        <div>
          <span className="text-secondary">Authenticated: </span>
          <span className="text-primary">{authenticated ? 'Yes' : 'No'}</span>
        </div>
        <div>
          <span className="text-secondary">Expected Chain ID: </span>
          <span className="text-primary">{morphHolesky.id}</span>
        </div>
        <div>
          <span className="text-secondary">Wallet Address: </span>
          <span className="text-primary">
            {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 'None'}
          </span>
        </div>
        <div>
          <span className="text-secondary">Login Methods: </span>
          <span className="text-primary">
            {user?.linkedAccounts?.map(acc => acc.type).join(', ') || 'None'}
          </span>
        </div>
        <div>
          <span className="text-secondary">Ready: </span>
          <span className="text-primary">{ready ? 'Yes' : 'No'}</span>
        </div>
      </div>
    </div>
  )
} 