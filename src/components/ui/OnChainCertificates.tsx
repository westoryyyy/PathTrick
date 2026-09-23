'use client';

import React, { useMemo } from 'react';
import styles from './OnChainCertificates.module.css';
import { useMapStore } from '@/store/useMapStore';
import { useAccount, useReadContracts } from 'wagmi';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useUserStore } from '@/store/useUserStore';
import MintSBTButton from './MintSBTButton';
import { PATHTRICK_SBT_ABI, PATHTRICK_SBT_ADDRESS } from '@/config/pathtrick';

type Props = {
  hideHeader?: boolean;
};

// Helper to convert chapter ID string to uint256-compatible number for SBT Minting
const generateCourseId = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export default function OnChainCertificates({ hideHeader = false }: Props = {}) {
  const completedDynamicNodes = useMapStore(state => state.completedDynamicNodes);
  const { address } = useAccount();

  // Find all Boss nodes
  const bossNodes = useMemo(() => {
    return completedDynamicNodes.filter(nodeId => nodeId.endsWith('-level-6') || nodeId.includes('boss') || nodeId === 'module-framer-bab-1-level-1');
  }, [completedDynamicNodes]);

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
    return bossNodes.map(nodeId => {
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
    return bossNodes.map((nodeId, index) => {
      const isMinted = sbtOwnershipResults?.[index]?.result === true;
      const baseChapterId = nodeId.replace(/-level-\d+$/, '');
      const courseId = generateCourseId(baseChapterId);

      const match = nodeId.match(/module-([a-zA-Z0-9-]+?)(?:-bab|-level)/);
      let rawName = match ? match[1] : 'Unknown';
      
      // Clean up names (e.g. 'agriculture-1' -> 'Agriculture', 'html-css' -> 'HTML CSS')
      rawName = rawName.replace(/-\d+$/, '').replace(/-/g, ' ');
      const moduleName = rawName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

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
        ) : isLoadingOwnership ? (
          <div style={{ color: '#d4d4d8', fontFamily: '"Press Start 2P"', fontSize: '0.7rem', gridColumn: '1 / -1', textAlign: 'center', marginTop: '16px', lineHeight: '1.6', background: 'rgba(0,0,0,0.2)', padding: '24px', border: '2px dashed #5a3a29' }}>
            Memuat sertifikat On-Chain...
          </div>
        ) : ownershipError ? (
          <div style={{ color: '#fca5a5', fontFamily: '"Press Start 2P"', fontSize: '0.7rem', gridColumn: '1 / -1', textAlign: 'center', marginTop: '16px', lineHeight: '1.6', background: 'rgba(0,0,0,0.2)', padding: '24px', border: '2px dashed #5a3a29' }}>
            Sertifikat belum dapat dimuat.{' '}
            <button type="button" onClick={() => refetch()} style={{ color: '#fbbf24', textDecoration: 'underline', fontFamily: 'inherit', fontSize: 'inherit', background: 'none', border: 0, cursor: 'pointer' }}>
              Coba lagi
            </button>
          </div>
        ) : earnedCertificates.length > 0 ? (
          earnedCertificates.map(cert => (
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
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  aspectRatio: '1.414', // Landscape standard ratio
                  borderRadius: '2px', 
                  overflow: 'hidden',
                  border: '4px solid #e8c98a',
                  boxShadow: '0 0 0 4px #3b1f0e',
                  backgroundColor: '#f5f5f5',
                  filter: cert.isMinted ? 'none' : 'grayscale(100%) brightness(0.6)',
                  transition: 'all 0.3s'
                }}>
                <img 
                  src="/certificate-template.png" 
                  alt="Certificate Template" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
                />
                
                {/* Text Overlay */}
                <div style={{
                  position: 'absolute', 
                  top: 0, left: 0, width: '100%', height: '100%',
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  padding: '10%',
                  textAlign: 'center',
                  zIndex: 2
                }}>
                  <h3 style={{ 
                    fontFamily: '"Press Start 2P", monospace', 
                    fontSize: 'clamp(0.6rem, 2vw, 1.2rem)', 
                    color: '#1a1a1a', 
                    marginBottom: '8px',
                    textShadow: '1px 1px 0 rgba(255,255,255,0.8)'
                  }}>
                    {cert.title}
                  </h3>
                  <p style={{ 
                    fontFamily: 'sans-serif', 
                    fontSize: 'clamp(0.5rem, 1.5vw, 1rem)', 
                    color: '#333', 
                    fontWeight: 'bold' 
                  }}>
                    Awarded to {displayName}
                  </p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: 'clamp(0.4rem, 1vw, 0.7rem)', color: '#444', fontWeight: 'bold' }}>
                      DATE: {cert.date}
                    </p>
                    <p style={{ fontFamily: 'monospace', fontSize: 'clamp(0.4rem, 1vw, 0.7rem)', color: '#444', fontWeight: 'bold' }}>
                      ISSUER: {cert.issuer}
                    </p>
                  </div>
                </div>

                {/* Locked Overlay Icon */}
                {!cert.isMinted && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 3,
                    fontSize: '4rem',
                    textShadow: '0px 0px 10px rgba(0,0,0,0.8)'
                  }}>
                    🔒
                  </div>
                )}
              </div>
              
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
