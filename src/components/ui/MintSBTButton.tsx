'use client';

import React, { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { BrowserProvider, Contract, formatEther } from 'ethers';
import pathtrickSbtAbi from '../../../integration/PathtrickSBT.abi.json';
import {
  BNB_TESTNET_CHAIN,
  PATHTRICK_SBT_ADDRESS,
  API_BASE_URL,
  getApiError,
  readApiResponse,
} from '@/config/pathtrick';

type MintStatus = 'idle' | 'preparing' | 'pending' | 'confirming' | 'success' | 'error';

interface MintSBTButtonProps {
  courseId: number;
  customStyle?: React.CSSProperties;
  onSuccess?: () => void;
}

interface MintAuthorization {
  courseId: string;
  nonce: string;
  deadline: string;
  signature: `0x${string}`;
}

function getErrorMessage(error: unknown): string {
  const message = getErrorText(error);
  const normalized = message.toLowerCase();

  if (
    (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: unknown }).code === 4001) ||
    normalized.includes('user rejected') ||
    normalized.includes('action_rejected')
  ) {
    return 'Transaksi dibatalkan oleh user.';
  }
  if (normalized.includes('insufficient funds')) {
    return 'Saldo tBNB tidak cukup untuk mint dan gas.';
  }
  if (normalized.includes('wrong network') || normalized.includes('chain')) {
    return 'Hubungkan wallet ke BNB Smart Chain Testnet (Chain ID 97).';
  }
  if (normalized.includes('incorrectmintfee')) {
    return 'Biaya mint berubah. Silakan coba lagi.';
  }
  if (normalized.includes('alreadycertified')) {
    return 'Sertifikat untuk course ini sudah pernah dicetak.';
  }
  if (normalized.includes('invalidsignature')) {
    return 'Otorisasi mint tidak valid. Otorisasi baru akan diminta saat mencoba lagi.';
  }
  if (normalized.includes('signatureexpired')) {
    return 'Otorisasi mint kedaluwarsa. Otorisasi baru akan diminta saat mencoba lagi.';
  }

  return message || 'Mint gagal. Silakan coba lagi.';
}

function getErrorText(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (typeof error !== 'object' || error === null) return String(error);

  const details = error as {
    message?: unknown;
    reason?: unknown;
    shortMessage?: unknown;
    code?: unknown;
    info?: { error?: { message?: unknown } };
    cause?: unknown;
  };
  return [
    details.message,
    details.reason,
    details.shortMessage,
    details.code,
    details.info?.error?.message,
    details.cause ? getErrorText(details.cause) : '',
  ]
    .filter((value): value is string | number => typeof value === 'string' || typeof value === 'number')
    .join(' ');
}

async function requestMintAuthorization(courseId: number): Promise<MintAuthorization> {
  const response = await fetch(`${API_BASE_URL}/api/certificates/prepare-mint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ courseId: String(courseId) }),
  });
  const data = await readApiResponse(response);
  if (!response.ok) throw new Error(getApiError(data, 'Gagal menyiapkan otorisasi mint.'));
  if (
    Array.isArray(data) ||
    typeof data.courseId !== 'string' ||
    typeof data.nonce !== 'string' ||
    typeof data.deadline !== 'string' ||
    typeof data.signature !== 'string' ||
    !/^0x[0-9a-f]+$/i.test(data.signature)
  ) {
    throw new Error('Respons otorisasi mint tidak lengkap.');
  }
  return data as unknown as MintAuthorization;
}

export default function MintSBTButton({ courseId, customStyle, onSuccess }: MintSBTButtonProps) {
  const { wallets } = useWallets();
  const { linkWallet } = usePrivy();
  const [status, setStatus] = useState<MintStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setIsConnectingWallet(true);
      await linkWallet();
    } catch (error) {
      setStatus('error');
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleMint = async () => {
    const activeWallet = wallets[0];
    if (!activeWallet) {
      setStatus('error');
      setErrorMessage('Hubungkan wallet terlebih dahulu.');
      return;
    }

    try {
      setStatus('preparing');
      setErrorMessage('');
      setSuccessMessage('');

      const walletChainId = Number(activeWallet.chainId.split(':').pop());
      if (walletChainId !== BNB_TESTNET_CHAIN.id) {
        await activeWallet.switchChain(BNB_TESTNET_CHAIN.id);
      }

      const provider = await activeWallet.getEthereumProvider();
      const ethersProvider = new BrowserProvider(provider);
      const network = await ethersProvider.getNetwork();
      if (Number(network.chainId) !== BNB_TESTNET_CHAIN.id) {
        throw new Error('Wrong network: BNB Smart Chain Testnet is required.');
      }

      const authorization = await requestMintAuthorization(courseId);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(
        PATHTRICK_SBT_ADDRESS,
        pathtrickSbtAbi.abi as unknown as ConstructorParameters<typeof Contract>[1],
        signer
      );
      const mintPrice = await contract.mintPrice();
      const balance = await ethersProvider.getBalance(activeWallet.address);
      const sendMintTransaction = async (mintAuthorization: MintAuthorization) => {
        const gasLimit = await contract.mintCertificate.estimateGas(
          BigInt(mintAuthorization.courseId),
          BigInt(mintAuthorization.deadline),
          mintAuthorization.signature,
          { value: mintPrice }
        );
        const feeData = await ethersProvider.getFeeData();
        const estimatedGasCost = gasLimit * (feeData.maxFeePerGas || feeData.gasPrice || BigInt(0));
        if (balance < mintPrice + estimatedGasCost) {
          throw new Error(`Insufficient funds. Mint price is ${formatEther(mintPrice)} tBNB plus gas.`);
        }
        return contract.mintCertificate(
          BigInt(mintAuthorization.courseId),
          BigInt(mintAuthorization.deadline),
          mintAuthorization.signature,
          { value: mintPrice }
        );
      };

      setStatus('pending');
      let transaction;
      try {
        transaction = await sendMintTransaction(authorization);
      } catch (error) {
        const message = getErrorText(error).toLowerCase();
        if (!message.includes('invalidsignature') && !message.includes('signatureexpired')) {
          throw error;
        }
        const refreshedAuthorization = await requestMintAuthorization(courseId);
        transaction = await sendMintTransaction(refreshedAuthorization);
      }
      const receipt = await transaction.wait();
      if (!receipt) {
        throw new Error('Receipt transaksi tidak tersedia.');
      }

      const certificateEvent = receipt.logs
        .map((log: unknown) => {
          try {
            return contract.interface.parseLog(log as Parameters<typeof contract.interface.parseLog>[0]);
          } catch {
            return null;
          }
        })
        .find((parsed: { name?: string } | null) => parsed?.name === 'CertificateMinted');

      if (!certificateEvent) {
        throw new Error('Transaksi berhasil, tetapi event CertificateMinted tidak ditemukan.');
      }

      const mintedCourseId = certificateEvent.args?.courseId;
      const mintedTo = certificateEvent.args?.to;
      if (
        mintedCourseId === undefined ||
        mintedCourseId !== BigInt(courseId) ||
        typeof mintedTo !== 'string' ||
        mintedTo.toLowerCase() !== activeWallet.address.toLowerCase()
      ) {
        throw new Error('Event CertificateMinted memiliki course yang tidak valid.');
      }

      setStatus('confirming');
      const confirmation = await fetch(`${API_BASE_URL}/api/certificates/confirm-mint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ courseId: String(courseId), txHash: transaction.hash }),
      });
      const confirmationData = await readApiResponse(confirmation);
      if (!confirmation.ok) {
        throw new Error(getApiError(confirmationData, 'Backend belum menerima konfirmasi transaksi.'));
      }

      setStatus('success');
      setSuccessMessage(`Sertifikat berhasil dicetak. Tx: ${transaction.hash.slice(0, 10)}...`);
      onSuccess?.();
    } catch (error) {
      console.error('Certificate mint failed:', error);
      setStatus('error');
      setErrorMessage(getErrorMessage(error));
    }
  };

  const isBusy = status === 'preparing' || status === 'pending' || status === 'confirming';
  const buttonStyle: React.CSSProperties = {
    fontFamily: 'var(--font-pixel), "Press Start 2P", monospace',
    fontSize: '0.65rem',
    lineHeight: 1.6,
    color: '#fff7ed',
    background: status === 'success' ? '#4d7c0f' : status === 'error' ? '#b91c1c' : '#d97706',
    border: '4px solid #3b261b',
    borderRadius: '6px',
    padding: '14px 20px',
    cursor: isBusy || status === 'success' ? 'not-allowed' : 'pointer',
    textShadow: '2px 2px 0 #3b261b',
    boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.3), 0 5px 0 #3b261b',
    imageRendering: 'pixelated',
    opacity: isBusy ? 0.75 : 1,
    ...customStyle,
  };

  if (!wallets.length) {
    return (
      <button
        onClick={handleConnectWallet}
        disabled={isConnectingWallet}
        style={{
          ...buttonStyle,
          opacity: isConnectingWallet ? 0.75 : 1,
        }}
      >
        {isConnectingWallet ? 'CONNECTING WALLET...' : 'CONNECT WALLET'}
      </button>
    );
  }

  const label = status === 'preparing' ? 'PREPARING MINT...' :
    status === 'pending' ? 'WAITING FOR WALLET...' :
    status === 'confirming' ? 'CONFIRMING...' :
    status === 'success' ? 'CERTIFICATE MINTED' :
    status === 'error' ? 'MINT FAILED - RETRY' : 'MINT CERTIFICATE';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <button onClick={handleMint} disabled={isBusy || status === 'success'} style={buttonStyle}>
        {label}
      </button>
      {status === 'error' && (
        <p role="alert" style={{
          margin: 0,
          padding: '10px 12px',
          color: '#fecaca',
          background: '#7f1d1d',
          border: '3px solid #450a0a',
          borderRadius: '4px',
          fontFamily: 'var(--font-pixel), "Press Start 2P", monospace',
          fontSize: '0.5rem',
          lineHeight: 1.7,
          textShadow: '1px 1px 0 #450a0a',
        }}>
          {errorMessage}
        </p>
      )}
      {status === 'success' && (
        <p role="status" style={{
          margin: 0,
          padding: '10px 12px',
          color: '#d9f99d',
          background: '#365314',
          border: '3px solid #1a2e05',
          borderRadius: '4px',
          fontFamily: 'var(--font-pixel), "Press Start 2P", monospace',
          fontSize: '0.5rem',
          lineHeight: 1.7,
          textShadow: '1px 1px 0 #1a2e05',
        }}>
          {successMessage}
        </p>
      )}
    </div>
  );
}
