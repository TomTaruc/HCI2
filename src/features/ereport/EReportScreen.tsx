/**
 * EReportScreen — non-emergency incident reporting
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { db } from '../../mock/db';

const INCIDENT_TYPES = ['Road Obstruction', 'Illegal Dumping', 'Broken Infrastructure', 'Noise Complaint', 'Missing Signage', 'Water Leak', 'Power Outage', 'Other'];

export function EReportScreen() {
  const navigate = useNavigate();
  const [incidentType, setIncidentType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [refNumber, setRefNumber] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const ref = 'RPT-' + Date.now().toString(36).toUpperCase();
    setRefNumber(ref);
    const reports = db.get<unknown[]>('reports') ?? [];
    db.set('reports', [...reports, { id: ref, incidentType, location, description, status: 'received' }]);
    setIsLoading(false);
    setDone(true);
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="eReport" showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-5">
        {!done ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center"><AlertTriangle size={24} className="text-error" /></div>
              <div>
                <h1 className="text-h1 font-bold text-text-primary">File a Report</h1>
                <p className="text-body-sm text-text-secondary">Non-emergency community reports</p>
              </div>
            </div>
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
              <p className="text-body-sm text-text-primary font-medium">
                ⚠ For emergencies (fire, crime, medical), call 911 directly. This form is for non-emergency community reports only.
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-label text-text-secondary uppercase tracking-wider">Incident Type</label>
              <div className="grid grid-cols-2 gap-2">
                {INCIDENT_TYPES.map(t => (
                  <button key={t} onClick={() => setIncidentType(t)}
                    className={`h-12 px-3 rounded-lg text-body-sm font-semibold transition-all border ${incidentType === t ? 'bg-primary text-white border-primary' : 'bg-white border-border text-text-secondary hover:border-primary'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <Input label="Location" placeholder="e.g., Barangay Bahay Toro, Quezon City" value={location} onChange={e => setLocation(e.target.value)} />
            <div className="flex flex-col gap-1.5">
              <label className="text-label text-text-secondary uppercase tracking-wider">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                placeholder="Describe the incident in detail…"
                className="w-full px-4 py-3 bg-white border border-border rounded-md text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>
            <Button variant="primary" fullWidth size="lg" isLoading={isLoading} onClick={handleSubmit} disabled={!incidentType || !location || !description}>Submit Report</Button>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 py-6 text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center"><CheckCircle size={44} className="text-success" /></div>
            <h1 className="text-h1 font-bold text-text-primary">Report Submitted!</h1>
            <div className="w-full bg-white border border-border rounded-lg p-4">
              <p className="text-body-sm text-text-secondary">Report Reference</p>
              <p className="text-h2 font-bold text-primary font-mono mt-1">{refNumber}</p>
              <p className="text-body-sm text-text-secondary mt-2">Your report has been forwarded to the appropriate agency.</p>
            </div>
            <div className="flex gap-3 w-full">
              <Button variant="outline" fullWidth onClick={() => { setDone(false); setIncidentType(''); setLocation(''); setDescription(''); }}>File Another</Button>
              <Button variant="primary" fullWidth onClick={() => navigate('/home')}>Go Home</Button>
            </div>
          </motion.div>
        )}
      </ScreenContainer>
    </div>
  );
}
