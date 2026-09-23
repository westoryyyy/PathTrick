import { createConfig } from '@privy-io/wagmi';
import { bscTestnet } from 'viem/chains';
import { http } from 'wagmi';

export const wagmiConfig = createConfig({
  chains: [bscTestnet],
  transports: {
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.bnbchain.org:8545'),
  },
});
