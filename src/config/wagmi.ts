import { createConfig } from '@privy-io/wagmi';
import { bscTestnet, bsc, mainnet } from 'viem/chains';
import { http } from 'wagmi';

export const wagmiConfig = createConfig({
  chains: [bscTestnet, bsc, mainnet],
  transports: {
    [bscTestnet.id]: http(),
    [bsc.id]: http(),
    [mainnet.id]: http(),
  },
});
