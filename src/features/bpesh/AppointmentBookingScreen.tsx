/**
 * AppointmentBookingScreen — NBI / Police Clearance booking
 * Service → Date/Time → Review → Confirm → Reference number
 */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { db } from '../../mock/db';

type Stage = 'service' | 'schedule' | 'review' | 'done';

const SERVICES = ['NBI Clearance', 'Police Clearance'];
const TIME_SLOTS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

function generateRef() { return 'EGOV-' + Date.now().toString(36).toUpperCase(); }

export function AppointmentBookingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselect = (location.state as { service?: string })?.service;

  const [stage, setStage] = useState<Stage>(preselect ? 'schedule' : 'service');
  const [selectedService, setSelectedService] = useState(preselect ? `${preselect} Clearance` : '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refNumber, setRefNumber] = useState('');

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const ref = generateRef();
    setRefNumber(ref);
    const appointments = db.get<unknown[]>('appointments') ?? [];
    db.set('appointments', [...appointments, { id: ref, serviceType: selectedService, scheduledFor: `${selectedDate} ${selectedTime}`, referenceNumber: ref, status: 'booked' }]);
    setIsLoading(false);
    setStage('done');
  };

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Book Appointment" showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-5">
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
                    className="w-full bg-white border border-border rounded-lg p-4 flex items-center gap-3 text-left hover:shadow-card-hover hover:border-primary/20 transition-all">
                    <div className="w-11 h-11 bg-primary-light rounded-xl flex items-center justify-center text-2xl">
                      {s.includes('NBI') ? '🔍' : '👮'}
                    </div>
                    <div className="flex-1">
                      <p className="text-body font-semibold text-text-primary">{s}</p>
                      <p className="text-body-sm text-text-secondary">Processing time: 1–3 business days</p>
                    </div>
                    <span className="text-text-secondary" aria-hidden="true">›</span>
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
              <Input label="Appointment Date" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={minDate} />
              <div className="flex flex-col gap-2">
                <label className="text-label text-text-secondary uppercase tracking-wider">Available Time Slots</label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map(t => (
                    <button key={t} onClick={() => setSelectedTime(t)}
                      className={`h-10 rounded-md text-xs font-semibold transition-all ${selectedTime === t ? 'bg-primary text-white' : 'bg-bg border border-border text-text-secondary hover:border-primary'}`}>
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
                  { label: 'Date', value: new Date(selectedDate).toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                  { label: 'Time', value: selectedTime },
                  { label: 'Purpose', value: purpose || 'Not specified' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between px-4 py-3">
                    <span className="text-body-sm text-text-secondary">{label}</span>
                    <span className="text-body-sm text-text-primary font-semibold">{value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-primary-light rounded-lg p-4 text-body-sm text-primary">
                📋 Please bring a valid government ID on the day of your appointment.
              </div>
              <Button variant="primary" fullWidth size="lg" isLoading={isLoading} onClick={handleConfirm}>
                Confirm Appointment
              </Button>
              <Button variant="ghost" fullWidth onClick={() => setStage('schedule')}>Edit Details</Button>
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
              <div className="w-full bg-white border border-border rounded-lg p-4">
                <p className="text-body-sm text-text-secondary">Reference Number</p>
                <p className="text-h2 font-bold text-primary font-mono mt-1">{refNumber}</p>
                <p className="text-body-sm text-text-secondary mt-2">Screenshot this for your records.</p>
              </div>
              <div className="w-full bg-bg rounded-lg p-4 text-body-sm text-text-secondary">
                <p><strong>{selectedService}</strong></p>
                <p>{selectedDate} · {selectedTime}</p>
              </div>
              <div className="flex gap-3 w-full">
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
