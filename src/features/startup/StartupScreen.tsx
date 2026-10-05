import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Rocket, CheckCircle, Clock, Plus, Upload, X, FileText, Download, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { db, delay } from '../../mock/db';
import { saveFile, getFile } from '../../mock/fileStore';
import { useAuth } from '../../state/AuthContext';

interface StartupRegistration {
  id: string;
  userId: string;
  startupName: string;
  sector: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  fileName?: string;
}

export function StartupScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<'info' | 'history' | 'form' | 'success'>('info');
  const [formData, setFormData] = useState({ startupName: '', sector: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrations, setRegistrations] = useState<StartupRegistration[]>([]);
  const [refNum, setRefNum] = useState('');
  
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setFileError('File size must be under 10MB.');
      return;
    }
    const allowed = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (!allowed.includes(f.type)) {
      setFileError('Please upload a PDF or PowerPoint file.');
      return;
    }
    setFile(f);
  };

  useEffect(() => {
    if (user) {
      const allStartups = db.get<StartupRegistration[]>('startup_registrations') || [];
      const userStartups = allStartups.filter(s => s.userId === user.id).sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setRegistrations(userStartups);
    }
  }, [user, step]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await delay(1200);
    
    const newReqId = `SUP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    if (file) {
      try {
        await saveFile(newReqId, file);
      } catch (err) {
        setFileError('Failed to save pitch deck attachment. Please try again.');
        setIsSubmitting(false);
        setStep('form');
        return;
      }
    }

    const newReg: StartupRegistration = {
      id: newReqId,
      userId: user!.id,
      startupName: formData.startupName,
      sector: formData.sector,
      description: formData.description,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      fileName: file?.name
    };
    
    const allStartups = db.get<StartupRegistration[]>('startup_registrations') || [];
    allStartups.push(newReg);
    const ok = db.set('startup_registrations', allStartups);
    
    if (!ok) {
      setFileError('Failed to save registration. Storage might be full.');
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
      <AppBar title="Start-Up PH" onBack={() => {
        if (step === 'info' || step === 'success') navigate(-1);
        else if (step === 'history') setStep('info');
        else if (step === 'form') registrations.length > 0 ? setStep('history') : setStep('info');
      }} />
      <div className="bp-stripe" aria-hidden="true" />
      
      <ScreenContainer className="pt-4 pb-20 gap-4">
        {step === 'info' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center text-primary mb-2">
              <Rocket size={32} />
            </div>
            <div>
              <h1 className="text-h1 font-bold text-text-primary">Start-Up Registration</h1>
              <p className="text-body-sm text-text-secondary mt-1">
                Register your startup to access grants, networking, and exclusive resources through the Innovative Startup Act.
              </p>
            </div>

            <Card padding="md">
              <h2 className="text-body font-semibold text-text-primary mb-2">Eligibility & Requirements</h2>
              <ul className="list-disc pl-5 space-y-1 text-body-sm text-text-secondary">
                <li>Must be operating in the Philippines</li>
                <li>Innovative business model or tech-driven product</li>
                <li>SEC or DTI Registration (if available)</li>
                <li>Pitch Deck or Business Plan</li>
              </ul>
            </Card>

            <Button variant="primary" size="lg" className="mt-4" onClick={() => registrations.length > 0 ? setStep('history') : setStep('form')}>
              {registrations.length > 0 ? 'View Registered Start-Ups' : 'Register Start-Up'}
            </Button>
          </motion.div>
        )}

        {step === 'history' && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-h2 font-bold text-text-primary">Your Start-Ups</h2>
              <Button variant="outline" size="sm" onClick={() => { setFormData({startupName:'', sector:'', description:''}); setStep('form'); }}>
                <Plus size={16} /> New
              </Button>
            </div>
            
            {registrations.map(reg => (
              <Card key={reg.id} padding="md" className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="text-body font-semibold text-primary font-mono">{reg.id}</span>
                  <span className="text-xs font-semibold uppercase px-2 py-1 bg-warning-light text-warning rounded-full">{reg.status}</span>
                </div>
                <div>
                  <p className="text-body font-bold">{reg.startupName}</p>
                  <p className="text-body-sm text-text-secondary">{reg.sector}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-text-secondary">
                  <Clock size={12} />
                  <span>Submitted: {new Date(reg.submittedAt).toLocaleDateString()}</span>
                </div>
                {reg.fileName && (
                  <Button variant="ghost" size="sm" className="mt-2 text-left w-fit -ml-2" onClick={async () => {
                    try {
                      const f = await getFile(reg.id);
                      if (f) {
                        const url = URL.createObjectURL(f);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = reg.fileName || 'Pitch_Deck';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      } else {
                        alert("Pitch deck not found.");
                      }
                    } catch (err) {
                      console.error(err);
                      alert("Error retrieving pitch deck.");
                    }
                  }}>
                    <Download size={16} className="mr-1" /> {reg.fileName}
                  </Button>
                )}
              </Card>
            ))}
          </motion.div>
        )}

        {step === 'form' && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4">
            <h2 className="text-h2 font-bold text-text-primary">Application Form</h2>
            <Card className="flex flex-col gap-4">
              <Input 
                label="Start-Up Name" 
                placeholder="Name of your company"
                value={formData.startupName}
                onChange={e => setFormData({ ...formData, startupName: e.target.value })}
              />
              <Input 
                label="Sector / Industry" 
                placeholder="e.g. HealthTech, EdTech, FinTech"
                value={formData.sector}
                onChange={e => setFormData({ ...formData, sector: e.target.value })}
              />
              <div>
                <p className="text-body-sm text-text-secondary mb-1">Brief Description</p>
                <textarea
                  className="w-full h-24 p-3 bg-white border border-border rounded-lg text-body-sm resize-none focus:border-primary outline-none"
                  placeholder="What problem are you solving?"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div>
                <p className="text-body-sm text-text-secondary mb-1">Pitch Deck (Optional)</p>
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.ppt,.pptx" onChange={handleFileChange} />
                {!file ? (
                  <button onClick={() => fileInputRef.current?.click()} className="w-full border border-dashed border-border rounded-lg p-4 text-center hover:bg-bg transition-colors">
                    <Upload size={24} className="text-text-secondary mx-auto mb-2" />
                    <p className="text-body-sm text-text-secondary">Upload your pitch deck (PDF/PPTX)</p>
                  </button>
                ) : (
                  <div className="border border-border rounded-lg p-3 flex items-center justify-between bg-bg">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-body-sm font-semibold text-text-primary truncate">{file.name}</p>
                        <p className="text-xs text-text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button onClick={() => setFile(null)} className="p-2 text-text-secondary hover:text-error" aria-label="Remove file">
                      <X size={18} />
                    </button>
                  </div>
                )}
                {fileError && <p className="text-xs text-error mt-1">{fileError}</p>}
              </div>

            </Card>
            <Button 
              variant="primary" 
              size="lg" 
              isLoading={isSubmitting}
              onClick={handleSubmit}
              disabled={!formData.startupName || !formData.sector || !formData.description}
            >
              Submit Application
            </Button>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center gap-6 pt-8">
            <div className="w-20 h-20 bg-success-light rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-success" />
            </div>
            <div>
              <h2 className="text-h2 font-bold text-text-primary">Application Submitted!</h2>
              <p className="text-body text-text-secondary mt-2">
                We have received your startup registration.
              </p>
            </div>
            <Card className="w-full bg-bg border-dashed">
              <p className="text-body-sm text-text-secondary uppercase tracking-wider font-semibold mb-1">Reference Number</p>
              <p className="text-h2 font-mono font-bold text-primary tracking-widest">{refNum}</p>
            </Card>
            <div className="w-full flex flex-col gap-3 mt-4">
              <Button variant="primary" fullWidth onClick={() => navigate('/home')}>
                Back to Home
              </Button>
              <Button variant="outline" fullWidth onClick={() => setStep('history')}>
                View Applications
              </Button>
            </div>
          </motion.div>
        )}
      </ScreenContainer>
    </div>
  );
}
