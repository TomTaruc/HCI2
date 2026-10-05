import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { getServicesByAgency } from '../../registry/services';

export function HealthScreen() {
  const navigate = useNavigate();
  const philhealthServices = getServicesByAgency('philhealth');

  return (
    <div className="flex-1 flex flex-col bg-bg">
      <AppBar title="Health" />
      <div className="bp-stripe" aria-hidden="true" />
      
      <ScreenContainer className="pt-4 gap-4">
        <h1 className="text-h1 font-bold text-text-primary">Health Hub</h1>
        <p className="text-body text-text-secondary">
          Access your Philippine Health Insurance Corporation (PhilHealth) records and other health services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {philhealthServices.map(service => (
            <button
              key={service.id}
              onClick={() => navigate(service.route)}
              className="bg-white border border-border rounded-xl p-4 text-left hover:shadow-card-hover hover:border-primary/20 transition-all flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold">
                  PH
                </div>
                <h2 className="text-body font-semibold text-text-primary">{service.title}</h2>
              </div>
              <p className="text-body-sm text-text-secondary">{service.description}</p>
            </button>
          ))}
        </div>
      </ScreenContainer>
    </div>
  );
}
