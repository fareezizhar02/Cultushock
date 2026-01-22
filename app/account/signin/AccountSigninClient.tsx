'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header/Header';

export default function AccountSigninClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = useMemo(() => (searchParams.get('email') || '').trim(), [searchParams]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.toLowerCase();
    const cleanUsername = username.trim();

    if (!cleanEmail) {
      setErrorMsg('Missing email. Please go back and enter your email again.');
      return;
    }
    if (!cleanUsername) {
      setErrorMsg('Please enter a username.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, username: cleanUsername, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setErrorMsg(data?.error || 'Failed to create account. Please try again.');
        return;
      }

      // ✅ Save user for header
      localStorage.setItem(
        'cultushock_user',
        JSON.stringify({ username: data.user.username, email: data.user.email })
      );

      router.push('/');
      router.refresh();
    } catch (err) {
      console.error(err);
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              Almost Done
            </h1>

            <p
              style={{
                marginTop: '12px',
                marginBottom: 0,
                fontSize: '18px',
                fontWeight: 600,
                color: '#111827',
                opacity: 0.8,
                lineHeight: 1.4,
              }}
            >
              We&apos;re excited to have you join our member. Fill in detail for your account
            </p>

            <form onSubmit={handleContinue} style={{ marginTop: '34px' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '720px', maxWidth: '100%' }}>
                  {email ? (
                    <div
                      style={{
                        marginBottom: '14px',
                        fontSize: '14px',
                        color: '#6b7280',
                        textAlign: 'left',
                        padding: '0 6px',
                      }}
                    >
                      Email: <span style={{ color: '#111827', fontWeight: 600 }}>{email}</span>
                    </div>
                  ) : (
                    <div
                      style={{
                        marginBottom: '14px',
                        fontSize: '14px',
                        color: '#b91c1c',
                        textAlign: 'left',
                        padding: '0 6px',
                        fontWeight: 600,
                      }}
                    >
                      Email is missing. Please go back.
                    </div>
                  )}

                  {errorMsg ? (
                    <div
                      style={{
                        marginBottom: '14px',
                        fontSize: '14px',
                        color: '#b91c1c',
                        textAlign: 'left',
                        padding: '0 6px',
                        fontWeight: 600,
                      }}
                    >
                      {errorMsg}
                    </div>
                  ) : null}

                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    autoComplete="username"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      height: '56px',
                      borderRadius: '9999px',
                      border: '1px solid #d1d5db',
                      padding: '0 22px',
                      fontSize: '16px',
                      outline: 'none',
                      marginBottom: '14px',
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#111827')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      height: '56px',
                      borderRadius: '9999px',
                      border: '1px solid #d1d5db',
                      padding: '0 22px',
                      fontSize: '16px',
                      outline: 'none',
                      marginBottom: '18px',
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#111827')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    style={{
                      width: '100%',
                      height: '56px',
                      borderRadius: '9999px',
                      border: 'none',
                      backgroundColor: '#0b0b0b',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: isSubmitting || !email ? 'not-allowed' : 'pointer',
                      boxShadow: '0 16px 30px rgba(0,0,0,0.18)',
                      transition: 'opacity 0.2s ease',
                      opacity: isSubmitting || !email ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting && email) e.currentTarget.style.opacity = '0.92';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting && email) e.currentTarget.style.opacity = '1';
                    }}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Continue'}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
