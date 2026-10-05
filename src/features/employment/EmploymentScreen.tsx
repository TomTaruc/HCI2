/**
 * EmploymentScreen — DOLE / PESO job listings mock
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, CheckCircle, FileText, Upload } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { db } from '../../mock/db';
import { useAuth } from '../../state/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const JOBS = [
  { id: 1, title: 'Administrative Aide VI', agency: 'Department of Health', location: 'Quezon City', type: 'Permanent', salary: '₱25,000 – ₱30,000', deadline: 'Sep 15, 2026', emoji: '❤️' },
  { id: 2, title: 'IT Officer III', agency: 'DICT', location: 'Taguig City', type: 'Permanent', salary: '₱55,000 – ₱65,000', deadline: 'Sep 20, 2026', emoji: '💻' },
  { id: 3, title: 'Project Development Officer', agency: 'DPWH', location: 'Manila', type: 'Contract of Service', salary: '₱35,000/month', deadline: 'Sep 10, 2026', emoji: '🏗️' },
  { id: 4, title: 'Nurse II', agency: 'PhilHealth', location: 'Mandaluyong City', type: 'Permanent', salary: '₱42,000 – ₱48,000', deadline: 'Oct 1, 2026', emoji: '🏥' },
  { id: 5, title: 'Records Officer I', agency: 'PSA', location: 'Nationwide', type: 'Permanent', salary: '₱20,000 – ₱24,000', deadline: 'Sep 30, 2026', emoji: '📄' },
];

export function EmploymentScreen() {
  const [selected, setSelected] = useState<typeof JOBS[0] | null>(null);
  const { user } = useAuth();
  const [tab, setTab] = useState<'jobs' | 'history'>('jobs');
  const [applyingJob, setApplyingJob] = useState<typeof JOBS[0] | null>(null);
  const [formData, setFormData] = useState({ pds: false, coverLetter: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apps = db.get<{ id: string, jobId: number, userId: string, title: string, agency: string, status: string, date: string }[]>('jobApplications') ?? [];
  const myApps = apps.filter(a => a.userId === user?.id);

  const appliedIds = myApps.map(a => a.jobId);

  const handleApplySubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const ref = 'JOB-' + Date.now().toString(36).toUpperCase();
      db.set('jobApplications', [...apps, {
        id: ref,
        userId: user?.id,
        jobId: applyingJob!.id,
        title: applyingJob!.title,
        agency: applyingJob!.agency,
        status: 'submitted',
        date: new Date().toISOString()
      }]);
      setIsSubmitting(false);
      setApplyingJob(null);
      setTab('history');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Employment" showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center"><Briefcase size={24} className="text-primary" /></div>
          <div>
            <h1 className="text-h1 font-bold text-text-primary">Government Jobs</h1>
            <p className="text-body-sm text-text-secondary">Powered by DOLE PESO — Civil Service jobs</p>
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
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 pt-3 border-t border-border" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between text-body-sm mb-3">
                      <div><span className="text-text-secondary">Salary: </span><span className="font-semibold text-text-primary">{job.salary}</span></div>
                      <div><span className="text-text-secondary">Deadline: </span><span className="font-semibold text-error">{job.deadline}</span></div>
                    </div>
                    {appliedIds.includes(job.id) ? (
                      <div className="w-full h-10 bg-success-light text-success rounded-md text-body-sm font-semibold flex items-center justify-center gap-2">
                        <CheckCircle size={16} /> Application Submitted
                      </div>
                    ) : (
                      <Button 
                        variant="primary" 
                        fullWidth
                        onClick={(e) => { e.stopPropagation(); setApplyingJob(job); setFormData({ pds: false, coverLetter: '' }); }}
                      >
                        Apply Now
                      </Button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
            <div className="text-center mt-4 mb-8">
              <p className="text-body-sm text-text-secondary">
                See more jobs at{' '}
            <span className="text-primary font-semibold">Phil-JobNet (demo link)</span>
          </p>
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div className="flex flex-col gap-3">
            {myApps.length > 0 ? myApps.map(app => (
              <div key={app.id} className="bg-white border border-border rounded-lg p-4 shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-body font-bold text-text-primary">{app.title}</p>
                    <p className="text-body-sm text-text-secondary">{app.agency}</p>
                  </div>
                  <span className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
                    {app.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-text-secondary mt-2 border-t border-border pt-2">
                  <span>Ref: {app.id}</span>
                  <span>Applied: {new Date(app.date).toLocaleDateString()}</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 bg-white border border-dashed border-border rounded-lg">
                <FileText className="mx-auto text-border mb-2" size={32} />
                <p className="text-body font-semibold text-text-primary">No applications yet</p>
                <p className="text-body-sm text-text-secondary mt-1">Jobs you apply for will appear here.</p>
              </div>
            )}
          </div>
        )}

      </ScreenContainer>

      {/* Apply Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-bg rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            <div className="p-4 border-b border-border flex justify-between items-center bg-white sticky top-0">
              <div>
                <h2 className="text-h2 font-bold text-text-primary">Apply for Job</h2>
                <p className="text-body-sm text-text-secondary truncate">{applyingJob.title}</p>
              </div>
              <button 
                onClick={() => setApplyingJob(null)}
                className="w-8 h-8 flex items-center justify-center bg-bg rounded-full text-text-secondary"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex flex-col gap-4">
              <div>
                <p className="text-body-sm text-text-secondary mb-1">Applicant Name</p>
                <p className="text-body font-semibold">{user?.firstName} {user?.lastName}</p>
              </div>

              <div>
                <p className="text-body-sm font-semibold text-text-primary mb-2">Requirements</p>
                
                <button 
                  onClick={() => setFormData(prev => ({ ...prev, pds: !prev.pds }))}
                  className={`w-full text-left p-3 border rounded-lg flex items-center gap-3 transition-colors ${formData.pds ? 'bg-success-light border-success/30' : 'bg-white border-border hover:bg-bg'}`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.pds ? 'bg-success border-success text-white' : 'border-text-secondary'}`}>
                    {formData.pds && <CheckCircle size={14} />}
                  </div>
                  <div>
                    <p className="text-body-sm font-medium">Personal Data Sheet (CS Form 212)</p>
                    <p className="text-xs text-text-secondary">Attach your updated PDS</p>
                  </div>
                </button>
              </div>

              <div>
                <p className="text-body-sm font-semibold text-text-primary mb-2">Cover Letter (Optional)</p>
                <textarea
                  className="w-full h-24 p-3 bg-white border border-border rounded-lg text-body-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Why are you a good fit for this role?"
                  value={formData.coverLetter}
                  onChange={e => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                />
              </div>

              <div className="bg-primary-light/50 p-3 rounded-lg border border-primary/20">
                <p className="text-xs text-primary font-medium text-center">
                  In a real application, you would upload your scanned transcripts and eligibility documents here.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-border">
              <Button 
                variant="primary" 
                fullWidth 
                size="lg"
                onClick={handleApplySubmit}
                isLoading={isSubmitting}
                disabled={!formData.pds}
              >
                Submit Application
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
