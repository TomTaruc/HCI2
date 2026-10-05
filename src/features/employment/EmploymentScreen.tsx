import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, CheckCircle, FileText, Upload, X, Clock, AlertTriangle, Download } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { db, delay } from '../../mock/db';
import { saveFile, getFile } from '../../mock/fileStore';
import { useAuth } from '../../state/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const JOBS = [
  { id: 1, title: 'Administrative Aide VI', agency: 'Department of Health', location: 'Quezon City', type: 'Permanent', salary: '₱25,000 – ₱30,000', deadline: '2026-12-15', emoji: '❤️', qualifications: ['Bachelor\'s degree relevant to the job', '1 year relevant experience', 'CS Professional Eligibility'], status: 'open' },
  { id: 2, title: 'IT Officer III', agency: 'DICT', location: 'Taguig City', type: 'Permanent', salary: '₱55,000 – ₱65,000', deadline: '2026-12-20', emoji: '💻', qualifications: ['Bachelor\'s degree in IT/Computer Science', '3 years relevant experience', 'CS Professional Eligibility'], status: 'open' },
  { id: 3, title: 'Project Development Officer', agency: 'DPWH', location: 'Manila', type: 'Contract of Service', salary: '₱35,000/month', deadline: '2026-12-10', emoji: '🏗️', qualifications: ['Bachelor\'s degree', 'No experience required', 'Not applicable'], status: 'open' },
  { id: 4, title: 'Nurse II', agency: 'PhilHealth', location: 'Mandaluyong City', type: 'Permanent', salary: '₱42,000 – ₱48,000', deadline: '2024-01-01', emoji: '🏥', qualifications: ['BS Nursing', '1 year experience', 'RA 1080 (Nurse)'], status: 'expired' },
  { id: 5, title: 'Records Officer I', agency: 'PSA', location: 'Nationwide', type: 'Permanent', salary: '₱20,000 – ₱24,000', deadline: '2026-12-30', emoji: '📄', qualifications: ['Bachelor\'s degree', 'No experience required', 'CS Professional Eligibility'], status: 'open' },
];

interface JobApplication {
  id: string;
  jobId: number;
  userId: string;
  title: string;
  agency: string;
  status: string;
  date: string;
  coverLetter: string;
  pdsFileName?: string;
}

export function EmploymentScreen() {
  const [selected, setSelected] = useState<typeof JOBS[0] | null>(null);
  const { user } = useAuth();
  const [tab, setTab] = useState<'jobs' | 'history'>('jobs');
  const [applyingJob, setApplyingJob] = useState<typeof JOBS[0] | null>(null);
  const [formData, setFormData] = useState({ coverLetter: '' });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [myApps, setMyApps] = useState<JobApplication[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const allApps = db.get<JobApplication[]>('jobApplications') ?? [];
      setMyApps(allApps.filter(a => a.userId === user.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, [user, tab]);

  const appliedIds = myApps.map(a => a.jobId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setFileError('File size must be under 5MB.');
      return;
    }
    const allowed = ['application/pdf'];
    if (!allowed.includes(f.type)) {
      setFileError('Only PDF files are allowed for Personal Data Sheet (PDS).');
      return;
    }
    setFile(f);
  };

  const handleApplySubmit = async () => {
    if (appliedIds.includes(applyingJob!.id)) {
      setError('You have already applied for this job.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await delay(1200);
      const ref = 'JOB-' + Date.now().toString(36).toUpperCase();
      
      if (file) {
        try {
          await saveFile(ref, file);
        } catch (err) {
          throw new Error('Failed to save PDS attachment. Please try again.');
        }
      }

      const allApps = db.get<JobApplication[]>('jobApplications') ?? [];
      const newApp = {
        id: ref,
        userId: user!.id,
        jobId: applyingJob!.id,
        title: applyingJob!.title,
        agency: applyingJob!.agency,
        status: 'submitted',
        date: new Date().toISOString(),
        coverLetter: formData.coverLetter,
        pdsFileName: file?.name
      };
      
      const success = db.set('jobApplications', [...allApps, newApp]);
      if (!success) {
        throw new Error('Failed to save application. Storage might be full.');
      }
      
      setApplyingJob(null);
      setFormData({ coverLetter: '' });
      setFile(null);
      setTab('history');
    } catch (err: any) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (applyingJob) {
    return (
      <div className="flex-1 flex flex-col bg-bg">
        <AppBar title="Submit Application" onBack={() => {
          if (!isSubmitting) {
            setApplyingJob(null);
          }
        }} />
        <div className="bp-stripe" aria-hidden="true" />
        <ScreenContainer className="pt-4 gap-4 pb-20">
          <Card padding="md">
            <h2 className="text-h2 font-bold text-text-primary mb-1">{applyingJob.title}</h2>
            <p className="text-body-sm text-text-secondary">{applyingJob.agency}</p>
          </Card>

          {error && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-body-sm flex gap-2">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Card padding="md" className="flex flex-col gap-4">
            <h3 className="text-body font-semibold">Application Form</h3>
            <Input 
              label="Cover Letter" 
              placeholder="Brief introduction about yourself..."
              value={formData.coverLetter}
              onChange={e => setFormData({...formData, coverLetter: e.target.value})}
            />

            <div>
              <p className="text-body-sm font-semibold mb-2">Civil Service Form No. 212 (Personal Data Sheet)</p>
              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileChange} />
              {!file ? (
                <button onClick={() => fileInputRef.current?.click()} className="w-full border border-dashed border-border rounded-lg p-4 text-center hover:bg-bg transition-colors">
                  <Upload size={24} className="text-text-secondary mx-auto mb-2" />
                  <p className="text-body-sm text-text-secondary">Tap to upload your PDS (PDF)</p>
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
            fullWidth 
            onClick={handleApplySubmit} 
            isLoading={isSubmitting}
            disabled={!file}
          >
            Submit Application
          </Button>
        </ScreenContainer>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Employment" showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center"><Briefcase size={24} className="text-primary" /></div>
          <div>
            <h1 className="text-h1 font-bold text-text-primary">Government Jobs</h1>
            <p className="text-body-sm text-text-secondary">Powered by DOLE PESO — Civil Service jobs (Demo)</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-white rounded-lg p-1 border border-border mt-2">
          <button 
            className={`flex-1 py-2 text-body-sm font-semibold rounded-md transition-colors ${tab === 'jobs' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
            onClick={() => setTab('jobs')}
          >
            Available Jobs
          </button>
          <button 
            className={`flex-1 py-2 text-body-sm font-semibold rounded-md transition-colors ${tab === 'history' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
            onClick={() => setTab('history')}
          >
            Application History
          </button>
        </div>

        {tab === 'jobs' && (
          <div className="flex flex-col gap-3">
            {JOBS.map((job, i) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(selected?.id === job.id ? null : job)}
                className="w-full bg-white border border-border rounded-lg p-4 text-left hover:shadow-card-hover hover:border-primary/20 transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{job.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-bold text-text-primary leading-tight">{job.title}</p>
                    <p className="text-body-sm text-text-secondary">{job.agency}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={11} className="text-text-secondary" />
                      <span className="text-xs text-text-secondary">{job.location}</span>
                      <span className="text-text-secondary">·</span>
                      <span className="text-xs bg-primary-light text-primary px-1.5 py-0.5 rounded font-semibold">{job.type}</span>
                    </div>
                  </div>
                </div>

                {selected?.id === job.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 pt-4 border-t border-border overflow-hidden">
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-body-sm">
                      <div>
                        <p className="text-text-secondary font-medium text-xs uppercase tracking-wider">Salary Grade</p>
                        <p className="font-semibold text-text-primary">{job.salary}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary font-medium text-xs uppercase tracking-wider">Deadline</p>
                        <p className={`font-semibold ${new Date(job.deadline) < new Date() ? 'text-error' : 'text-text-primary'}`}>{new Date(job.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-body-sm text-text-secondary space-y-1">
                      <p className="font-semibold text-text-primary">Qualifications:</p>
                      <ul className="list-disc pl-5">
                        {job.qualifications.map((q, j) => <li key={j}>{q}</li>)}
                      </ul>
                    </div>

                    <div className="mt-4">
                      {new Date(job.deadline) < new Date() ? (
                        <Button variant="outline" fullWidth disabled>Vacancy Closed</Button>
                      ) : appliedIds.includes(job.id) ? (
                        <div className="bg-success-light text-success font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm">
                          <CheckCircle size={16} /> Applied
                        </div>
                      ) : (
                        <Button variant="primary" fullWidth onClick={(e) => { e.stopPropagation(); setApplyingJob(job); }}>
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
            <p className="text-xs text-center text-text-secondary mt-2">Simulated DOLE / CSC job listings for demonstration.</p>
          </div>
        )}

        {tab === 'history' && (
          <div className="flex flex-col gap-3">
            {myApps.length > 0 ? (
              myApps.map(app => (
                <Card key={app.id} padding="md" className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="text-body font-semibold text-primary font-mono">{app.id}</span>
                    <span className="text-xs font-semibold uppercase px-2 py-1 bg-warning-light text-warning rounded-full">{app.status}</span>
                  </div>
                  <div>
                    <p className="text-body font-bold">{app.title}</p>
                    <p className="text-body-sm text-text-secondary">{app.agency}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <Clock size={12} />
                    <span>{new Date(app.date).toLocaleDateString()}</span>
                  </div>
                  {app.pdsFileName && (
                    <Button variant="ghost" size="sm" className="mt-2 text-left w-fit -ml-2" onClick={async () => {
                      try {
                        const f = await getFile(app.id);
                        if (f) {
                          const url = URL.createObjectURL(f);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = app.pdsFileName || 'PDS_Attachment.pdf';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        } else {
                          alert("PDS attachment not found.");
                        }
                      } catch (err) {
                        console.error(err);
                        alert("Error retrieving PDS attachment.");
                      }
                    }}>
                      <Download size={16} className="mr-1" /> {app.pdsFileName}
                    </Button>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText size={48} className="text-text-secondary/30 mx-auto mb-2" />
                <p className="text-body text-text-secondary">You haven't applied to any jobs yet.</p>
              </div>
            )}
          </div>
        )}
      </ScreenContainer>
    </div>
  );
}
