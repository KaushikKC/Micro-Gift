"use client"

import { PrivyProvider } from '@privy-io/react-auth'
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector'
import { configureChains } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { morphHolesky } from '@/lib/chains'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [morphHolesky, mainnet, sepolia],
  [publicProvider()]
)

export function PrivyWagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'YOUR_PRIVY_APP_ID'}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#6366f1',
          showWalletLoginFirst: true,
        },
        supportedChains: [morphHolesky, mainnet, sepolia],
      }}
    >
      <PrivyWagmiConnector wagmiChainsConfig={{ chains, publicClient, webSocketPublicClient }}>
        {children}
      </PrivyWagmiConnector>
    </PrivyProvider>
  )
} 