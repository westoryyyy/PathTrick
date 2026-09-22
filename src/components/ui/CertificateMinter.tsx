'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAccount, useWriteContract } from 'wagmi';
import PathtrickSBT from '@/abis/PathtrickSBT.abi.json';
import { parseEther } from 'viem';

// --- Komponen AutoScaleText untuk mengecilkan font jika teks terlalu panjang ---
const AutoScaleText = ({ children, className, style, align = 'center' }: { children: React.ReactNode, className?: string, style?: React.CSSProperties, align?: 'center' | 'left' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const checkScale = () => {
      if (!containerRef.current || !textRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const textWidth = textRef.current.offsetWidth;
      if (textWidth > containerWidth && textWidth > 0) {
        setScale(containerWidth / textWidth);
      } else {
        setScale(1);
      }
    };
    checkScale();
    window.addEventListener('resize', checkScale);
    return () => window.removeEventListener('resize', checkScale);
  }, [children]);

  return (
    <div ref={containerRef} className={className} style={{ ...style, display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start', alignItems: 'center', overflow: 'visible', whiteSpace: 'nowrap' }}>
      <span ref={textRef} style={{ transform: `scale(${scale})`, transformOrigin: align === 'center' ? 'center' : 'left center', display: 'inline-block', whiteSpace: 'nowrap' }}>
        {children}
      </span>
    </div>
  );
};

const SBT_CONTRACT_ADDRESS = '0xf06f0BC7E84fC0c05cEb243b5739A5B003f471c9';
const SBT_ABI = PathtrickSBT.abi;

export type CertificateMinterProps = {
  courseId: number | string;
};

type CertData = {
  userName: string;
  courseName: string;
  courseId: number | string;
  signature: `0x${string}`;
  completionDate?: string;
};

export default function CertificateMinter({ courseId }: CertificateMinterProps) {
  const { address } = useAccount();
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();

  const [certData, setCertData] = useState<CertData | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  // 1. TRIGGER & FETCH DATA DARI BACKEND
  useEffect(() => {
    const fetchCertificateData = async () => {
      // Kita butuh address user buat dapet signature yang valid dari Backend
      if (!address) return; 

      try {
        setIsFetching(true);
        // Tembak API Backend dengan membawa courseId dan address
        const response = await fetch(`/api/user/certificate?courseId=${courseId}&address=${address}`);
        
        // Mock data fallback jika API belum siap
        if (!response.ok) {
          console.warn("API Backend gagal/belum siap, menggunakan mock data.");
          setCertData({
            userName: "Budi",
            courseName: "Frontend Master",
            courseId: courseId,
            signature: "0xMockSignature1234567890abcdef" as `0x${string}`,
            completionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          });
          return;
        }

        const data = await response.json();
        setCertData({
          ...data,
          completionDate: data.completionDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        });
      } catch (error) {
        console.error("Gagal mengambil data sertifikat dari server:", error);
      } finally {
        setIsFetching(false);
      }
    };

    if (courseId && address) {
      fetchCertificateData();
    }
  }, [courseId, address]);

  // 3. EKSEKUSI WEB3 MINTING (WAGMI)
  const handleMint = () => {
    if (!address) {
      alert("Silakan hubungkan wallet terlebih dahulu.");
      return;
    }

    if (!certData?.signature) {
      alert("Tanda tangan (Signature) dari backend tidak ditemukan. Proses minting dibatalkan.");
      return;
    }

    writeContract({
      address: SBT_CONTRACT_ADDRESS,
      abi: SBT_ABI,
      functionName: 'mintCertificate',
      args: [BigInt(certData.courseId), certData.signature],
      value: parseEther('0.005'), // Sistem "User-Paid" mint fee
    });
  };

  if (isFetching) {
    return <div className="text-center p-8 text-white font-['Press_Start_2P'] text-sm">Memuat Data Sertifikat...</div>;
  }

  if (!certData) {
    return <div className="text-center p-8 text-red-400 font-['Press_Start_2P'] text-sm">Gagal memuat sertifikat.</div>;
  }

  // 2. VISUAL SERTIFIKAT (UI/TEMPLATE)
  // [DEBUG] Ganti false jadi true untuk melihat kotak merah penyesuaian posisi
  const showDebugOutline = false; 
  const outlineClass = showDebugOutline ? 'outline outline-1 outline-red-500 bg-red-500/20' : '';

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Certificate Preview Container */}
      <div 
        className="relative w-full max-w-4xl overflow-hidden rounded-lg shadow-xl"
        style={{ aspectRatio: '1024/768' }}
      >
        {/* Background Template */}
        <Image 
          src="/certificate-template.png" 
          alt="Certificate Template" 
          fill 
          className="absolute inset-0 w-full h-full object-cover z-0"
          priority
        />
        
        {/* Text Overlay Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          
          {/* 1. AREA NAMA (Tengah) */}
          <AutoScaleText 
            className={`absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] text-stone-800 font-bold ${outlineClass}`}
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 'clamp(0.8rem, 2vw, 1.8rem)', textShadow: '1px 1px 0 rgba(255,255,255,0.7)' }}
            align="center"
          >
            {certData.userName}
          </AutoScaleText>

          {/* 2. AREA MODUL/CHAPTER (Tengah Bawah) */}
          <AutoScaleText 
            className={`absolute top-[67%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[58%] text-cyan-300 font-bold ${outlineClass}`}
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 'clamp(0.7rem, 2vw, 1.2rem)', textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}
            align="center"
          >
            {certData.courseName}
          </AutoScaleText>
          
          {/* 3A. DATA WEB3 - ID (Garis Pertama) */}
          <AutoScaleText 
            className={`absolute left-[62%] w-[24%] text-cyan-200 font-mono ${outlineClass}`}
            style={{ top: '76.6%', fontSize: 'clamp(0.4rem, 0.9vw, 0.75rem)', fontWeight: 'bold' }}
            align="left"
          >
            SBT-{certData.courseId}
          </AutoScaleText>

          {/* 3B. DATA WEB3 - DATE (Garis Kedua) */}
          <AutoScaleText 
            className={`absolute left-[62%] w-[24%] text-cyan-200 font-mono ${outlineClass}`}
            style={{ top: '81.1%', fontSize: 'clamp(0.4rem, 0.9vw, 0.75rem)', fontWeight: 'bold' }}
            align="left"
          >
            {certData.completionDate}
          </AutoScaleText>

          {/* 3C. DATA WEB3 - WALLET (Garis Ketiga) */}
          <AutoScaleText 
            className={`absolute left-[62%] w-[24%] text-cyan-200 font-mono ${outlineClass}`}
            style={{ top: '85.5%', fontSize: 'clamp(0.4rem, 0.9vw, 0.75rem)', fontWeight: 'bold' }}
            align="left"
          >
            {address ? address : '0x...'}
          </AutoScaleText>
        </div>
      </div>

      {/* Mint Button */}
      <button 
        onClick={handleMint}
        disabled={isPending || isSuccess}
        className={`px-8 py-4 font-bold text-lg rounded-md transition-all ${
          isSuccess 
            ? 'bg-green-500 text-white cursor-not-allowed shadow-none'
            : isPending 
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed shadow-none' 
              : isError
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-[4px_4px_0_#7f1d1d]'
                : 'bg-yellow-500 hover:bg-yellow-600 text-gray-900 shadow-[4px_4px_0_#8c5d41] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#8c5d41]'
        }`}
        style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '0.8rem' }}
      >
        {isSuccess 
          ? 'Minted Successfully 🎉' 
          : isPending 
            ? 'Memproses Transaksi...' 
            : isError
              ? 'Transaksi Gagal! Coba Lagi'
              : 'Mint to Web3 (0.005 tBNB)'}
      </button>
    </div>
  );
}
