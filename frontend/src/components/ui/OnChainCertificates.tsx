'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './OnChainCertificates.module.css';
import { useMapStore } from '@/store/useMapStore';
import { useAccount, useReadContracts } from 'wagmi';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useUserStore } from '@/store/useUserStore';
import MintSBTButton from './MintSBTButton';
import CertificatePreview from './CertificatePreview';
import { PATHTRICK_SBT_ABI, PATHTRICK_SBT_ADDRESS, API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';
import { useTranslation } from '@/hooks/useTranslation';
import { PixelSkeletonTileGrid } from './PixelSkeleton';

type Props = {
  hideHeader?: boolean;
};

// Helper to convert chapter ID string to uint256-compatible number for SBT Minting
const generateCourseId = (str: string) => {
  // Badges from /api/badges already carry the numeric on-chain course id; use as-is.
  if (/^[0-9]+$/.test(str)) return Number(str);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export default function OnChainCertificates({ hideHeader = false }: Props = {}) {
  const { t } = useTranslation();
  const [bossNodes, setBossNodes] = useState<string[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/badges`, {
          headers: { ...getAuthHeaders() }
        });
        if (res.ok) {
          const data = await res.json();
          // Assuming courseOnChainId maps to a string like 'module-name' in the DB.
          // Adjust logic based on the actual course ID stored in DB.
          setBossNodes(data.badges.map((b: any) => b.courseOnChainId.toString()));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setHasFetched(true);
      }
    };
    fetchBadges();
  }, []);

  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { displayName: savedName } = useUserStore();
  
  const activeWallet = wallets[0];
  const displayName = savedName 
    || user?.google?.name 
    || user?.email?.address?.split('@')[0] 
    || (activeWallet ? `${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}` : 'Scholar');

  const contractAddress = PATHTRICK_SBT_ADDRESS;

  // Prepare batch calls to check SBT ownership
  const contractCalls = useMemo(() => {
    if (!address || !contractAddress) return [];
    return bossNodes.map((nodeId: string) => {
      const baseChapterId = nodeId.replace(/-level-\d+$/, '');
      return {
        address: contractAddress,
        abi: PATHTRICK_SBT_ABI,
        functionName: 'hasCertificate',
        args: [address, BigInt(generateCourseId(baseChapterId))],
      };
    });
  }, [bossNodes, address, contractAddress]);

  const {
    data: sbtOwnershipResults,
    error: ownershipError,
    isLoading: isLoadingOwnership,
    refetch,
  } = useReadContracts({
    contracts: contractCalls,
    query: { enabled: contractCalls.length > 0 },
  });

  // Generate earned certificates dynamically based on verified ownership
  const earnedCertificates = useMemo(() => {
    return bossNodes.map((nodeId: string, index: number) => {
      const isMinted = sbtOwnershipResults?.[index]?.result === true;
      const baseChapterId = nodeId.replace(/-level-\d+$/, '');
      const courseId = generateCourseId(baseChapterId);

      const match = nodeId.match(/module-([a-zA-Z0-9-]+?)(?:-bab|-level)/);
      let rawName = match ? match[1] : 'Unknown';
      
      // Clean up names (e.g. 'agriculture-1' -> 'Agriculture', 'html-css' -> 'HTML CSS')
      rawName = rawName.replace(/-\d+$/, '').replace(/-/g, ' ');
      const moduleName = rawName.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      return {
        id: nodeId,
        courseId,
        title: `${moduleName} Mastery`,
        issuer: `House of ${moduleName}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: 'SBT On-Chain',
        isMinted
      };
    });
  }, [bossNodes, sbtOwnershipResults]);

  const handleExplorerClick = (isMinted: boolean) => {
    if (!isMinted || !address) return;
    // Buka BscScan untuk address user (tab ERC-1155 Tokens)
    window.open(`https://testnet.bscscan.com/address/${address}#tokentxnsErc1155`, '_blank');
  };

  const walletShort = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'NOT CONNECTED';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', marginBottom: '32px' }}>
      {!hideHeader && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
            ON-CHAIN CERTIFICATES
          </h2>
          <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#d4d4d8', lineHeight: '1.6' }}>
            Lihat dan verifikasi sertifikat (SBT) yang berhasil kamu dapatkan setelah menaklukkan Boss Modul.
          </p>
        </div>
      )}

      <div className={styles.grid}>
        {!address ? (
          <div style={{ color: '#fbbf24', fontFamily: '"Press Start 2P"', fontSize: '0.7rem', gridColumn: '1 / -1', textAlign: 'center', marginTop: '16px', lineHeight: '1.6', background: 'rgba(0,0,0,0.2)', padding: '24px', border: '2px dashed #5a3a29' }}>
            Hubungkan wallet untuk memuat sertifikat On-Chain.
          </div>
        ) : !hasFetched ? (
          <div style={{ gridColumn: '1 / -1' }}><PixelSkeletonTileGrid count={4} /></div>
        ) : bossNodes.length === 0 ? (
          <div style={{ color: '#d4d4d8', fontFamily: '"Press Start 2P"', fontSize: '0.7rem', gridColumn: '1 / -1', textAlign: 'center', marginTop: '16px', lineHeight: '1.6', background: 'rgba(0,0,0,0.2)', padding: '24px', border: '2px dashed #5a3a29' }}>
            {t('common.noCertificatesDesc')}
          </div>
        ) : isLoadingOwnership ? (
          <div style={{ gridColumn: '1 / -1' }}><PixelSkeletonTileGrid count={Math.max(bossNodes.length, 2)} /></div>
        ) : ownershipError ? (
          <div style={{ color: '#fca5a5', fontFamily: '"Press Start 2P"', fontSize: '0.7rem', gridColumn: '1 / -1', textAlign: 'center', marginTop: '16px', lineHeight: '1.6', background: 'rgba(0,0,0,0.2)', padding: '24px', border: '2px dashed #5a3a29' }}>
            Sertifikat belum dapat dimuat.{' '}
            <button type="button" onClick={() => refetch()} style={{ color: '#fbbf24', textDecoration: 'underline', fontFamily: 'inherit', fontSize: 'inherit', background: 'none', border: 0, cursor: 'pointer' }}>
              Coba lagi
            </button>
          </div>
        ) : earnedCertificates.length > 0 ? (
          earnedCertificates.map((cert: any) => (
            <div key={cert.id} style={{ 
              background: '#c8a96e',
              border: '4px solid #5a3520',
              borderRadius: '4px',
              padding: '4px',
              boxShadow: '4px 4px 0 #3b1f0e, inset 0 0 0 2px #e8c98a',
              imageRendering: 'pixelated',
              marginTop: '8px'
            }}>
              <div style={{
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px', 
                background: '#784626', /* Darker inner wood */
                border: '2px solid #3b1f0e',
                borderRadius: '2px',
                padding: '16px',
                position: 'relative'
              }}>
                {/* Certificate Image Container */}
                <CertificatePreview
                  userName={displayName}
                  moduleName={cert.title}
                  walletAddress={walletShort}
                  date={cert.date}
                  isMinted={cert.isMinted}
                />
              
              {cert.isMinted ? (
                <button 
                  onClick={() => handleExplorerClick(cert.isMinted)}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    fontFamily: '"Press Start 2P"', 
                    fontSize: '0.6rem', 
                    background: '#5cb85c', 
                    border: '4px solid #224a22',
                    borderTopColor: '#98e098',
                    borderLeftColor: '#98e098',
                    color: '#fff', 
                    textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
                    cursor: 'pointer',
                    imageRendering: 'pixelated',
                    transition: 'transform 0.1s'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'translate(2px, 2px)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'none'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                >
                  VIEW ON EXPLORER
                </button>
              ) : (
                <MintSBTButton 
                  courseId={cert.courseId}
                  onSuccess={() => refetch()}
                  customStyle={{
                    width: '100%', 
                    padding: '14px', 
                    fontFamily: '"Press Start 2P"', 
                    fontSize: '0.6rem', 
                    background: '#fbbf24', 
                    border: '4px solid #b45309',
                    borderTopColor: '#fde68a',
                    borderLeftColor: '#fde68a',
                    color: '#451a03', 
                    textShadow: '1px 1px 0 rgba(255,255,255,0.5)',
                    boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.5), 0 5px 0 #78350f, 1px 6px 0 #78350f, -1px 6px 0 #78350f',
                    imageRendering: 'pixelated',
                  }}
                />
              )}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: '#a8a29e', fontFamily: '"Press Start 2P"', fontSize: '0.7rem', gridColumn: '1 / -1', textAlign: 'center', marginTop: '16px', lineHeight: '1.6', background: 'rgba(0,0,0,0.2)', padding: '24px', border: '2px dashed #5a3a29' }}>
            Belum ada sertifikat On-Chain yang tercetak. <br/><br/>Kalahkan Boss Modul untuk melakukan minting (pencetakan) sertifikat pertamamu!
          </div>
        )}
      </div>
    </div>
  );
}
