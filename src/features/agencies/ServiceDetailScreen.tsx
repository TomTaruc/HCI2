import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, ArrowRight, ExternalLink, Upload, X, Clock, Download, Plus } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getServiceByRoute } from '../../registry/services';
import { useAuth } from '../../state/AuthContext';
import { db, delay } from '../../mock/db';
import { saveFile, getFile } from '../../mock/fileStore';
import { ASSETS } from '../../assets/manifest';

interface ServiceRequest {
  id: string;
  serviceId: string;
  userId: string;
  purpose: string;
  details: string;
  fileName?: string;
  fileSize?: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export function ServiceDetailScreen() {
  const { agencyId, serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [step, setStep] = useState<'info' | 'history' | 'form' | 'review' | 'success'>('info');
  const [formData, setFormData] = useState({ purpose: '', details: '' });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refNum, setRefNum] = useState('');
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const service = getServiceByRoute(location.pathname);

  useEffect(() => {
    if (user && service) {
      const allReqs = db.get<ServiceRequest[]>('service_requests') || [];
      setRequests(allReqs.filter(r => r.userId === user.id && r.serviceId === service.id).sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
    }
  }, [user, service, step]);

  if (!service) {
    return (
      <div className="flex-1 flex flex-col">
        <AppBar title="Service Not Found" onBack={() => navigate(-1)} />
        <ScreenContainer className="pt-8 items-center text-center gap-4">
          <p className="text-body text-text-secondary">We couldn't find the service you're looking for.</p>
          <Button variant="outline" onClick={() => navigate('/services')}>Return to Services</Button>
        </ScreenContainer>
      </div>
    );
  }

  // Enforce access policy
  if (service.accessPolicy === 'verified' && user?.verificationStatus !== 'verified') {
    return (
      <div className="flex-1 flex flex-col">
        <AppBar title={service.title} onBack={() => navigate(-1)} />
        <ScreenContainer className="pt-8 items-center text-center gap-4">
          <div className="w-16 h-16 bg-warning-light text-warning rounded-full flex items-center justify-center text-2xl">!</div>
          <h2 className="text-h2 font-bold text-text-primary">Verification Required</h2>
          <p className="text-body text-text-secondary">You must be fully verified to access this service.</p>
          <Button variant="primary" onClick={() => navigate('/verify')}>Verify Account</Button>
        </ScreenContainer>
      </div>
    );
  }

  const isExternal = service.accessPolicy === 'public' && !service.agencyId && service.id !== 'sim-registration' && service.id !== 'startup';
  const isInformationOnly = service.supportedAction === 'View Details' || service.supportedAction === 'Inquire' || service.supportedAction === 'Read More';
  
  const handleNext = () => {
    if (isInformationOnly) return;
    if (requests.length > 0) {
      setStep('history');
    } else {
      setStep('form');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const f = e.target.files?.[0];
    if (!f) return;
    
    // Validations
    if (f.size > 5 * 1024 * 1024) {
      setFileError('File size must be under 5MB.');
      return;
    }
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(f.type)) {
      setFileError('Invalid file type. Only PDF, JPG, and PNG are allowed.');
      return;
    }
    setFile(f);
  };

  const handleReview = () => setStep('review');
  const handleSubmit = async () => {
    setIsSubmitting(true);
    await delay(1200);
    
    const newReqId = `REQ-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const newReq: ServiceRequest = {
      id: newReqId,
      serviceId: service.id,
      userId: user!.id,
      purpose: formData.purpose,
      details: formData.details,
      fileName: file?.name,
      fileSize: file?.size,
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

    const allReqs = db.get<ServiceRequest[]>('service_requests') || [];
    allReqs.push(newReq);
    const ok = db.set('service_requests', allReqs);
    
    if (!ok) {
      setFileError('Failed to save request. Storage might be full.');
      setIsSubmitting(false);
      setStep('form');
      return;
    }
    
    setRefNum(newReqId);
    setIsSubmitting(false);
    setStep('success');
  };

  const generateDummyDocument = (title: string) => {
    const blob = new Blob([`Demo Document for ${title}\nGenerated on ${new Date().toLocaleString()}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_Document.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col bg-bg">
      <AppBar title={service.title} onBack={() => {
        if (step === 'info' || step === 'success') navigate(-1);
        else if (step === 'history') setStep('info');
        else if (step === 'form') requests.length > 0 ? setStep('history') : setStep('info');
        else if (step === 'review') setStep('form');
      }} />
      <div className="bp-stripe" aria-hidden="true" />
      
      <ScreenContainer className="pt-4 pb-20 gap-4">
        {step === 'info' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center text-3xl overflow-hidden p-2">
                {service.logoUrl || (service.agencyId && ASSETS.logos[service.agencyId as keyof typeof ASSETS.logos]) ? (
                  <img src={service.logoUrl || ASSETS.logos[service.agencyId as keyof typeof ASSETS.logos]} alt="" className="w-full h-full object-contain" />
                ) : (
                  service.icon || '🏛️'
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-h2 font-bold text-text-primary">{service.title}</h1>
                <p className="text-body-sm text-text-secondary mt-1">{service.description}</p>
              </div>
            </div>

            {isInformationOnly ? (
              <Card padding="md" className="mt-4">
                <h2 className="text-body font-semibold text-text-primary mb-3">Service Information</h2>
                <p className="text-body-sm text-text-secondary mb-4">
                  This is a read-only informational service. The latest guidelines and updates are provided by {service.agencyId?.toUpperCase() || 'the government'}.
                </p>
                <Button variant="outline" fullWidth onClick={() => generateDummyDocument(service.title)}>
                  <Download size={18} /> Download Info Sheet
                </Button>
              </Card>
            ) : (
              <>
                <Card padding="md">
                  <h2 className="text-body font-semibold text-text-primary mb-3">Requirements</h2>
                  <ul className="space-y-2">
                    <li className="flex gap-2 text-body-sm text-text-secondary">
                      <CheckCircle size={16} className="text-success shrink-0" />
                      <span>Valid government-issued ID</span>
                    </li>
                    <li className="flex gap-2 text-body-sm text-text-secondary">
                      <CheckCircle size={16} className="text-success shrink-0" />
                      <span>Supporting documents (if applicable)</span>
                    </li>
                  </ul>
                </Card>

                <Card padding="md">
                  <h2 className="text-body font-semibold text-text-primary mb-2">Instructions</h2>
                  <ol className="list-decimal pl-5 space-y-1 text-body-sm text-text-secondary">
                    <li>Review the requirements above.</li>
                    <li>Fill out the application form accurately.</li>
                    <li>Submit and wait for your reference number.</li>
                  </ol>
                </Card>
              </>
            )}

            <Card padding="md">
              <h2 className="text-body font-semibold text-text-primary mb-2">Frequently Asked Questions</h2>
              <div className="flex flex-col gap-3 mt-3">
                <div className="border border-border rounded-lg p-3">
                  <p className="text-body-sm text-text-primary font-medium">How long does processing take?</p>
                  <p className="text-body-sm text-text-secondary mt-1">Processing typically takes 3-5 business days. You can track the status in your History tab.</p>
                </div>
                <div className="border border-border rounded-lg p-3">
                  <p className="text-body-sm text-text-primary font-medium">What if my requirements are incomplete?</p>
                  <p className="text-body-sm text-text-secondary mt-1">Your request will be marked as "pending requirements" and you will be notified to submit the lacking documents.</p>
                </div>
                {service.category === 'Social Security' && (
                  <div className="border border-border rounded-lg p-3">
                    <p className="text-body-sm text-text-primary font-medium">Is this linked to my {service.agencyId?.toUpperCase()} account?</p>
                    <p className="text-body-sm text-text-secondary mt-1">Yes, as long as your {service.agencyId?.toUpperCase()} account is linked in your eGovPH profile, records will sync automatically.</p>
                  </div>
                )}
              </div>
            </Card>

            {!isInformationOnly && (
              isExternal ? (
                <a 
                  href="https://www.gov.ph"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 h-12 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
                >
                  Go to Official Portal <ExternalLink size={18} />
                </a>
              ) : (
                <Button variant="primary" size="lg" className="mt-4" onClick={handleNext}>
                  {requests.length > 0 ? `View History (${requests.length})` : `${service.supportedAction}`} <ArrowRight size={18} />
                </Button>
              )
            )}
          </motion.div>
        )}

        {step === 'history' && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-h2 font-bold text-text-primary">Submission History</h2>
              <Button variant="outline" size="sm" onClick={() => { setFormData({purpose:'', details:''}); setFile(null); setStep('form'); }}>
                <Plus size={16} /> New
              </Button>
            </div>
            {requests.map(req => (
              <Card key={req.id} padding="md" className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="text-body font-semibold text-primary font-mono">{req.id}</span>
                  <span className="text-xs font-semibold uppercase px-2 py-1 bg-warning-light text-warning rounded-full">{req.status}</span>
                </div>
                <p className="text-body-sm font-medium">{req.purpose}</p>
                <div className="flex items-center gap-1 text-xs text-text-secondary">
                  <Clock size={12} />
                  <span>{new Date(req.submittedAt).toLocaleDateString()}</span>
                </div>
                {req.fileName && (
                  <Button variant="ghost" size="sm" className="mt-2 text-left" onClick={async () => {
                    try {
                      const f = await getFile(req.id);
                      if (f) {
                        const url = URL.createObjectURL(f);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = req.fileName || 'Attachment';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      } else {
                        alert("Attachment file not found.");
                      }
                    } catch (err) {
                      console.error(err);
                      alert("Error retrieving attachment.");
                    }
                  }}>
                    <Download size={16} className="mr-1" /> {req.fileName}
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
                label="Full Name" 
                value={user ? `${user.firstName} ${user.lastName}` : ''} 
                disabled 
              />
              <Input 
                label="Purpose of Request" 
                placeholder="e.g. Employment, Personal"
                value={formData.purpose}
                onChange={e => setFormData({ ...formData, purpose: e.target.value })}
              />
              <Input 
                label="Additional Details (Optional)" 
                placeholder="Any other relevant info"
                value={formData.details}
                onChange={e => setFormData({ ...formData, details: e.target.value })}
              />
              
              <div>
                <p className="text-body-sm font-semibold mb-2">Supporting Document (Optional)</p>
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
                {!file ? (
                  <button onClick={() => fileInputRef.current?.click()} className="w-full border border-dashed border-border rounded-lg p-4 text-center hover:bg-bg transition-colors">
                    <Upload size={24} className="text-text-secondary mx-auto mb-2" />
                    <p className="text-body-sm text-text-secondary">Tap to upload a file</p>
                    <p className="text-xs text-text-secondary/70 mt-1">PDF, JPG, PNG up to 5MB</p>
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
              onClick={handleReview}
              disabled={!formData.purpose.trim()}
            >
              Review Application
            </Button>
          </motion.div>
        )}

        {step === 'review' && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4">
            <h2 className="text-h2 font-bold text-text-primary">Review Application</h2>
            <Card className="flex flex-col gap-4">
              <div>
                <p className="text-body-sm text-text-secondary">Applicant Name</p>
                <p className="text-body font-medium">{user?.firstName} {user?.lastName}</p>
              </div>
              <div>
                <p className="text-body-sm text-text-secondary">Purpose</p>
                <p className="text-body font-medium">{formData.purpose}</p>
              </div>
              {formData.details && (
                <div>
                  <p className="text-body-sm text-text-secondary">Details</p>
                  <p className="text-body font-medium">{formData.details}</p>
                </div>
              )}
              {file && (
                <div>
                  <p className="text-body-sm text-text-secondary">Attached File</p>
                  <p className="text-body font-medium">{file.name}</p>
                </div>
              )}
            </Card>
            <p className="text-body-sm text-text-secondary text-center px-4">
              By submitting, you certify that the information provided is correct.
            </p>
            <Button variant="primary" size="lg" isLoading={isSubmitting} onClick={handleSubmit}>
              Submit Request
            </Button>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center gap-6 pt-8">
            <div className="w-20 h-20 bg-success-light rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-success" />
            </div>
            <div>
              <h2 className="text-h2 font-bold text-text-primary">Request Submitted!</h2>
              <p className="text-body text-text-secondary mt-2">
                Your request for {service.title} has been received.
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
              <Button variant="outline" fullWidth onClick={() => navigate(-1)}>
                View Other Services
              </Button>
            </div>
          </motion.div>
        )}
      </ScreenContainer>
    </div>
  );
}
