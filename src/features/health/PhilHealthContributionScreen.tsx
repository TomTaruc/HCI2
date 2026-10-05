import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../state/AuthContext';
import { getAgencyById, getContributions } from '../../mock/services/agencyService';
import type { Contribution } from '../../mock/services/agencyService';

export function PhilHealthContributionScreen() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<Contribution[]>([]);
  const { user } = useAuth();
  
  // Find philhealth agency to get the linked status
  const [isLinked, setIsLinked] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const agency = await getAgencyById(user.id, 'philhealth');
        setIsLinked(agency.linked);
        if (agency.linked) {
          const allContributions = await getContributions(user.id, 'philhealth');
          setRecords(allContributions);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [user]);

  return (
    <div className="flex-1 flex flex-col bg-bg">
      <AppBar title="Contribution Inquiry" onBack={() => navigate(-1)} />
      <div className="bp-stripe" aria-hidden="true" />
      
      <ScreenContainer className="pt-4 pb-20 gap-4">
        {isLinked ? (
          <>
            <h1 className="text-h1 font-bold text-text-primary">Contribution History</h1>
            <p className="text-body-sm text-text-secondary">
              Review your past PhilHealth contributions.
            </p>

            <div className="flex flex-col gap-3">
              {records.length > 0 ? (
                records.map(record => (
                  <Card key={record.period} padding="md" className="flex justify-between items-center">
                    <div>
                      <p className="text-body font-semibold text-text-primary">{record.period}</p>
                      <p className="text-body-sm text-text-secondary">Status: {record.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-body font-bold text-success">₱{record.amount.toFixed(2)}</p>
                      <p className="text-xs text-text-secondary">Total: ₱{record.total.toFixed(2)}</p>
                    </div>
                  </Card>
                ))
              ) : (
                <Card padding="md" className="text-center py-8">
                  <p className="text-body text-text-secondary">No contribution records found.</p>
                </Card>
              )}
            </div>
            
            <Button variant="outline" fullWidth onClick={() => navigate('/egovpay?agency=philhealth')}>
              Pay Contributions via eGovPay
            </Button>
          </>
        ) : (
          <Card padding="md" className="text-center flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 bg-warning-light text-warning rounded-full flex items-center justify-center text-2xl">
              !
            </div>
            <div>
              <h2 className="text-h2 font-bold text-text-primary">Account Not Linked</h2>
              <p className="text-body text-text-secondary mt-2">
                You must link your PhilHealth account to view contributions.
              </p>
            </div>
            <Button variant="primary" onClick={() => navigate('/agencies/philhealth')}>
              Link Account Now
            </Button>
          </Card>
        )}
      </ScreenContainer>
    </div>
  );
}
