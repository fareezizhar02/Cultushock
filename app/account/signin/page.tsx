import { Suspense } from 'react';
import AccountSigninClient from './AccountSigninClient';

export default function AccountSigninPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#fff' }} />}>
      <AccountSigninClient />
    </Suspense>
  );
}
