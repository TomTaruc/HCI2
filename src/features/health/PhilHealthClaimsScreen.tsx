import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { CheckCircle, Upload, X, FileText, Clock, Plus, Download } from 'lucide-react';
import { db, delay } from '../../mock/db';
import { saveFile, getFile } from '../../mock/fileStore';
import { getAgencyById } from '../../mock/services/agencyService';
import { useAuth } from '../../state/AuthContext';
import { motion } from 'framer-motion';

interface ClaimRequest {
  id: string;
  userId: string;
  patientName: string;
  hospitalName: string;
  dateAdmitted: string;
  fileName?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export function PhilHealthClaimsScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isLinked, setIsLinked] = useState(false);
  const [step, setStep] = useState<'info' | 'history' | 'form' | 'review' | 'success'>('info');
  const [formData, setFormData] = useState({ patientName: '', hospitalName: '', dateAdmitted: '' });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refNum, setRefNum] = useState('');
  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const agency = await getAgencyById(user.id, 'philhealth');
        setIsLinked(agency.linked);
        
        const allClaims = db.get<ClaimRequest[]>('philhealth_claims') || [];
        setClaims(allClaims.filter(c => c.userId === user.id).sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [user, step]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setFileError('File size must be under 5MB.');
      return;
    }
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(f.type)) {
      setFileError('Invalid file type.');
      return;
    }
    setFile(f);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await delay(1200);
    
    const newReqId = `PHIC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const newClaim: ClaimRequest = {
      id: newReqId,
      userId: user!.id,
      patientName: formData.patientName,
      hospitalName: formData.hospitalName,
      dateAdmitted: formData.dateAdmitted,
      fileName: file?.name,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    if (file) {
      try {
        await saveFile(newReqId, file);
      } catch (err) {
        setFileError('Failed to save document attachment. Please try again.');
        setIsSubmitting(false);
        setStep('form');
        return;
      }
    }

    const allClaims = db.get<ClaimRequest[]>('philhealth_claims') || [];
    allClaims.push(newClaim);
    const ok = db.set('philhealth_claims', allClaims);
    
    if (!ok) {
      setFileError('Failed to save claim request. Storage might be full.');
      setIsSubmitting(false);
      setStep('form');
      return;
    }
    
    setRefNum(newReqId);
    setIsSubmitting(false);
    setStep('success');
  };

  return (
    <div className="flex-1 flex flex-col bg-bg">
      <AppBar title="Benefits & Claims" onBack={() => {
        if (step === 'info' || step === 'success') navigate(-1);
        else if (step === 'history') setStep('info');
        else if (step === 'form') claims.length > 0 ? setStep('history') : setStep('info');
        else if (step === 'review') setStep('form');
      }} />
      <div className="bp-stripe" aria-hidden="true" />
      
      <ScreenContainer className="pt-4 pb-20 gap-4">
        {!isLinked ? (
          <Card padding="md" className="text-center flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 bg-warning-light text-warning rounded-full flex items-center justify-center text-2xl">!</div>
            <div>
              <h2 className="text-h2 font-bold text-text-primary">Account Not Linked</h2>
              <p className="text-body text-text-secondary mt-2">You must link your PhilHealth account to file or view claims.</p>
            </div>
            <Button variant="primary" onClick={() => navigate('/agencies/philhealth')}>Link Account Now</Button>
          </Card>
        ) : (
          <>
            {step === 'info' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                <h1 className="text-h1 font-bold text-text-primary">File a Claim</h1>
                <p className="text-body-sm text-text-secondary">Submit a claim request for recent hospitalizations or medical procedures.</p>

                <Card padding="md">
                  <h2 className="text-body font-semibold text-text-primary mb-2">Requirements</h2>
                  <ul className="list-disc pl-5 space-y-1 text-body-sm text-text-secondary">
                    <li>Duly accomplished PhilHealth Claim Form</li>
                    <li>Statement of Account from the hospital</li>
                    <li>Medical Certificate or Operative Record</li>
                  </ul>
                </Card>

                <Button variant="primary" onClick={() => claims.length > 0 ? setStep('history') : setStep('form')}>
                  {claims.length > 0 ? 'View Claims History' : 'Start Claim Application'}
                </Button>
              </motion.div>
            )}

            {step === 'history' && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-h2 font-bold text-text-primary">Claims History</h2>
                  <Button variant="outline" size="sm" onClick={() => { setFormData({patientName:'', hospitalName:'', dateAdmitted:''}); setFile(null); setStep('form'); }}>
                    <Plus size={16} /> New
                  </Button>
                </div>
                {claims.map(claim => (
                  <Card key={claim.id} padding="md" className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <span className="text-body font-semibold text-primary font-mono">{claim.id}</span>
                      <span className="text-xs font-semibold uppercase px-2 py-1 bg-warning-light text-warning rounded-full">{claim.status}</span>
                    </div>
                    <p className="text-body-sm font-medium">{claim.patientName} - {claim.hospitalName}</p>
                    <div className="flex items-center gap-1 text-xs text-text-secondary">
                      <Clock size={12} />
                      <span>{new Date(claim.submittedAt).toLocaleDateString()}</span>
                    </div>
                    {claim.fileName && (
                      <Button variant="ghost" size="sm" className="mt-2 text-left w-fit -ml-2" onClick={async () => {
                        try {
                          const f = await getFile(claim.id);
                          if (f) {
                            const url = URL.createObjectURL(f);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = claim.fileName || 'Claim_Document';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          } else {
                            alert("Claim document not found.");
                          }
                        } catch (err) {
                          console.error(err);
                          alert("Error retrieving claim document.");
                        }
                      }}>
                        <Download size={16} className="mr-1" /> {claim.fileName}
                      </Button>
                    )}
                  </Card>
                ))}
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4">
                <h2 className="text-h2 font-bold text-text-primary">Claim Details</h2>
                <Card className="flex flex-col gap-4">
                  <Input label="Patient Name" placeholder="Full name of patient" value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} />
                  <Input label="Hospital / Facility Name" placeholder="Name of admitted facility" value={formData.hospitalName} onChange={e => setFormData({ ...formData, hospitalName: e.target.value })} />
                  <Input label="Date Admitted" type="date" max={new Date().toISOString().split('T')[0]} value={formData.dateAdmitted} onChange={e => setFormData({ ...formData, dateAdmitted: e.target.value })} />
                  
                  <div>
                    <p className="text-body-sm font-semibold mb-2">Supporting Documents</p>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
                    {!file ? (
                      <button onClick={() => fileInputRef.current?.click()} className="w-full border border-dashed border-border rounded-lg p-4 text-center hover:bg-bg transition-colors">
                        <Upload size={24} className="text-text-secondary mx-auto mb-2" />
                        <p className="text-body-sm text-text-secondary">Tap to upload files</p>
                      </button>
                    ) : (
                      <div className="border border-border rounded-lg p-3 flex items-center justify-between bg-bg">
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-primary" />
                          <p className="text-body-sm font-semibold truncate">{file.name}</p>
                        </div>
                        <button onClick={() => setFile(null)} className="p-2 text-text-secondary hover:text-error"><X size={18} /></button>
                      </div>
                    )}
                    {fileError && <p className="text-xs text-error mt-1">{fileError}</p>}
                  </div>
                </Card>
                <Button variant="primary" size="lg" disabled={!formData.patientName || !formData.hospitalName || !formData.dateAdmitted || !file} onClick={() => {
                  if (new Date(formData.dateAdmitted) > new Date()) {
                    setFileError('Date admitted cannot be in the future.');
                    return;
                  }
                  setFileError('');
                  setStep('review');
                }}>
                  Review Claim
                </Button>
              </motion.div>
            )}

            {step === 'review' && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4">
                <h2 className="text-h2 font-bold text-text-primary">Review Claim</h2>
                <Card className="flex flex-col gap-4">
                  <div>
                    <p className="text-body-sm text-text-secondary">Patient</p>
                    <p className="text-body font-medium">{formData.patientName}</p>
                  </div>
                  <div>
                    <p className="text-body-sm text-text-secondary">Hospital</p>
                    <p className="text-body font-medium">{formData.hospitalName}</p>
                  </div>
                  <div>
                    <p className="text-body-sm text-text-secondary">Date Admitted</p>
                    <p className="text-body font-medium">{formData.dateAdmitted}</p>
                  </div>
                  <div>
                    <p className="text-body-sm text-text-secondary">Documents</p>
                    <p className="text-body font-medium">{file?.name}</p>
                  </div>
                </Card>
                <Button variant="primary" size="lg" isLoading={isSubmitting} onClick={handleSubmit}>
                  Submit Claim
                </Button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center gap-6 pt-8">
                <div className="w-20 h-20 bg-success-light rounded-full flex items-center justify-center">
                  <CheckCircle size={40} className="text-success" />
                </div>
                <div>
                  <h2 className="text-h2 font-bold text-text-primary">Claim Submitted!</h2>
                  <p className="text-body text-text-secondary mt-2">Your claim has been successfully filed.</p>
                </div>
                <Card className="w-full bg-bg border-dashed">
                  <p className="text-body-sm text-text-secondary uppercase tracking-wider font-semibold mb-1">Reference Number</p>
                  <p className="text-h2 font-mono font-bold text-primary tracking-widest">{refNum}</p>
                </Card>
                <div className="w-full flex flex-col gap-3 mt-4">
                  <Button variant="primary" fullWidth onClick={() => navigate('/home')}>Back to Home</Button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </ScreenContainer>
    </div>
  );
}
