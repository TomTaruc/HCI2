/**
 * AppointmentBookingScreen — NBI / Police Clearance booking
 * Service → Date/Time → Review → Confirm → Reference number
 */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Search, Shield, FileText } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { db } from '../../mock/db';
import { useAuth } from '../../state/AuthContext';
import { createPendingPayment } from '../../mock/services/paymentService';

type Stage = 'service' | 'schedule' | 'review' | 'done';

const SERVICES = ['NBI Clearance', 'Police Clearance'];
const TIME_SLOTS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

function generateRef() { return 'EGOV-' + Date.now().toString(36).toUpperCase(); }

// Helper to get YYYY-MM-DD in Manila timezone
function getManilaDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

export function AppointmentBookingScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const preselect = (location.state as { service?: string })?.service;

  const [stage, setStage] = useState<Stage>(preselect ? 'schedule' : 'service');
  const [selectedService, setSelectedService] = useState(preselect ? `${preselect} Clearance` : '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [error, setError] = useState('');

  // Handle return from eGovPay
  React.useEffect(() => {
    const state = location.state as { paymentSuccess?: boolean; paymentId?: string };
    if (state?.paymentSuccess && state?.paymentId && stage !== 'done') {
      const list = db.get<any[]>('appointments') ?? [];
      const p = list.find(a => a.id === state.paymentId && a.userId === user?.id);
      if (p) {
        setRefNumber(p.referenceNumber);
        setSelectedService(p.serviceType);
        const [d, t] = p.scheduledFor.split(' ');
        setSelectedDate(d);
        setSelectedTime(t);
        setStage('done');
        navigate('.', { replace: true, state: {} });
      }
    }
  }, [location.state, navigate, stage, user?.id]);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = getManilaDateString(tomorrow);

  const handleConfirm = async () => {
    // Validate that selected date is not in the past
    // selectedDate is "YYYY-MM-DD"
    if (selectedDate < minDate) {
      setError('Please select a future date for your appointment.');
      return;
    }
    setError('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const ref = generateRef();
    setRefNumber(ref);
    const appointments = db.get<unknown[]>('appointments') ?? [];
    const ok = db.set('appointments', [...appointments, { 
      id: ref, 
      userId: user?.id,
      serviceType: selectedService, 
      scheduledFor: `${selectedDate} ${selectedTime}`, 
      referenceNumber: ref, 
      status: 'booked' 
    }]);
    setIsLoading(false);
    
    if (!ok) {
      setError('Booking failed. Please try again.');
      return;
    }
    
    // Redirect to eGovPay for payment
    createPendingPayment({
      id: ref,
      userId: user!.id,
      sourceService: 'appointments',
      amount: selectedService.includes('NBI') ? 130 : 150,
      description: `${selectedService} Fee`,
      returnTo: '/bpesh/appointment'
    });
    
    navigate('/egovpay', { state: { pendingPaymentId: ref } });
  };

  const getDisplayDate = (isoDate: string) => {
    // Force UTC interpretation to avoid local timezone offset shifting the day
    return new Date(isoDate + 'T00:00:00Z').toLocaleDateString('en-PH', { 
      timeZone: 'UTC', // We're formatting the literal date selected
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex-1 flex flex-col relative">
      <AppBar title="Book Appointment" showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-5 pb-20">
        <motion.div key={stage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex flex-col gap-5">

          {/* Service selection */}
          {stage === 'service' && (
            <>
              <div>
                <h1 className="text-h1 font-bold text-text-primary">Select Service</h1>
                <p className="text-body text-text-secondary mt-1">Choose the appointment type you need.</p>
              </div>
              <div className="flex flex-col gap-3">
                {SERVICES.map(s => (
                  <button key={s} onClick={() => { setSelectedService(s); setStage('schedule'); }}
                    className="w-full bg-white border border-border rounded-lg p-4 flex items-center gap-4 text-left hover:shadow-card-hover hover:border-primary/20 transition-all">
                    <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center shrink-0">
                      {s.includes('NBI') ? <Search size={24} className="text-primary" /> : <Shield size={24} className="text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-semibold text-text-primary">{s}</p>
                      <p className="text-body-sm text-text-secondary truncate">Processing time: 1–3 business days</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Schedule */}
          {stage === 'schedule' && (
            <>
              <div>
                <p className="text-body-sm text-primary font-semibold mb-1">Booking: {selectedService}</p>
                <h1 className="text-h1 font-bold text-text-primary">Select Date & Time</h1>
              </div>
              <Input 
                label="Appointment Date" 
                type="date" 
                value={selectedDate} 
                onChange={e => { setSelectedDate(e.target.value); setError(''); }} 
                min={minDate} 
                error={error}
              />
              <div className="flex flex-col gap-2">
                <label className="text-label text-text-secondary uppercase tracking-wider">Available Time Slots</label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map(t => (
                    <button key={t} onClick={() => setSelectedTime(t)}
                      className={`h-10 rounded-md text-xs font-semibold transition-all ${selectedTime === t ? 'bg-primary text-white shadow-sm' : 'bg-white border border-border text-text-secondary hover:border-primary/50'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Purpose" placeholder="e.g., Employment, Travel, Local" value={purpose} onChange={e => setPurpose(e.target.value)} />
              <Button variant="primary" fullWidth size="lg" onClick={() => setStage('review')} disabled={!selectedDate || !selectedTime}>
                Review Appointment
              </Button>
            </>
          )}

          {/* Review */}
          {stage === 'review' && (
            <>
              <h1 className="text-h1 font-bold text-text-primary">Review & Confirm</h1>
              <div className="bg-white border border-border rounded-lg divide-y divide-border">
                {[
                  { label: 'Service', value: selectedService },
                  { label: 'Date', value: getDisplayDate(selectedDate) },
                  { label: 'Time', value: selectedTime },
                  { label: 'Purpose', value: purpose || 'Not specified' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between px-4 py-3 gap-3">
                    <span className="text-body-sm text-text-secondary shrink-0">{label}</span>
                    <span className="text-body-sm text-text-primary font-semibold text-right">{value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-primary-light rounded-lg p-4 flex gap-3 items-start">
                <FileText size={20} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-body-sm text-primary font-medium">
                  Please bring a valid government ID on the day of your appointment.
                </p>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <Button variant="primary" fullWidth size="lg" isLoading={isLoading} onClick={handleConfirm}>
                  Confirm Appointment
                </Button>
                <Button variant="ghost" fullWidth onClick={() => setStage('schedule')}>Edit Details</Button>
              </div>
            </>
          )}

          {/* Done */}
          {stage === 'done' && (
            <div className="flex flex-col items-center gap-5 py-6 text-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle size={44} className="text-success" />
              </div>
              <div>
                <h1 className="text-h1 font-bold text-text-primary">Appointment Booked!</h1>
                <p className="text-body text-text-secondary mt-1">Your appointment has been confirmed.</p>
              </div>
              <div className="w-full bg-white border border-border rounded-lg p-5">
                <p className="text-body-sm text-text-secondary">Reference Number</p>
                <p className="text-h2 font-bold text-primary font-mono mt-1 tracking-wider">{refNumber}</p>
                <p className="text-xs text-text-secondary mt-2 bg-bg px-2 py-1 rounded-md inline-block">Screenshot this for your records.</p>
              </div>
              <div className="w-full bg-bg border border-border rounded-lg p-4 text-body-sm text-text-secondary">
                <p className="font-semibold text-text-primary mb-1">{selectedService}</p>
                <p>{getDisplayDate(selectedDate)}</p>
                <p>{selectedTime}</p>
              </div>
              <div className="flex gap-3 w-full mt-4">
                <Button variant="outline" fullWidth onClick={() => navigate('/bpesh')}>Back to Services</Button>
                <Button variant="primary" fullWidth onClick={() => navigate('/home')}>Go Home</Button>
              </div>
            </div>
          )}
        </motion.div>
      </ScreenContainer>
    </div>
  );
}
