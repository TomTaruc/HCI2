/**
 * ConsultationScreen — Submit a concern/query to a government agency
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { db } from '../../mock/db';

const AGENCIES = ['SSS', 'PhilHealth', 'Pag-IBIG', 'GSIS', 'BIR', 'DFA', 'LTO', 'NBI', 'PSA', 'DICT', 'Other'];

export function ConsultationScreen() {
  const navigate = useNavigate();
  const [agency, setAgency] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [refNumber, setRefNumber] = useState('');

  const handleSubmit = async () => {
    if (!agency || !subject || !message) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const ref = 'CON-' + Date.now().toString(36).toUpperCase();
    setRefNumber(ref);
    const concerns = db.get<unknown[]>('concerns') ?? [];
    db.set('concerns', [...concerns, { id: ref, agency, subject, message, status: 'pending' }]);
    setIsLoading(false);
    setDone(true);
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Consultation" showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-5">
        {!done ? (
          <>
            <div>
              <h1 className="text-h1 font-bold text-text-primary">Submit a Concern</h1>
              <p className="text-body text-text-secondary mt-1">Send your concern or query to a government agency for a formal response.</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-label text-text-secondary uppercase tracking-wider">Agency</label>
              <select value={agency} onChange={e => setAgency(e.target.value)}
                className="w-full h-12 px-4 bg-white border border-border rounded-md text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option value="">Select agency…</option>
                {AGENCIES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <Input label="Subject" placeholder="Brief description of your concern" value={subject} onChange={e => setSubject(e.target.value)} />
            <div className="flex flex-col gap-1.5">
              <label className="text-label text-text-secondary uppercase tracking-wider">Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
                placeholder="Describe your concern in detail…"
                className="w-full px-4 py-3 bg-white border border-border rounded-md text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>
            <div className="bg-primary-light rounded-lg p-4 text-body-sm text-primary">
              📋 Agencies are required to respond within 15 business days under Republic Act 11032 (ARTA).
            </div>
            <Button variant="primary" fullWidth size="lg" isLoading={isLoading} onClick={handleSubmit} disabled={!agency || !subject || !message}>Submit Concern</Button>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 py-6 text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center"><CheckCircle size={44} className="text-success" /></div>
            <h1 className="text-h1 font-bold text-text-primary">Concern Submitted!</h1>
            <div className="w-full bg-white border border-border rounded-lg p-4">
              <p className="text-body-sm text-text-secondary">Ticket Number</p>
              <p className="text-h2 font-bold text-primary font-mono mt-1">{refNumber}</p>
              <p className="text-body-sm text-text-secondary mt-2">Expected response: within 15 business days.</p>
            </div>
            <div className="flex gap-3 w-full">
              <Button variant="outline" fullWidth onClick={() => navigate(-1)}>Back</Button>
              <Button variant="primary" fullWidth onClick={() => navigate('/home')}>Go Home</Button>
            </div>
          </motion.div>
        )}
      </ScreenContainer>
    </div>
  );
}
