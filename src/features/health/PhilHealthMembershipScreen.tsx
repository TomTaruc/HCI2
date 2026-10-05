import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../state/AuthContext';
import { db } from '../../mock/db';
import { getAgencyById } from '../../mock/services/agencyService';

export function PhilHealthMembershipScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isLinked, setIsLinked] = React.useState(false);
  const [memberNumber, setMemberNumber] = React.useState('Not Linked');

  React.useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const agency = await getAgencyById(user.id, 'philhealth');
        setIsLinked(agency.linked);
        setMemberNumber(agency.memberNumber || 'Not Linked');
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [user]);

  const generateMDR = () => {
    const blob = new Blob([`Member Data Record\nName: ${user?.firstName} ${user?.lastName}\nPhilHealth No: ${memberNumber}\nStatus: Active\nGenerated on: ${new Date().toLocaleString()}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MDR_${user?.lastName}_${memberNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col bg-bg">
      <AppBar title="Membership Verification" onBack={() => navigate(-1)} />
      <div className="bp-stripe" aria-hidden="true" />
      
      <ScreenContainer className="pt-4 pb-20 gap-4">
        {isLinked ? (
          <>
            <Card padding="md" className="flex flex-col gap-4">
              <div className="flex items-center gap-4 border-b border-border pb-4">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold text-xl">
                  PH
                </div>
                <div>
                  <h2 className="text-h2 font-bold text-text-primary">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-body text-text-secondary">PhilHealth Member</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div>
                  <p className="text-body-sm text-text-secondary">PhilHealth No.</p>
                  <p className="text-body font-mono font-medium">{memberNumber}</p>
                </div>
                <div>
                  <p className="text-body-sm text-text-secondary">Status</p>
                  <span className="inline-block px-2 py-0.5 bg-success-light text-success rounded-full text-xs font-semibold">
                    ACTIVE
                  </span>
                </div>
                <div>
                  <p className="text-body-sm text-text-secondary">Member Category</p>
                  <p className="text-body font-medium">Formal Economy</p>
                </div>
                <div>
                  <p className="text-body-sm text-text-secondary">Date Issued</p>
                  <p className="text-body font-medium">May 12, 2018</p>
                </div>
              </div>
            </Card>

            <Card padding="md" className="flex flex-col gap-4">
              <h3 className="text-body font-semibold text-text-primary">Member Data Record (MDR)</h3>
              <p className="text-body-sm text-text-secondary">
                View and download a copy of your Member Data Record.
              </p>
              <div className="bg-bg border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-3">
                <div className="text-4xl">📄</div>
                <p className="text-body font-medium">Sample_MDR.txt</p>
                <Button variant="outline" size="sm" onClick={generateMDR}>
                  Download Document
                </Button>
              </div>
            </Card>
          </>
        ) : (
          <Card padding="md" className="text-center flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 bg-warning-light text-warning rounded-full flex items-center justify-center text-2xl">
              !
            </div>
            <div>
              <h2 className="text-h2 font-bold text-text-primary">Account Not Linked</h2>
              <p className="text-body text-text-secondary mt-2">
                You must link your PhilHealth account to view membership details.
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
