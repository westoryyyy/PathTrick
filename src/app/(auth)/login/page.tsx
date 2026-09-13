'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

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

  // If already authenticated, redirect
  if (ready && authenticated) {
    router.push('/select-role');
    return null;
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Trigger Privy email login
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
    <div className={styles.page}>
      {/* ── Dynamic Background ── */}
      <div className={styles.pageBg} />
      <div className={styles.pageOverlay} />



      {/* Glassmorphism Back Button */}
      <Link href="/" className={styles.logoBtn} id="login-back-btn">
        <Image src="/BACK BUTTON.png" alt="Back" width={150} height={70} unoptimized style={{ objectFit: 'contain' }} />
      </Link>

      <div className={styles.container}>
        {/* Logo using Image Asset */}
        <div className={styles.logo}>
          <Image src="/PATHTRICK LOGIN.png" alt="PathTrick Logo" width={400} height={120} style={{ objectFit: 'contain' }} unoptimized />
        </div>

        {/* Card */}
        <div className={styles.card}>
          {step === 'login' ? (
            <>
              <h1 className={styles.title}>Mulai Petualangan</h1>
              <p className={styles.subtitle}>
                Login dengan email atau connect wallet untuk memulai.
              </p>

              {/* Social buttons – side by side */}
              <div className={styles.socialButtons}>
                {SOCIAL_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    id={`login-social-${opt.id}`}
                    className={styles.socialBtn}
                    onClick={() => handleSocialLogin(opt.id)}
                    disabled={!!loading}
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

              <div className={styles.divider}>
                <span>atau gunakan email</span>
              </div>

              {/* Email form */}
              <form onSubmit={handleEmailSubmit} className={styles.emailForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="login-email" className={styles.label}>Email</label>
                  <input
                    id="login-email"
                    type="email"
                    className={styles.inputField}
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={!!loading}
                  />
                </div>
                <button
                  id="login-email-btn"
                  type="submit"
                  className={styles.submitBtn}
                  disabled={!!loading || !email}
                >
                  {loading === 'email' ? (
                    <><span className={styles.spinner} /> Mengirim kode...</>
                  ) : (
                    'Sign up for free'
                  )}
                </button>
              </form>

              <p className={styles.privacy}>
                By signing up, I agree to PathTrick&apos;s Terms.
              </p>
            </>
          ) : (
            /* OTP Step */
            <div className={styles.otpSection}>
              <div className={styles.otpIcon}>📬</div>
              <h1 className={styles.title}>Cek Emailmu</h1>
              <p className={styles.subtitle}>
                Kami kirim kode 6 digit ke <strong style={{ color: '#DD1A21' }}>{email}</strong>
              </p>

              <div className={styles.otpInputs}>
                {otp.map((val, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    className={styles.otpInput}
                    disabled={!!loading}
                    aria-label={`Digit OTP ke-${i + 1}`}
                  />
                ))}
              </div>

              {loading === 'otp' && (
                <div className={styles.verifyingMsg}>
                  <span className={styles.spinner} /> Memverifikasi...
                </div>
              )}

              <button
                className={styles.resendBtn}
                onClick={() => { setStep('login'); setOtp(['','','','','','']); }}
                id="login-back-to-email"
              >
                ← Ganti email atau kirim ulang
              </button>
            </div>
          )}
        </div>

        <p className={styles.terms}>
          Dengan masuk, kamu menyetujui{' '}
          <a href="#">Syarat & Ketentuan</a> dan{' '}
          <a href="#">Kebijakan Privasi</a>.
        </p>
      </div>
    </div>
  );
}
