'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header/Header';

type Mode = 'signup' | 'login';

export default function AccountLoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>('login');
  const [value, setValue] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const passwordRef = useRef<HTMLInputElement>(null);

  const subtitle = useMemo(() => 'Sign up or log in to continue', []);

  const trimmedEmail = value.trim();
  const showPassword = mode === 'login' && trimmedEmail.length > 0;

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const email = trimmedEmail.toLowerCase();
    if (!email) return;

    if (mode === 'signup') {
      router.push(`/account/signin?email=${encodeURIComponent(email)}`);
      return;
    }

    // LOGIN FLOW
    if (!password.trim()) {
      passwordRef.current?.focus();
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setErrorMsg(data?.error || 'Login failed. Please try again.');
        return;
      }

      // ✅ Save user for header
      localStorage.setItem(
        'cultushock_user',
        JSON.stringify({
          username: data.user.username,
          email: data.user.email,
        })
      );

      // Redirect to home
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error(err);
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchMode = (next: Mode) => {
    setMode(next);
    setPassword('');
    setErrorMsg(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header lightBackground={true} />

      <main
        style={{
          paddingTop: '200px',
          padding: '140px 48px 48px 48px',
          maxWidth: '1600px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <section style={{ width: '100%', maxWidth: '820px', textAlign: 'center' }}>
            <h1
              style={{
                fontSize: '56px',
                fontWeight: 700,
                letterSpacing: '0.02em',
                color: '#000000',
                margin: 0,
                marginTop: '60px',
              }}
            >
              Welcome
            </h1>

            <p
              style={{
                marginTop: '12px',
                marginBottom: 0,
                fontSize: '18px',
                fontWeight: 600,
                color: '#111827',
                opacity: 0.8,
              }}
            >
              {subtitle}
            </p>

            {/* Toggle */}
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: '420px',
                  height: '54px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '9999px',
                  padding: '6px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: '6px',
                    left: mode === 'signup' ? '6px' : 'calc(50% + 3px)',
                    width: 'calc(50% - 9px)',
                    height: 'calc(100% - 12px)',
                    backgroundColor: '#ffffff',
                    borderRadius: '9999px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                    transition: 'left 0.25s ease',
                  }}
                />

                <button
                  type="button"
                  onClick={() => handleSwitchMode('signup')}
                  disabled={isSubmitting}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '50%',
                    height: '100%',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#111827',
                    opacity: isSubmitting ? 0.6 : 1,
                  }}
                >
                  Sign up
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  disabled={isSubmitting}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '50%',
                    height: '100%',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#111827',
                    opacity: isSubmitting ? 0.6 : 1,
                  }}
                >
                  Login
                </button>
              </div>
            </div>

            <form onSubmit={handleContinue} style={{ marginTop: '34px' }}>
              {/* Email */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Phone or Email"
                  disabled={isSubmitting}
                  autoComplete="email"
                  style={{
                    width: '720px',
                    maxWidth: '100%',
                    height: '56px',
                    borderRadius: '9999px',
                    border: '1px solid #d1d5db',
                    padding: '0 22px',
                    fontSize: '16px',
                    outline: 'none',
                    color: '#111827',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#111827')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
                />
              </div>

              {/* Password appears after email filled (Login mode only) */}
              {showPassword && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '14px' }}>
                  <input
                    ref={passwordRef}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    disabled={isSubmitting}
                    autoComplete="current-password"
                    style={{
                      width: '720px',
                      maxWidth: '100%',
                      height: '56px',
                      borderRadius: '9999px',
                      border: '1px solid #d1d5db',
                      padding: '0 22px',
                      fontSize: '16px',
                      outline: 'none',
                      color: '#111827',
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#111827')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
                  />
                </div>
              )}

              {errorMsg ? (
                <div
                  style={{
                    marginTop: '14px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '720px',
                      maxWidth: '100%',
                      textAlign: 'left',
                      padding: '0 6px',
                      color: '#b91c1c',
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    {errorMsg}
                  </div>
                </div>
              ) : null}

              <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'center' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '720px',
                    maxWidth: '100%',
                    height: '56px',
                    borderRadius: '9999px',
                    border: 'none',
                    backgroundColor: '#0b0b0b',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 16px 30px rgba(0,0,0,0.18)',
                    transition: 'opacity 0.2s ease',
                    opacity: isSubmitting ? 0.75 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) e.currentTarget.style.opacity = '0.92';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) e.currentTarget.style.opacity = '1';
                  }}
                >
                  {isSubmitting ? 'Logging in...' : 'Continue'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
