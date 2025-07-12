import { createConfig, configureChains } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'
import { publicProvider } from 'wagmi/providers/public'
import { morphHolesky } from './chains'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [morphHolesky, mainnet, sepolia],
  [publicProvider()]
)

export const config = createConfig({
  autoConnect: true,
  connectors: [
    metaMask({ chains }),
  ],
  publicClient,
  webSocketPublicClient,
}) 