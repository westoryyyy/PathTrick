'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import Image from 'next/image';

const SOCIAL_OPTIONS = [
  { id: 'google',  label: 'Google' },
  { id: 'wallet',  label: 'Wallet' },
];

export default function LoginPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: () => {
      router.push('/select-role');
    },
  });

  const [loading, setLoading] = useState<string | null>(null);

  if (ready && authenticated) {
    router.push('/select-role');
    return null;
  }


  const handleSocialLogin = (provider: string) => {
    if (provider === 'google') {
      login({ loginMethods: ['google'] });
    } else if (provider === 'wallet') {
      login({ loginMethods: ['wallet'] });
    }
  };



  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6 bg-[#0b1437]">
      {/* ── Dynamic Background ── */}
      <div 
        className="absolute -inset-[2%] bg-[url('/px-hero-island.jpg')] bg-cover bg-center z-0 animate-[bgPan_40s_ease-in-out_infinite_alternate]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(10,15,30,0.4)_100%)] z-10" />

      {/* Back Button */}
      <Link 
        href="/" 
        id="login-back-btn"
        className="fixed top-10 left-6 z-20 flex items-center justify-center bg-transparent border-none outline-none transition-transform duration-100 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Image src="/BACK BUTTON.png" alt="Back" width={150} height={70} unoptimized style={{ objectFit: 'contain' }} />
      </Link>

      <div className="w-full max-w-[480px] flex flex-col items-center relative z-10">
        {/* Logo */}
        <div className="text-center mb-6 translate-y-10 z-20 relative">
          <Image src="/PATHTRICK LOGIN.png" alt="PathTrick Logo" width={400} height={120} style={{ objectFit: 'contain' }} unoptimized />
        </div>

        {/* Card */}
        <div className="w-full max-w-[540px] min-h-[480px] bg-transparent bg-[url('/Login\ Card.png')] bg-[length:100%_100%] bg-center bg-no-repeat p-[85px] relative flex flex-col justify-center drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
              <h1 className="font-pixel text-[1.1rem] text-[#3e2723] text-center leading-[1.4] mb-2 drop-shadow-none">
                Gerbang PathTrick
              </h1>
              <p className="font-pixelify text-[0.85rem] text-[#5d4037] text-center leading-[1.6] mb-6">
                Pilih metode otentikasi untuk menyimpan<br/>progres petualanganmu.
              </p>

              {/* Social buttons */}
              <div className="flex gap-3 mb-1">
                {SOCIAL_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    id={`login-social-${opt.id}`}
                    onClick={() => handleSocialLogin(opt.id)}
                    disabled={!!loading}
                    className="flex-1 flex items-center justify-center gap-[10px] py-3 px-4 border-2 border-[#8b5a2b] bg-[#e6ccab] cursor-pointer font-pixel text-[0.6rem] text-[#3e2723] shadow-[inset_0_0_4px_rgba(0,0,0,0.1),2px_2px_0_0_rgba(0,0,0,0.3)] transition-transform duration-100 hover:bg-[#f1ebd8] hover:border-[#5d4037] hover:shadow-[inset_0_0_4px_rgba(0,0,0,0.1),2px_2px_0_0_rgba(0,0,0,0.4)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[inset_0_0_4px_rgba(0,0,0,0.2),1px_1px_0_0_rgba(0,0,0,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {opt.id === 'google' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3e2723" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                      </svg>
                    )}
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>

        </div>

        <p className="font-pixelify text-[0.8rem] text-white text-center leading-[1.8] mt-6 drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)] shadow-black max-w-[400px]">
          Dengan masuk, kamu menyetujui mematuhi <a href="#" className="text-[#facc15] no-underline hover:underline">Aturan Guild (S&K)</a> dan <a href="#" className="text-[#facc15] no-underline hover:underline">Kode Etik Privasi</a> PathTrick.
        </p>
      </div>
    </div>
  );
}
