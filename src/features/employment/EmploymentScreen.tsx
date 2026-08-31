/**
 * EmploymentScreen — DOLE / PESO job listings mock
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, MapPin } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';

const JOBS = [
  { id: 1, title: 'Administrative Aide VI', agency: 'Department of Health', location: 'Quezon City', type: 'Permanent', salary: '₱25,000 – ₱30,000', deadline: 'Sep 15, 2026', emoji: '❤️' },
  { id: 2, title: 'IT Officer III', agency: 'DICT', location: 'Taguig City', type: 'Permanent', salary: '₱55,000 – ₱65,000', deadline: 'Sep 20, 2026', emoji: '💻' },
  { id: 3, title: 'Project Development Officer', agency: 'DPWH', location: 'Manila', type: 'Contract of Service', salary: '₱35,000/month', deadline: 'Sep 10, 2026', emoji: '🏗️' },
  { id: 4, title: 'Nurse II', agency: 'PhilHealth', location: 'Mandaluyong City', type: 'Permanent', salary: '₱42,000 – ₱48,000', deadline: 'Oct 1, 2026', emoji: '🏥' },
  { id: 5, title: 'Records Officer I', agency: 'PSA', location: 'Nationwide', type: 'Permanent', salary: '₱20,000 – ₱24,000', deadline: 'Sep 30, 2026', emoji: '📄' },
];

export function EmploymentScreen() {
  const [selected, setSelected] = useState<typeof JOBS[0] | null>(null);

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
                  <button className="w-full h-10 bg-primary text-white rounded-md text-body-sm font-semibold hover:bg-primary-dark transition-colors">
                    Apply Now (Demo)
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-body-sm text-text-secondary">
            See more jobs at{' '}
            <span className="text-primary font-semibold">Phil-JobNet (demo link)</span>
          </p>
        </div>
      </ScreenContainer>
    </div>
  );
}
