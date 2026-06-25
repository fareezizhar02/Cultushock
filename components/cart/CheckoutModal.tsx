'use client';

import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';

type Step = 'buyer' | 'payment' | 'success';

interface BuyerInfo {
  name: string;
  phone: string;
  address: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
}

interface PaymentInfo {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid #e5e7eb',
  borderRadius: '4px',
  fontSize: '14px',
  color: '#000000',
  backgroundColor: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box' as const,
  letterSpacing: '0.02em',
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 'bold' as const,
  color: '#000000',
  letterSpacing: '0.08em',
  marginBottom: '6px',
  textTransform: 'uppercase' as const,
};

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { getCartTotal, clearCart } = useCart();
  const { currency } = useCurrency();

  const cartTotal = getCartTotal(currency.code);

  const [step, setStep] = useState<Step>('buyer');

  const [buyer, setBuyer] = useState<BuyerInfo>({
    name: '', phone: '', address: '', postcode: '', city: '', state: '', country: '',
  });

  const [payment, setPayment] = useState<PaymentInfo>({
    cardholderName: '', cardNumber: '', expiryDate: '', cvc: '',
  });

  const formatTotal = () => {
    if (currency.code === 'IDR') return `${currency.symbol} ${cartTotal.toLocaleString('id-ID')}`;
    return `${currency.symbol} ${cartTotal.toFixed(2)}`;
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handlePay = () => {
    clearCart();
    setStep('success');
  };

  const handleClose = () => {
    setStep('buyer');
    setBuyer({ name: '', phone: '', address: '', postcode: '', city: '', state: '', country: '' });
    setPayment({ cardholderName: '', cardNumber: '', expiryDate: '', cvc: '' });
    onClose();
  };

  const buyerComplete = !!(buyer.name && buyer.phone && buyer.address && buyer.postcode && buyer.city && buyer.state && buyer.country);
  const paymentComplete = !!(payment.cardholderName && payment.cardNumber.replace(/\s/g, '').length === 16 && payment.expiryDate.length === 5 && payment.cvc.length === 3);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget && step !== 'success') handleClose(); }}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
    >
      <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '520px', borderRadius: '8px', padding: '40px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Close Button */}
        {step !== 'success' && (
          <button onClick={handleClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <X size={20} color="#9ca3af" />
          </button>
        )}

        {/* ── Step 1: Buyer Info ── */}
        {step === 'buyer' && (
          <>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.05em', color: '#000000', marginBottom: '8px' }}>Buyer Information</h2>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '32px', letterSpacing: '0.02em' }}>Please fill in your shipping information</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {([
                { label: 'Full Name', key: 'name', placeholder: 'Muhammad Ali' },
                { label: 'Phone Number', key: 'phone', placeholder: '+60 12-345 6789' },
                { label: 'Address', key: 'address', placeholder: 'No. 12, Jalan Bukit Bintang' },
                { label: 'Postcode', key: 'postcode', placeholder: '55100' },
                { label: 'City', key: 'city', placeholder: 'Kuala Lumpur' },
                { label: 'State', key: 'state', placeholder: 'Wilayah Persekutuan' },
                { label: 'Country', key: 'country', placeholder: 'Malaysia' },
              ] as { label: string; key: keyof BuyerInfo; placeholder: string }[]).map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={buyer[key]}
                    onChange={(e) => setBuyer({ ...buyer, [key]: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#000000')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('payment')}
              disabled={!buyerComplete}
              style={{
                marginTop: '32px', width: '100%', padding: '16px', backgroundColor: '#000000', color: '#ffffff',
                fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.1em', border: 'none',
                cursor: buyerComplete ? 'pointer' : 'not-allowed', borderRadius: '4px', transition: 'all 0.2s',
                opacity: buyerComplete ? 1 : 0.4,
              }}
              onMouseEnter={(e) => { if (buyerComplete) e.currentTarget.style.backgroundColor = '#1f2937'; }}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#000000')}
            >
              UPDATE
            </button>
          </>
        )}

        {/* ── Step 2: Payment ── */}
        {step === 'payment' && (
          <>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.05em', color: '#000000', marginBottom: '8px' }}>PAYMENT INFORMATION</h2>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '32px', letterSpacing: '0.02em' }}>Your card information is secure and encrypted</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="MUHAMMAD ALI"
                  value={payment.cardholderName}
                  onChange={(e) => setPayment({ ...payment, cardholderName: e.target.value.toUpperCase() })}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#000000')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>

              <div>
                <label style={labelStyle}>Card Number</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={payment.cardNumber}
                  onChange={(e) => setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })}
                  maxLength={19}
                  style={{ ...inputStyle, letterSpacing: '0.1em', fontFamily: 'monospace' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#000000')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={payment.expiryDate}
                    onChange={(e) => setPayment({ ...payment, expiryDate: formatExpiry(e.target.value) })}
                    maxLength={5}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#000000')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>CVC</label>
                  <input
                    type="text"
                    placeholder="000"
                    value={payment.cvc}
                    onChange={(e) => setPayment({ ...payment, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                    maxLength={3}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#000000')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                  />
                </div>
              </div>
            </div>

            {/* Subtotal Recap */}
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#6b7280', letterSpacing: '0.05em' }}>SUBTOTAL</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000' }}>{formatTotal()}</span>
            </div>

            <button
              onClick={handlePay}
              disabled={!paymentComplete}
              style={{
                marginTop: '16px', width: '100%', padding: '16px', backgroundColor: '#000000', color: '#ffffff',
                fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.1em', border: 'none',
                cursor: paymentComplete ? 'pointer' : 'not-allowed', borderRadius: '4px', transition: 'all 0.2s',
                opacity: paymentComplete ? 1 : 0.4,
              }}
              onMouseEnter={(e) => { if (paymentComplete) e.currentTarget.style.backgroundColor = '#1f2937'; }}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#000000')}
            >
              PAY {formatTotal()}
            </button>

            <button
              onClick={() => setStep('buyer')}
              style={{ marginTop: '12px', width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#6b7280', fontSize: '13px', border: '1px solid #e5e7eb', cursor: 'pointer', borderRadius: '4px', letterSpacing: '0.05em' }}
            >
              ← Back
            </button>
          </>
        )}

        {/* ── Step 3: Success ── */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CheckCircle size={72} color="#22c55e" style={{ margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', letterSpacing: '0.05em', color: '#000000', marginBottom: '12px' }}>PAYMENT SUCCESS</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '40px', lineHeight: 1.6 }}>
              Thank you for your purchase!<br />Your order will be processed shortly.
            </p>
            <button
              onClick={handleClose}
              style={{ padding: '14px 40px', backgroundColor: '#000000', color: '#ffffff', fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.1em', border: 'none', cursor: 'pointer', borderRadius: '4px', transition: 'all 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1f2937')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#000000')}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </div>
    </div>
  );
}