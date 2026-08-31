/**
 * PSADocumentScreen — Request PSA civil registry documents
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { db } from '../../mock/db';

type Stage = 'type' | 'details' | 'delivery' | 'review' | 'done';
const DOC_TYPES = ['Birth Certificate', 'Marriage Certificate', 'Death Certificate'];

export function PSADocumentScreen() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('type');
  const [docType, setDocType] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [registrationPlace, setRegistrationPlace] = useState('');
  const [delivery, setDelivery] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refNumber, setRefNumber] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const ref = 'PSA-' + Date.now().toString(36).toUpperCase();
    setRefNumber(ref);
    const reqs = db.get<unknown[]>('psaRequests') ?? [];
    db.set('psaRequests', [...reqs, { id: ref, docType, status: 'processing' }]);
    setIsLoading(false);
    setStage('done');
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="PSA Documents" showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-5">
        <motion.div key={stage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">

          {stage === 'type' && (
            <>
              <h1 className="text-h1 font-bold text-text-primary">Request PSA Document</h1>
              <p className="text-body text-text-secondary">Select the civil registry document you need.</p>
              {DOC_TYPES.map(t => (
                <button key={t} onClick={() => { setDocType(t); setStage('details'); }}
                  className="w-full bg-white border border-border rounded-lg p-4 flex items-center gap-3 text-left hover:shadow-card-hover hover:border-primary/20 transition-all">
                  <span className="text-2xl">📄</span>
                  <div className="flex-1">
                    <p className="text-body font-semibold text-text-primary">{t}</p>
                    <p className="text-body-sm text-text-secondary">Official PSA-authenticated copy</p>
                  </div>
                  <span className="text-text-secondary" aria-hidden="true">›</span>
                </button>
              ))}
            </>
          )}

          {stage === 'details' && (
            <>
              <p className="text-body-sm text-primary font-semibold">Requesting: {docType}</p>
              <h1 className="text-h1 font-bold text-text-primary">Requester Details</h1>
              <Input label="Full Name (as on the document)" placeholder="Enter full legal name" value={fullName} onChange={e => setFullName(e.target.value)} />
              <Input label="Date of Birth" type="date" value={dob} onChange={e => setDob(e.target.value)} />
              <Input label="Place of Registration" placeholder="e.g., Quezon City, Metro Manila" value={registrationPlace} onChange={e => setRegistrationPlace(e.target.value)} />
              <Button variant="primary" fullWidth size="lg" onClick={() => setStage('delivery')} disabled={!fullName || !dob}>Continue</Button>
            </>
          )}

          {stage === 'delivery' && (
            <>
              <h1 className="text-h1 font-bold text-text-primary">Delivery Method</h1>
              {[{ v: 'pickup', l: '🏢 Pickup at PSA Office', d: 'Available within 3–5 business days' },
                { v: 'mail', l: '📮 Mail Delivery', d: 'Delivered to your address within 5–7 days' }].map(opt => (
                <button key={opt.v} onClick={() => setDelivery(opt.v)}
                  className={`w-full border rounded-lg p-4 text-left transition-all ${delivery === opt.v ? 'border-primary bg-primary-light' : 'border-border bg-white'}`}>
                  <p className="text-body font-semibold text-text-primary">{opt.l}</p>
                  <p className="text-body-sm text-text-secondary">{opt.d}</p>
                </button>
              ))}
              {delivery === 'mail' && (
                <Input label="Delivery Address" placeholder="Enter your full address" value={address} onChange={e => setAddress(e.target.value)} />
              )}
              <Button variant="primary" fullWidth size="lg" onClick={() => setStage('review')} disabled={!delivery}>Continue</Button>
            </>
          )}

          {stage === 'review' && (
            <>
              <h1 className="text-h1 font-bold text-text-primary">Review & Submit</h1>
              <div className="bg-white border border-border rounded-lg divide-y divide-border">
                {[{ l: 'Document', v: docType }, { l: 'Name', v: fullName }, { l: 'Delivery', v: delivery === 'pickup' ? 'PSA Office Pickup' : 'Mail Delivery' }].map(({ l, v }) => (
                  <div key={l} className="flex justify-between px-4 py-3">
                    <span className="text-body-sm text-text-secondary">{l}</span>
                    <span className="text-body-sm font-semibold text-text-primary">{v}</span>
                  </div>
                ))}
              </div>
              <Button variant="primary" fullWidth size="lg" isLoading={isLoading} onClick={handleSubmit}>Submit Request</Button>
              <Button variant="ghost" fullWidth onClick={() => setStage('details')}>Edit</Button>
            </>
          )}

          {stage === 'done' && (
            <div className="flex flex-col items-center gap-5 py-6 text-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center"><CheckCircle size={44} className="text-success" /></div>
              <h1 className="text-h1 font-bold text-text-primary">Request Submitted!</h1>
              <div className="w-full bg-white border border-border rounded-lg p-4">
                <p className="text-body-sm text-text-secondary">Tracking Reference</p>
                <p className="text-h2 font-bold text-primary font-mono mt-1">{refNumber}</p>
              </div>
              <p className="text-body text-text-secondary">Processing time: 3–5 business days. You will be notified when your document is ready.</p>
              <div className="flex gap-3 w-full">
                <Button variant="outline" fullWidth onClick={() => navigate('/bpesh')}>Back to BPESH</Button>
                <Button variant="primary" fullWidth onClick={() => navigate('/home')}>Go Home</Button>
              </div>
            </div>
          )}
        </motion.div>
      </ScreenContainer>
    </div>
  );
}
