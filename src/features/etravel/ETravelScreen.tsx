/**
 * ETravelScreen — electronic travel declaration (accessible without login)
 * Inbound / Outbound traveler declaration form
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, CheckCircle } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { db } from '../../mock/db';

type Stage = 'type' | 'personal' | 'travel' | 'health' | 'done';

export function ETravelScreen() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('type');
  const [travelType, setTravelType] = useState<'inbound' | 'outbound'>('inbound');
  const [isLoading, setIsLoading] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', passport: '', nationality: 'Filipino', flightNumber: '', departureDate: '', arrivalDate: '', origin: '', destination: '', purpose: '', vaccine: '' });
  // H-07: Track health declaration answers
  const [healthAnswers, setHealthAnswers] = useState<Record<number, 'Yes' | 'No'>>({});
  const HEALTH_QUESTIONS = [
    'Do you have a fever (38\u00b0C or above) or any flu-like symptoms?',
    'Have you had close contact with a confirmed case in the past 14 days?',
    'Have you traveled to any country with a health alert in the past 14 days?',
  ];

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));
  const setHealthAnswer = (idx: number, ans: 'Yes' | 'No') => setHealthAnswers(p => ({ ...p, [idx]: ans }));

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const ref = 'ET-' + Date.now().toString(36).toUpperCase();
    setRefNumber(ref);
    const declarations = db.get<unknown[]>('etravelDeclarations') ?? [];
    // H-07: Include health answers in payload
    const healthDeclaration = HEALTH_QUESTIONS.reduce((acc, q, i) => ({ ...acc, [q]: healthAnswers[i] ?? 'Not answered' }), {});
    db.set('etravelDeclarations', [...declarations, { id: ref, travelType, ...form, healthDeclaration }]);
    setIsLoading(false);
    setStage('done');
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="eTravel" showBack={stage !== 'type'} onBack={() => setStage(stage === 'personal' ? 'type' : stage === 'travel' ? 'personal' : stage === 'health' ? 'travel' : 'type')} />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-5">
        <motion.div key={stage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">

          {stage === 'type' && (
            <>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center"><Plane size={24} className="text-primary" /></div>
                <div>
                  <h1 className="text-h1 font-bold text-text-primary">eTravel Declaration</h1>
                  <p className="text-body-sm text-text-secondary">BOC · BID · DOH · BOQ electronic declaration</p>
                </div>
              </div>
              <div className="bg-primary-light border border-primary/20 rounded-lg p-4">
                <p className="text-body-sm text-primary font-medium">
                  All incoming and outgoing international travelers must complete this declaration. This replaces paper declaration forms.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {(['inbound', 'outbound'] as const).map(t => (
                  <button key={t} onClick={() => { setTravelType(t); setStage('personal'); }}
                    className="w-full bg-white border border-border rounded-lg p-4 flex items-center gap-3 text-left hover:shadow-card-hover hover:border-primary/20 transition-all">
                    <span className="text-3xl">{t === 'inbound' ? '🛬' : '🛫'}</span>
                    <div className="flex-1">
                      <p className="text-body font-bold text-text-primary capitalize">{t} Traveler</p>
                      <p className="text-body-sm text-text-secondary">
                        {t === 'inbound' ? 'Arriving in the Philippines' : 'Departing from the Philippines'}
                      </p>
                    </div>
                    <span className="text-text-secondary" aria-hidden="true">›</span>
                  </button>
                ))}
              </div>
              <div className="text-center">
                <p className="text-body-sm text-text-secondary">Accessible without an account.</p>
                <button onClick={() => navigate('/welcome')} className="text-primary font-semibold hover:underline text-body-sm">
                  Log in for saved profile →
                </button>
              </div>
            </>
          )}

          {stage === 'personal' && (
            <>
              <p className="text-body-sm text-primary font-semibold capitalize">{travelType} Traveler</p>
              <h2 className="text-h1 font-bold text-text-primary">Personal Information</h2>
              <Input label="First Name" value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="As on your passport" />
              <Input label="Last Name" value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="As on your passport" />
              <Input label="Passport Number" value={form.passport} onChange={e => update('passport', e.target.value)} placeholder="e.g., P1234567A" />
              <Input label="Nationality" value={form.nationality} onChange={e => update('nationality', e.target.value)} />
              <Button variant="primary" fullWidth size="lg" onClick={() => setStage('travel')} disabled={!form.firstName || !form.lastName || !form.passport}>Continue</Button>
            </>
          )}

          {stage === 'travel' && (
            <>
              <h2 className="text-h1 font-bold text-text-primary">Travel Information</h2>
              <Input label="Flight Number" value={form.flightNumber} onChange={e => update('flightNumber', e.target.value)} placeholder="e.g., PR302" />
              {travelType === 'inbound' ? (
                <>
                  <Input label="Origin (City/Country)" value={form.origin} onChange={e => update('origin', e.target.value)} placeholder="e.g., Tokyo, Japan" />
                  <Input label="Date of Arrival" type="date" value={form.arrivalDate} onChange={e => update('arrivalDate', e.target.value)} />
                </>
              ) : (
                <>
                  <Input label="Destination (City/Country)" value={form.destination} onChange={e => update('destination', e.target.value)} placeholder="e.g., Singapore" />
                  <Input label="Date of Departure" type="date" value={form.departureDate} onChange={e => update('departureDate', e.target.value)} />
                </>
              )}
              <Input label="Purpose of Travel" placeholder="e.g., Tourism, Business, Medical" value={form.purpose} onChange={e => update('purpose', e.target.value)} />
              <Button variant="primary" fullWidth size="lg" onClick={() => setStage('health')} disabled={!form.flightNumber}>Continue</Button>
            </>
          )}

          {stage === 'health' && (
            <>
              <h2 className="text-h1 font-bold text-text-primary">Health Declaration</h2>
              <div className="flex flex-col gap-3">
                {/* H-07: Health questions with tracked answers and visual selection */}
                {HEALTH_QUESTIONS.map((q, i) => (
                  <div key={i} className="bg-white border border-border rounded-lg p-4">
                    <p className="text-body-sm text-text-primary">{q}</p>
                    <div className="flex gap-3 mt-2">
                      {(['Yes', 'No'] as const).map(a => (
                        <button key={a} onClick={() => setHealthAnswer(i, a)}
                          className={`flex-1 h-9 border rounded-md text-body-sm font-semibold transition-all ${
                            healthAnswers[i] === a
                              ? a === 'Yes' ? 'bg-error text-white border-error' : 'bg-success text-white border-success'
                              : 'border-border text-text-secondary hover:border-primary hover:bg-primary-light'
                          }`}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <Input label="COVID-19 Vaccination Status" placeholder="e.g., Fully vaccinated — Pfizer (3 doses)" value={form.vaccine} onChange={e => update('vaccine', e.target.value)} />
              </div>
              <Button variant="primary" fullWidth size="lg" isLoading={isLoading} onClick={handleSubmit}
                disabled={HEALTH_QUESTIONS.some((_, i) => !healthAnswers[i])}>
                Submit Declaration
              </Button>
              {HEALTH_QUESTIONS.some((_, i) => !healthAnswers[i]) && (
                <p className="text-body-sm text-text-secondary text-center">Please answer all health questions to continue.</p>
              )}
            </>
          )}

          {stage === 'done' && (
            <div className="flex flex-col items-center gap-5 py-6 text-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center"><CheckCircle size={44} className="text-success" /></div>
              <h1 className="text-h1 font-bold text-text-primary">Declaration Submitted!</h1>
              <div className="w-full bg-white border border-border rounded-lg p-4">
                <p className="text-body-sm text-text-secondary">eTravel Reference Number</p>
                <p className="text-h2 font-bold text-primary font-mono mt-1">{refNumber}</p>
                <p className="text-body-sm text-text-secondary mt-2">Show this to immigration upon arrival/departure.</p>
              </div>
              <Button variant="primary" fullWidth onClick={() => navigate('/home')}>Go Home</Button>
            </div>
          )}
        </motion.div>
      </ScreenContainer>
    </div>
  );
}
