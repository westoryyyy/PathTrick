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

  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [step, setStep]       = useState<'login' | 'otp'>('login');
  const [otp, setOtp]         = useState(['', '', '', '', '', '']);

  if (ready && authenticated) {
    router.push('/select-role');
    return null;
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login({ loginMethods: ['email'], prefill: { type: 'email', value: email } });
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'google') {
      login({ loginMethods: ['google'] });
    } else if (provider === 'wallet') {
      login({ loginMethods: ['wallet'] });
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      next?.focus();
    }
    if (newOtp.every(v => v !== '') && index === 5) {
      setLoading('otp');
      setTimeout(() => router.push('/'), 1000);
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
          {step === 'login' ? (
            <>
              <h1 className="font-pixel text-base text-[#3e2723] text-center leading-[1.4] mb-2 drop-shadow-none">
                Mulai Petualangan
              </h1>
              <p className="font-pixelify text-[0.9rem] text-[#5d4037] text-center leading-[1.6] mb-6">
                Login dengan email atau connect wallet untuk memulai.
              </p>

              {/* Social buttons */}
              <div className="flex gap-3 mb-1">
                {SOCIAL_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    id={`login-social-${opt.id}`}
                    onClick={() => handleSocialLogin(opt.id)}
                    disabled={!!loading}
                    className="flex-1 flex items-center justify-center gap-[10px] py-3 px-4 border-2 border-[#a67c52] rounded-lg bg-[#fcf3e3] cursor-pointer font-pixelify text-base text-[#3e2723] font-semibold shadow-[0_3px_0_#a67c52] normal-case transition-all duration-100 hover:bg-[#fff9ef] hover:-translate-y-[1px] hover:shadow-[0_4px_0_#a67c52] active:translate-y-[3px] active:shadow-[0_0_0_#a67c52] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-[0_3px_0_#a67c52]"
                  >
                    {opt.id === 'google' ? (
                      <svg width="22" height="22" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a2a3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                      </svg>
                    )}
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 my-6 text-[#a67c52] text-[0.8rem] font-pixelify uppercase before:content-[''] before:flex-1 before:h-[2px] before:bg-[#a67c52] after:content-[''] after:flex-1 after:h-[2px] after:bg-[#a67c52]">
                <span>atau gunakan email</span>
              </div>

              {/* Email form */}
              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-3.5">
                  <label htmlFor="login-email" className="hidden">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={!!loading}
                    className="w-full py-3.5 px-4 border-2 border-[#8b5a2b] rounded-lg bg-[#e6ccab] font-pixelify text-[0.95rem] text-[#3e2723] outline-none transition-colors duration-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] focus:border-[#5d4037] focus:bg-[#f1ebd8] placeholder-[#8d6e63]"
                  />
                </div>
                <button
                  id="login-email-btn"
                  type="submit"
                  disabled={!!loading || !email}
                  className="w-full p-4 mt-4 border-3 border-[#5d4037] rounded-lg bg-gradient-to-b from-[#ffd700] to-[#daa520] text-[#3e2723] font-pixel text-[0.85rem] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)] cursor-pointer tracking-widest normal-case transition-all duration-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.5),inset_0_-2px_0_rgba(0,0,0,0.2),0_6px_0_#8b5a2b,0_8px_12px_rgba(0,0,0,0.3)] hover:-translate-y-[2px] hover:bg-gradient-to-b hover:from-[#ffdf33] hover:to-[#e8b122] hover:shadow-[inset_0_2px_0_rgba(255,255,255,0.5),inset_0_-2px_0_rgba(0,0,0,0.2),0_8px_0_#8b5a2b,0_12px_16px_rgba(0,0,0,0.4)] active:translate-y-[6px] active:shadow-[inset_0_2px_0_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.1),0_0_0_#8b5a2b,0_2px_4px_rgba(0,0,0,0.2)] disabled:bg-gradient-to-b disabled:from-[#d4c47b] disabled:to-[#bfa256] disabled:border-[#8b7d6b] disabled:text-[#7a6e5e] disabled:drop-shadow-none disabled:shadow-[inset_0_2px_0_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.1),0_4px_0_#7a6e5e] disabled:cursor-not-allowed"
                >
                  {loading === 'email' ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 border-3 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim kode...
                    </span>
                  ) : (
                    'Sign up for free'
                  )}
                </button>
              </form>

              <p className="font-pixelify text-[0.75rem] text-[#5d4037] text-center mt-4 leading-[1.6]">
                By signing up, I agree to PathTrick&apos;s Terms.
              </p>
            </>
          ) : (
            /* OTP Step */
            <div className="flex flex-col items-center gap-6">
              <div className="text-[2.5rem] leading-none">📬</div>
              <h1 className="font-pixel text-base text-[#3e2723] text-center leading-[1.4] mb-2 drop-shadow-none">Cek Emailmu</h1>
              <p className="font-pixelify text-[0.9rem] text-[#5d4037] text-center leading-[1.6] mb-6">
                Kami kirim kode 6 digit ke <strong className="text-[#DD1A21]">{email}</strong>
              </p>

              <div className="flex gap-2">
                {otp.map((val, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    disabled={!!loading}
                    aria-label={`Digit OTP ke-${i + 1}`}
                    className="w-11 h-[52px] bg-[#f9fafb] border-3 border-[#d1d5db] rounded-lg text-[#1a2a3a] font-pixelify text-[1.2rem] text-center outline-none shadow-none focus:border-[#DD1A21] focus:bg-white placeholder-shown:border-[#d1d5db] [&:not(:placeholder-shown)]:border-[#22c55e]"
                  />
                ))}
              </div>

              {loading === 'otp' && (
                <div className="flex items-center gap-3 text-[0.85rem] text-[#1a2a3a] font-pixelify">
                  <span className="inline-block w-4 h-4 border-3 border-white/30 border-t-white rounded-full animate-spin" /> Memverifikasi...
                </div>
              )}

              <button
                onClick={() => { setStep('login'); setOtp(['','','','','','']); }}
                id="login-back-to-email"
                className="text-[0.8rem] text-[#6b7280] cursor-pointer bg-none border-none font-pixelify underline hover:text-[#1a2a3a]"
              >
                ← Ganti email atau kirim ulang
              </button>
            </div>
          )}
        </div>

        <p className="font-pixelify text-[0.8rem] text-white text-center leading-[1.8] mt-5 drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)] shadow-black">
          Dengan masuk, kamu menyetujui{' '}
          <a href="#" className="text-[#ff5252] no-underline hover:underline">Syarat & Ketentuan</a> dan{' '}
          <a href="#" className="text-[#ff5252] no-underline hover:underline">Kebijakan Privasi</a>.
        </p>
      </div>
    </div>
  );
}
