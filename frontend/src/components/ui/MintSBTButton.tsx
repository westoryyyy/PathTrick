'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { BrowserProvider, Contract, formatEther } from 'ethers';
import { useReadContract } from 'wagmi';
import pathtrickSbtAbi from '../../../integration/PathtrickSBT.abi.json';
import {
  BNB_TESTNET_CHAIN,
  PATHTRICK_SBT_ABI,
  PATHTRICK_SBT_ADDRESS,
  API_BASE_URL,
  getApiError,
  readApiResponse,
} from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';
import CertificateActions from './CertificateActions';
import type { CertificatePdfData } from '@/lib/certificatePdf';

type MintStatus = 'idle' | 'preparing' | 'pending' | 'confirming' | 'success' | 'error';

interface MintSBTButtonProps {
  courseId: number;
  customStyle?: React.CSSProperties;
  onSuccess?: () => void;
  /** Called once when the certificate is found to be already minted on-chain (no XP side effects). */
  onAlreadyMinted?: () => void;
  /** Data for the PDF. When provided, minted state shows LIHAT PDF + LIHAT DI BSCSCAN. */
  certificate?: CertificatePdfData;
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
  if (normalized.includes('failed to fetch') || normalized.includes('fetch failed')) {
    return 'Gagal terhubung ke wallet!';
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
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
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

export default function MintSBTButton({ courseId, customStyle, onSuccess, onAlreadyMinted, certificate }: MintSBTButtonProps) {
  const { wallets } = useWallets();
  const { linkWallet } = usePrivy();
  const [status, setStatus] = useState<MintStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [modalCenter, setModalCenter] = useState({ x: 0, y: 0 });
  const [mintedTxHash, setMintedTxHash] = useState<string | undefined>();
  const alreadyMintedNotified = useRef(false);

  const holderAddress = wallets[0]?.address as `0x${string}` | undefined;

  // Source of truth: is this certificate already recorded on-chain for the connected wallet?
  const {
    data: hasCertificateOnChain,
    isLoading: isCheckingChain,
    refetch: refetchHasCertificate,
  } = useReadContract({
    address: PATHTRICK_SBT_ADDRESS,
    abi: PATHTRICK_SBT_ABI,
    functionName: 'hasCertificate',
    args: holderAddress ? [holderAddress, BigInt(courseId)] : undefined,
    chainId: BNB_TESTNET_CHAIN.id,
    query: { enabled: Boolean(holderAddress) },
  });

  const isMinted = Boolean(mintedTxHash) || hasCertificateOnChain === true;

  useEffect(() => {
    if (hasCertificateOnChain === true && !mintedTxHash && !alreadyMintedNotified.current) {
      alreadyMintedNotified.current = true;
      onAlreadyMinted?.();
    }
  }, [hasCertificateOnChain, mintedTxHash, onAlreadyMinted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'error' || status === 'success') {
      const rect = buttonRef.current?.getBoundingClientRect();
      setModalCenter({
        x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
        y: window.innerHeight / 2 // Center vertically on the screen, not over the button
      });
    }
  }, [status]);

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
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ courseId: String(courseId), txHash: transaction.hash }),
      });
      const confirmationData = await readApiResponse(confirmation);
      if (!confirmation.ok) {
        const detail = !Array.isArray(confirmationData) && typeof confirmationData.message === 'string' ? confirmationData.message : '';
        throw new Error(detail || getApiError(confirmationData, 'Backend belum menerima konfirmasi transaksi.'));
      }

      setStatus('success');
      setMintedTxHash(transaction.hash);
      setSuccessMessage(`Sertifikat berhasil tercatat di blockchain. Tx: ${transaction.hash.slice(0, 10)}...`);
      onSuccess?.();
      void refetchHasCertificate();
    } catch (error) {
      console.error('Certificate mint failed:', error);
      if (getErrorText(error).toLowerCase().includes('alreadycertified')) {
        // Already on-chain: switch to the minted view instead of showing an error.
        setStatus('idle');
        void refetchHasCertificate();
        return;
      }
      setStatus('error');
      setErrorMessage(getErrorMessage(error));
    }
  };

  const isBusy = status === 'preparing' || status === 'pending' || status === 'confirming';

  const getBtnStyles = () => {
    if (status === 'error') {
      return {
        color: '#fee2e2',
        background: '#dc2626',
        border: '3px solid #991b1b',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), 0 5px 0 #7f1d1d, 1px 6px 0 #7f1d1d, -1px 6px 0 #7f1d1d',
      };
    }
    if (status === 'success') {
      return {
        color: '#dcfce7',
        background: '#16a34a',
        border: '3px solid #14532d',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), 0 5px 0 #14532d, 1px 6px 0 #14532d, -1px 6px 0 #14532d',
      };
    }
    return {
      color: '#1a3d1a',
      background: '#5cb85c',
      border: '3px solid #2d6e2d',
      boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), 0 5px 0 #1e4e1e, 1px 6px 0 #1e4e1e, -1px 6px 0 #1e4e1e',
    };
  };

  const dynamicStyles = getBtnStyles();

  const buttonStyle: React.CSSProperties = {
    fontFamily: '"Pixelify Sans", sans-serif',
    fontSize: '1.3rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: dynamicStyles.color,
    background: dynamicStyles.background,
    border: dynamicStyles.border,
    borderRadius: '4px',
    padding: '14px 32px',
    cursor: isBusy || status === 'success' ? 'not-allowed' : 'pointer',
    textShadow: '1px 1px 0 rgba(255,255,255,0.3)',
    boxShadow: dynamicStyles.boxShadow,
    textTransform: 'uppercase',
    textDecoration: 'none',
    opacity: isBusy ? 0.75 : 1,
    ...customStyle,
  };

  if (!wallets.length) {
    return (
      <button
        ref={buttonRef}
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

  const label = status === 'preparing' ? 'MENYIAPKAN...' :
    status === 'pending' ? 'MENUNGGU WALLET...' :
      status === 'confirming' ? 'MENGKONFIRMASI...' :
        isCheckingChain ? 'MEMERIKSA BLOCKCHAIN...' :
          status === 'error' ? 'GAGAL - COBA LAGI' : 'CETAK SERTIFIKAT';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {isMinted ? (
        certificate ? (
          <CertificateActions certificate={certificate} holderAddress={holderAddress} txHash={mintedTxHash} />
        ) : (
          <button ref={buttonRef} disabled style={{ ...buttonStyle, cursor: 'default' }}>
            ✓ TERCATAT DI BLOCKCHAIN
          </button>
        )
      ) : (
        <button ref={buttonRef} onClick={handleMint} disabled={isBusy || isCheckingChain} style={buttonStyle}>
          {label}
        </button>
      )}
      {mounted && status === 'error' && createPortal(
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 99999
        }} onClick={() => setStatus('idle')}>
          <div style={{
            position: 'absolute',
            left: `${modalCenter.x}px`,
            top: `${modalCenter.y}px`,
            transform: 'translate(-50%, -50%)',
            padding: '24px 32px',
            color: '#fee2e2',
            background: '#b91c1c',
            border: '4px solid #7f1d1d',
            borderRadius: '4px',
            fontFamily: '"Pixelify Sans", sans-serif',
            fontSize: '1.2rem',
            fontWeight: '700',
            lineHeight: 1.5,
            textShadow: '1px 1px 0 rgba(0,0,0,0.3)',
            textAlign: 'center',
            boxShadow: '0 6px 0 #7f1d1d, 0 10px 20px rgba(0,0,0,0.5)',
            maxWidth: '400px',
            width: 'max-content'
          }} onClick={(e) => e.stopPropagation()}>
            <p style={{ margin: '0 0 16px 0' }}>{errorMessage}</p>
            <button 
              onClick={() => setStatus('idle')}
              style={{
                fontFamily: '"Pixelify Sans", sans-serif',
                fontSize: '1.1rem',
                fontWeight: '700',
                padding: '8px 24px',
                background: '#fee2e2',
                color: '#7f1d1d',
                border: '3px solid #7f1d1d',
                borderRadius: '4px',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #7f1d1d'
              }}
            >
              TUTUP
            </button>
          </div>
        </div>,
        document.body
      )}
      {mounted && status === 'success' && createPortal(
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 99999
        }} onClick={() => setStatus('idle')}>
          <div style={{
            position: 'absolute',
            left: `${modalCenter.x}px`,
            top: `${modalCenter.y}px`,
            transform: 'translate(-50%, -50%)',
            padding: '24px 32px',
            color: '#dcfce7',
            background: '#16a34a',
            border: '4px solid #14532d',
            borderRadius: '4px',
            fontFamily: '"Pixelify Sans", sans-serif',
            fontSize: '1.2rem',
            fontWeight: '700',
            lineHeight: 1.5,
            textShadow: '1px 1px 0 rgba(0,0,0,0.3)',
            textAlign: 'center',
            boxShadow: '0 6px 0 #14532d, 0 10px 20px rgba(0,0,0,0.5)',
            maxWidth: '400px',
            width: 'max-content'
          }} onClick={(e) => e.stopPropagation()}>
            <p style={{ margin: '0 0 16px 0' }}>{successMessage}</p>
            <button 
              onClick={() => setStatus('idle')}
              style={{
                fontFamily: '"Pixelify Sans", sans-serif',
                fontSize: '1.1rem',
                fontWeight: '700',
                padding: '8px 24px',
                background: '#dcfce7',
                color: '#14532d',
                border: '3px solid #14532d',
                borderRadius: '4px',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #14532d'
              }}
            >
              OK
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
