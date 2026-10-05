/**
 * EGovPayScreen — Pay government fees (mock, no real payment)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { db } from '../../mock/db';
import { useAuth } from '../../state/AuthContext';
import { useLocation } from 'react-router-dom';
import { getPendingPayment, processPayment, cancelPendingPayment, type PendingPayment } from '../../mock/services/paymentService';

const PAYMENT_ITEMS = [
  { id: 'sss-contrib', label: 'SSS Contribution', agency: 'SSS', amount: 1125.00 },
  { id: 'philhealth-prem', label: 'PhilHealth Premium', agency: 'PhilHealth', amount: 400.00 },
  { id: 'pagibig-contrib', label: 'Pag-IBIG Contribution', agency: 'Pag-IBIG Fund', amount: 100.00 },
  { id: 'bir-tax', label: 'BIR Quarterly Tax', agency: 'Bureau of Internal Revenue', amount: 2500.00 },
  { id: 'passport-fee', label: 'DFA Passport Fee', agency: 'DFA', amount: 950.00 },
  { id: 'lto-reg', label: 'LTO Vehicle Registration', agency: 'LTO', amount: 1800.00 },
];

export function EGovPayScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const pendingId = (location.state as { pendingPaymentId?: string })?.pendingPaymentId;
  const [pendingItem, setPendingItem] = useState<PendingPayment | null>(null);

  React.useEffect(() => {
    if (pendingId && user) {
      const item = getPendingPayment(user.id, pendingId);
      if (item && item.status === 'pending') {
        setPendingItem(item);
      }
    }
  }, [pendingId, user]);

  const [selected, setSelected] = useState<typeof PAYMENT_ITEMS[0] | null>(null);
  const [payMethod, setPayMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [error, setError] = useState('');

  const handlePay = async () => {
    setIsLoading(true);
    setError('');
    
    if (pendingItem && user) {
      try {
        const ref = await processPayment(user.id, pendingItem.id, payMethod);
        setRefNumber(ref);
        setDone(true);
      } catch (err: any) {
        setError(err.message || 'Payment failed.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    await new Promise(r => setTimeout(r, 1500));
    const ref = 'PAY-' + Date.now().toString(36).toUpperCase();
    
    // C-04: Fixed key from 'payments' to 'eGovPayPayments' to match db seed
    const payments = db.get<unknown[]>('eGovPayPayments') ?? [];
    const newPayment = { id: ref, userId: user?.id, ...selected, method: payMethod, date: new Date().toISOString() };
    const ok = db.set('eGovPayPayments', [...payments, newPayment]);
    
    setIsLoading(false);
    if (!ok) {
      setError('Payment processing failed. Please try again.');
      return;
    }
    
    setRefNumber(ref);
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex-1 flex flex-col">
        <AppBar title="eGovPay" showBack={false} />
        <ScreenContainer className="pt-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 py-6 text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center"><CheckCircle size={44} className="text-success" /></div>
            <h1 className="text-h1 font-bold text-text-primary">Payment Successful!</h1>
            <div className="w-full bg-white border border-border rounded-lg p-4">
              <p className="text-body-sm text-text-secondary">Official Receipt Number</p>
              <p className="text-h2 font-bold text-primary font-mono mt-1">{refNumber}</p>
              <div className="mt-3 flex justify-between text-body-sm">
                <span className="text-text-secondary">{selected?.label}</span>
                <span className="text-text-primary font-bold">₱{selected?.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
              </div>
              <p className="text-xs text-text-secondary mt-2">{selected?.agency} · {new Date().toLocaleDateString('en-PH')}</p>
            </div>
            <p className="text-body-sm text-text-secondary">This is a simulated payment for research purposes. No real money was charged.</p>
            <div className="flex gap-3 w-full">
              { pendingItem ? (
                <Button variant="primary" fullWidth onClick={() => navigate(pendingItem.returnTo, { state: { paymentSuccess: true, paymentId: pendingItem.id } })}>
                  Return to {pendingItem.sourceService === 'eTravel' ? 'eTravel' : 'Appointments'}
                </Button>
              ) : (
                <>
                  <Button variant="outline" fullWidth onClick={() => { setDone(false); setSelected(null); setPayMethod(''); }}>Pay Another</Button>
                  <Button variant="primary" fullWidth onClick={() => navigate('/home')}>Go Home</Button>
                </>
              )}
            </div>
          </motion.div>
        </ScreenContainer>
      </div>
    );
  }

  const handleCancelPending = () => {
    if (pendingItem && user) {
      cancelPendingPayment(user.id, pendingItem.id);
      navigate(pendingItem.returnTo);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="eGovPay" showBack onBack={pendingItem ? handleCancelPending : undefined} />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center"><CreditCard size={24} className="text-primary" /></div>
          <div>
            <h1 className="text-h1 font-bold text-text-primary">eGovPay</h1>
            <p className="text-body-sm text-text-secondary">Pay government fees and contributions</p>
          </div>
        </div>

        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <p className="text-body-sm text-error font-medium">
            🔬 Research prototype — no real payment is processed. Simulated transactions only.
          </p>
        </div>

        {pendingItem ? (
          <div>
            <p className="text-body-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Pending Payment</p>
            <div className="w-full border border-primary bg-primary-light rounded-lg p-4 text-left">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-body font-semibold text-text-primary">{pendingItem.description}</p>
                  <p className="text-body-sm text-text-secondary">Ref: {pendingItem.id}</p>
                </div>
                <p className="text-body font-bold text-text-primary">
                  ₱{pendingItem.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-body-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Select Payment</p>
            <div className="flex flex-col gap-2">
              {PAYMENT_ITEMS.map(item => (
                <button key={item.id} onClick={() => setSelected(selected?.id === item.id ? null : item)}
                  className={`w-full border rounded-lg p-4 text-left transition-all ${selected?.id === item.id ? 'border-primary bg-primary-light' : 'border-border bg-white hover:shadow-card-hover'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-body font-semibold text-text-primary">{item.label}</p>
                      <p className="text-body-sm text-text-secondary">{item.agency}</p>
                    </div>
                    <p className="text-body font-bold text-text-primary">
                      ₱{item.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {(selected || pendingItem) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col gap-4">
            <div>
              <p className="text-body-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Payment Method</p>
              <div className="grid grid-cols-2 gap-2">
                {['GCash', 'PayMaya', 'Debit Card', 'Online Banking'].map(m => (
                  <button key={m} onClick={() => setPayMethod(m)}
                    className={`h-12 rounded-lg border text-body-sm font-semibold transition-all ${payMethod === m ? 'bg-primary text-white border-primary' : 'bg-white border-border text-text-secondary hover:border-primary'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {error && (
              <div className="bg-error/10 border border-error rounded-lg p-3 text-error text-body-sm mb-2">
                {error}
              </div>
            )}
            <Button variant="primary" fullWidth size="lg" isLoading={isLoading} onClick={handlePay} disabled={!payMethod}>
              Pay ₱{(pendingItem?.amount ?? selected?.amount ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </Button>
          </motion.div>
        )}
      </ScreenContainer>
    </div>
  );
}
