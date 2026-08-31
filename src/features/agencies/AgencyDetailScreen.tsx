/**
 * AgencyDetailScreen — Tier 1 Flow C
 * Reusable template component driven by mock data.
 * Tabs: Overview | Records | Support
 * Primary example: SSS — same template works for GSIS/PhilHealth/Pag-IBIG.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, RotateCcw } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Card, CardSkeleton, EmptyState, ErrorState, Badge } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getAgencyById, getContributions, linkAgencyAccount } from '../../mock/services/agencyService';
import type { Agency, Contribution } from '../../mock/services/agencyService';
import { db } from '../../mock/db';

type Tab = 'overview' | 'records' | 'support';

export function AgencyDetailScreen() {
  const { agencyId } = useParams<{ agencyId: string }>();
  const navigate = useNavigate();

  const [agency, setAgency] = useState<Agency | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recordsError, setRecordsError] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [memberInput, setMemberInput] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [linkSuccess, setLinkSuccess] = useState(false);

  const loadAgency = async () => {
    if (!agencyId) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await getAgencyById(agencyId);
      setAgency(data);
      if (data.linked) loadRecords();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Couldn't load agency details.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecords = async () => {
    if (!agencyId) return;
    setRecordsLoading(true);
    setRecordsError('');
    try {
      const data = await getContributions(agencyId);
      setContributions(data);
    } catch {
      setRecordsError("Couldn't load your records. Try again.");
    } finally {
      setRecordsLoading(false);
    }
  };

  useEffect(() => { loadAgency(); }, [agencyId]);

  const handleLink = async () => {
    if (!agencyId) return;
    setIsLinking(true);
    setLinkError('');
    try {
      await linkAgencyAccount(agencyId, memberInput);
      setLinkSuccess(true);
      // Reload agency data
      const updated = await getAgencyById(agencyId);
      setAgency(updated);
      loadRecords();
    } catch (err: unknown) {
      setLinkError(err instanceof Error ? err.message : 'Failed to link account.');
    } finally {
      setIsLinking(false);
    }
  };

  const formatCurrency = (n: number) =>
    `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatPeriod = (period: string) => {
    const [year, month] = period.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'long' });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <AppBar title="Agency" showBack />
        <ScreenContainer className="pt-4 gap-3">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </ScreenContainer>
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="flex-1 flex flex-col">
        <AppBar title="Agency" showBack />
        <ScreenContainer className="flex items-center justify-center">
          <ErrorState title="Couldn't load agency" description={error} onRetry={loadAgency} />
        </ScreenContainer>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title={agency.shortName} showBack />
      <div className="bp-stripe" aria-hidden="true" />

      {/* Agency header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
            style={{ backgroundColor: agency.logoColor }}
            aria-hidden="true"
          >
            <span className="text-lg">{agency.logoLetter}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-h2 font-bold text-text-primary leading-tight">{agency.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              {agency.linked ? (
                <Badge variant="success">✓ Linked</Badge>
              ) : (
                <Badge variant="neutral">Not linked</Badge>
              )}
              <Badge variant="neutral">{agency.category}</Badge>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-bg rounded-lg p-1" role="tablist">
          {(['overview', 'records', 'support'] as Tab[]).map(t => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => {
                setTab(t);
                if (t === 'records' && agency.linked && contributions.length === 0) loadRecords();
              }}
              className={[
                'flex-1 h-8 rounded-md text-body-sm font-semibold capitalize transition-all',
                tab === t ? 'bg-white text-primary shadow-card' : 'text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <ScreenContainer className="pt-4 gap-4">
        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <p className="text-body text-text-secondary">{agency.description}</p>

            {/* Linked status card */}
            {agency.linked ? (
              <Card className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-success rounded-full" aria-hidden="true" />
                  <p className="text-body font-semibold text-text-primary">Account Linked</p>
                </div>
                <div className="bg-bg rounded-lg p-3">
                  <p className="text-body-sm text-text-secondary">Member Number</p>
                  <p className="text-body font-mono font-semibold text-text-primary">{agency.memberNumber}</p>
                </div>
                <button
                  onClick={() => setTab('records')}
                  className="flex items-center justify-between text-primary text-body-sm font-semibold hover:underline"
                >
                  View contribution records →
                </button>
              </Card>
            ) : (
              <Card className="flex flex-col gap-4">
                <div>
                  <p className="text-body font-semibold text-text-primary">Link your {agency.shortName} account</p>
                  <p className="text-body-sm text-text-secondary mt-1">
                    Connect your {agency.shortName} membership to view contribution records, loan status, and more.
                  </p>
                </div>
                <Input
                  label={`${agency.shortName} Member Number`}
                  placeholder={agency.id === 'sss' ? 'e.g., 34-5678901-2' : 'Enter your member number'}
                  value={memberInput}
                  onChange={e => { setMemberInput(e.target.value); setLinkError(''); }}
                  error={linkError}
                />
                {linkSuccess && (
                  <p className="text-body-sm text-success font-medium">✓ Account linked successfully!</p>
                )}
                <Button
                  variant="primary"
                  fullWidth
                  isLoading={isLinking}
                  onClick={handleLink}
                  disabled={!memberInput.trim()}
                >
                  Link Account
                </Button>
              </Card>
            )}

            {/* Services list */}
            <Card padding="sm">
              <p className="text-body-sm font-semibold text-text-secondary uppercase tracking-wider px-2 mb-2">
                Available Services
              </p>
              {agency.services.map(service => (
                <div key={service} className="flex items-center gap-2 px-2 py-2 hover:bg-bg rounded-lg transition-colors">
                  <span className="text-primary" aria-hidden="true">•</span>
                  <span className="text-body text-text-primary">{service}</span>
                </div>
              ))}
            </Card>
          </motion.div>
        )}

        {/* ── RECORDS TAB ── */}
        {tab === 'records' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-h2 font-bold text-text-primary">Contribution History</h2>
              <button
                onClick={loadRecords}
                className="flex items-center gap-1 text-primary text-body-sm font-semibold hover:underline"
                aria-label="Refresh records"
              >
                <RotateCcw size={14} />
                Refresh
              </button>
            </div>

            <div className="text-xs text-text-secondary bg-primary-light border border-primary/20 rounded-lg px-3 py-2">
              📋 This is a read-only view. No edits or payments can be made through this screen.
            </div>

            {/* Loading */}
            {recordsLoading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 skeleton rounded-lg" />
            ))}

            {/* Error */}
            {recordsError && !recordsLoading && (
              <ErrorState
                title="Couldn't load your records"
                description={recordsError}
                onRetry={loadRecords}
              />
            )}

            {/* Not linked */}
            {!agency.linked && !recordsLoading && (
              <EmptyState
                title="No linked account"
                description="Link your account in the Overview tab to view your contribution records."
                action={<Button variant="outline" onClick={() => setTab('overview')}>Go to Overview</Button>}
              />
            )}

            {/* Records table */}
            {agency.linked && !recordsLoading && !recordsError && contributions.length > 0 && (
              <div className="bg-white rounded-lg border border-border overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-3 bg-bg px-4 py-2 border-b border-border">
                  <span className="text-label text-text-secondary">Period</span>
                  <span className="text-label text-text-secondary text-center">Employee</span>
                  <span className="text-label text-text-secondary text-right">Status</span>
                </div>
                {contributions.map((c, i) => (
                  <div
                    key={c.period}
                    className={`grid grid-cols-3 px-4 py-3 items-center ${i < contributions.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <span className="text-body-sm text-text-primary font-medium">{formatPeriod(c.period)}</span>
                    <span className="text-body-sm text-text-primary text-center">{formatCurrency(c.amount)}</span>
                    <span className={`text-right ${c.status === 'posted' ? 'text-success' : 'text-warning'}`}>
                      <Badge variant={c.status === 'posted' ? 'success' : 'warning'}>
                        {c.status}
                      </Badge>
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {agency.linked && !recordsLoading && !recordsError && contributions.length === 0 && (
              <EmptyState
                title="No records found"
                description="No contribution records found for this period. Check back later or contact the agency."
              />
            )}
          </motion.div>
        )}

        {/* ── SUPPORT TAB ── */}
        {tab === 'support' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <Card className="flex flex-col gap-3">
              <h2 className="text-h2 font-semibold text-text-primary">Contact Information</h2>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Hotline', value: agency.id === 'sss' ? '1455' : agency.id === 'philhealth' ? '1441' : '1800-10-' + agency.shortName.slice(0, 4) },
                  { label: 'Email', value: `support@${agency.id}.gov.ph` },
                  { label: 'Website', value: `www.${agency.id}.gov.ph` },
                  { label: 'Office Hours', value: 'Mon–Fri, 8:00 AM – 5:00 PM' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-body-sm text-text-secondary">{item.label}</span>
                    <span className="text-body-sm text-primary font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="flex flex-col gap-3">
              <h2 className="text-h2 font-semibold text-text-primary">Frequently Asked Questions</h2>
              {[
                `How do I check my ${agency.shortName} contributions?`,
                `What are the benefits of being a ${agency.shortName} member?`,
                `How do I apply for a ${agency.shortName} loan?`,
                `What documents do I need for ${agency.shortName} claims?`,
              ].map(q => (
                <button key={q} className="flex items-start gap-2 text-left hover:text-primary transition-colors">
                  <span className="text-primary mt-0.5" aria-hidden="true">?</span>
                  <span className="text-body-sm text-text-primary">{q}</span>
                </button>
              ))}
            </Card>

            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate('/consultation')}
            >
              Send a concern to {agency.shortName}
            </Button>
          </motion.div>
        )}
      </ScreenContainer>
    </div>
  );
}
