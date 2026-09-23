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
  customStyle?: React.CSSProperties;
  onSuccess?: () => void;
}

export default function MintSBTButton({ courseId, customStyle, onSuccess }: MintSBTButtonProps) {
  const { wallets } = useWallets();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleMint = async () => {
    try {
      setStatus('loading');
      setErrorMessage('');

      // 1. Get the active wallet from Privy
      const activeWallet = wallets[0];
      if (!activeWallet) {
        throw new Error('No wallet found. Please connect your wallet first.');
      }

      // 2. Ensure network is BNB Testnet (Chain ID 97)
      // NOTE: Privy wallet.chainId returns 'eip155:97' format, not just '97'
      const targetChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '97');
      const walletChainId = parseInt(activeWallet.chainId.split(':').pop() || '0');
      
      if (walletChainId !== targetChainId) {
        try {
          await activeWallet.switchChain(targetChainId);
        } catch (switchError) {
          console.log("Switch chain error:", switchError);
          throw new Error(`Please switch your wallet network to BNB Testnet (Chain ID ${targetChainId}).`);
        }
      }

      // 3. Request EIP-712 Signature from our backend
      const sigResponse = await fetch('/api/claim-sbt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: activeWallet.address, courseId }),
      });
      const sigData = await sigResponse.json();

      if (!sigResponse.ok) {
        throw new Error(sigData.error || 'Failed to get signature from AI Backend.');
      }

      const { signature } = sigData;

      // 4. Initialize Ethers provider & signer using Privy's EIP1193 provider
      const provider = await activeWallet.getEthereumProvider();
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
      setSuccessMessage(`Berhasil Minting! Hash: ${tx.hash.substring(0, 10)}...`);
      onSuccess?.();

    } catch (error: any) {
      console.error('Minting error:', error);
      setStatus('error');
      
      let displayMsg = 'Terjadi kesalahan saat minting.';
      if (error.code === 'ACTION_REJECTED' || error.message?.includes('user rejected')) {
        displayMsg = 'Transaksi dibatalkan oleh user.';
      } else if (error.message) {
        const msg = error.message.toLowerCase();
        if (msg.includes('0x8baa579f') || msg.includes('invalidsignature')) {
          displayMsg = 'Invalid Signature: Coba refresh dan ulangi.';
        } else if (msg.includes('0xa45675fe') || msg.includes('alreadycertified')) {
          displayMsg = 'SBT sudah pernah diklaim untuk modul ini.';
        } else if (msg.includes('0x31a5d181') || msg.includes('incorrectmintfee')) {
          displayMsg = 'Biaya Minting tidak sesuai.';
        } else if (msg.includes('insufficient funds')) {
          displayMsg = 'Saldo BNB Testnet tidak cukup.';
        } else {
          displayMsg = 'Transaksi ditolak oleh Smart Contract.';
        }
      }
      setErrorMessage(displayMsg);
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
          background: '#1d4ed8',
          border: 'none',
          padding: '16px 24px',
          cursor: (status === 'loading' || status === 'success') ? 'not-allowed' : 'pointer',
          boxShadow: '4px 4px 0 #3b261b',
          transition: 'transform 0.1s',
          textShadow: '1px 1px 0 #000',
          ...customStyle,
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

      {/* 16-bit Error Message Box */}
      {status === 'error' && errorMessage && (
        <div style={{
          background: '#7f1d1d',
          border: '2px solid #450a0a',
          padding: '12px',
          borderRadius: '4px',
          boxShadow: 'inset 0 0 0 2px #ef4444, 2px 2px 0 #3b261b',
          imageRendering: 'pixelated',
          marginTop: '4px'
        }}>
          <p style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '0.5rem', color: '#fecaca', lineHeight: '1.6', margin: 0 }}>
            {errorMessage}
          </p>
        </div>
      )}

      {/* 16-bit Success Message Box */}
      {status === 'success' && successMessage && (
        <div style={{
          background: '#14532d',
          border: '2px solid #052e16',
          padding: '12px',
          borderRadius: '4px',
          boxShadow: 'inset 0 0 0 2px #22c55e, 2px 2px 0 #3b261b',
          imageRendering: 'pixelated',
          marginTop: '4px'
        }}>
          <p style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '0.5rem', color: '#bbf7d0', lineHeight: '1.6', margin: 0 }}>
            {successMessage}
          </p>
        </div>
      )}
    </div>
  );
}
