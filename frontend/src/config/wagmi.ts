import { createConfig } from '@privy-io/wagmi';
import { bscTestnet } from 'viem/chains';
import { http } from 'wagmi';

export const wagmiConfig = createConfig({
  chains: [bscTestnet],
  transports: {
    [bscTestnet.id]: http(
      process.env.NEXT_PUBLIC_BNB_TESTNET_RPC_URL ||
        'https://data-seed-prebsc-1-s1.binance.org:8545'
    ),
  },
});
