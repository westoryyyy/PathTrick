'use client';

import React, { useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { BrowserProvider, parseEther, Contract } from 'ethers';

// Fallback ABI just in case the JSON is missing
const fallbackAbi = [
  "function mintCertificate(uint256 courseId, bytes signature) public payable"
];

interface MintSBTButtonProps {
  courseId: number;
}

export default function MintSBTButton({ courseId }: MintSBTButtonProps) {
  const { wallets } = useWallets();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleMint = async () => {
    try {
      setStatus('loading');
      setErrorMessage('');

      // 1. Get the embedded wallet from Privy
      const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy');
      if (!embeddedWallet) {
        throw new Error('No embedded wallet found. Please connect your wallet first.');
      }

      // 2. Ensure network is BNB Testnet (Chain ID 97)
      const targetChainId = process.env.NEXT_PUBLIC_CHAIN_ID || '97';
      const targetChainIdHex = `0x${parseInt(targetChainId).toString(16)}`;
      
      if (embeddedWallet.chainId !== targetChainId) {
        try {
          await embeddedWallet.switchChain(parseInt(targetChainId));
        } catch (switchError) {
          console.log("Switch chain error (might not be added):", switchError);
          // If the network is not added, we'd ideally add it here.
          // For simplicity, we just throw for now.
          throw new Error(`Please switch your wallet network to BNB Testnet (Chain ID ${targetChainId}).`);
        }
      }

      // 3. Request EIP-712 Signature from our backend
      const sigResponse = await fetch('/api/claim-sbt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: embeddedWallet.address, courseId }),
      });
      const sigData = await sigResponse.json();

      if (!sigResponse.ok) {
        throw new Error(sigData.error || 'Failed to get signature from AI Backend.');
      }

      const { signature } = sigData;

      // 4. Initialize Ethers provider & signer using Privy's EIP1193 provider
      const provider = await embeddedWallet.getEthereumProvider();
      const ethersProvider = new BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      // Load ABI
      let abi = fallbackAbi;
      try {
        const PathtrickABI = require('@/abis/PathtrickSBT.abi.json');
        abi = PathtrickABI.abi || fallbackAbi;
      } catch (e) {
        console.warn('ABI JSON not found, using fallback ABI string.', e);
      }

      // 5. Connect to Smart Contract and Mint
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error('Contract address not configured in environment variables.');
      }

      const contract = new Contract(contractAddress, abi, signer);
      const mintPrice = process.env.NEXT_PUBLIC_MINT_PRICE || '0.005';

      // Send transaction: mintCertificate(courseId, signature)
      const tx = await contract.mintCertificate(courseId, signature, {
        value: parseEther(mintPrice),
      });

      // Wait for transaction to be mined
      await tx.wait();

      setStatus('success');
      alert(`🎉 SBT Successfully Minted! Transaction Hash: ${tx.hash}`);

    } catch (error: any) {
      console.error('Minting error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred during minting.');
      alert(`❌ Minting Failed: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <button
        onClick={handleMint}
        disabled={status === 'loading' || status === 'success'}
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '0.8rem',
          color: '#fff',
          background: status === 'success' ? '#10b981' : (status === 'loading' ? '#9ca3af' : '#b91c1c'),
          border: '4px solid #7f1d1d',
          padding: '16px 24px',
          cursor: (status === 'loading' || status === 'success') ? 'not-allowed' : 'pointer',
          boxShadow: '4px 4px 0 #3b261b',
          transition: 'transform 0.1s',
          textShadow: '1px 1px 0 #000',
        }}
        onMouseDown={(e) => {
          if (status !== 'loading' && status !== 'success') {
            e.currentTarget.style.transform = 'translate(2px, 2px)';
            e.currentTarget.style.boxShadow = '2px 2px 0 #3b261b';
          }
        }}
        onMouseUp={(e) => {
          if (status !== 'loading' && status !== 'success') {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '4px 4px 0 #3b261b';
          }
        }}
      >
        {status === 'idle' && '🛡️ MINT SBT (0.005 BNB)'}
        {status === 'loading' && '⏳ PROCESSING...'}
        {status === 'success' && '✅ SBT CLAIMED!'}
        {status === 'error' && '❌ MINT FAILED - RETRY'}
      </button>

      {status === 'error' && errorMessage && (
        <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '0.5rem', color: '#ef4444', marginTop: '8px' }}>
          {errorMessage}
        </span>
      )}
    </div>
  );
}
