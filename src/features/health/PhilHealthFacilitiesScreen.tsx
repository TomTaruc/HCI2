import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Search, MapPin, Phone } from 'lucide-react';

const MOCK_FACILITIES = [
  { id: 1, name: 'Philippine General Hospital', type: 'Level 3 Hospital', address: 'Taft Ave, Ermita, Manila', phone: '(02) 8554 8400' },
  { id: 2, name: 'Makati Medical Center', type: 'Level 3 Hospital', address: 'Amorsolo St, Legazpi Village, Makati', phone: '(02) 8888 8999' },
  { id: 3, name: 'St. Luke\'s Medical Center', type: 'Level 3 Hospital', address: 'E. Rodriguez Sr. Ave, Quezon City', phone: '(02) 8723 0101' },
  { id: 4, name: 'Pasig City General Hospital', type: 'Level 2 Hospital', address: 'Eusebio Ave, Pasig', phone: '(02) 8643 3333' },
  { id: 5, name: 'Medical City', type: 'Level 3 Hospital', address: 'Ortigas Ave, Pasig', phone: '(02) 8988 1000' },
  { id: 6, name: 'Quezon City General Hospital', type: 'Level 2 Hospital', address: 'Seminary Rd, Quezon City', phone: '(02) 8806 6666' },
];

export function PhilHealthFacilitiesScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const results = query
    ? MOCK_FACILITIES.filter(f => 
        f.name.toLowerCase().includes(query.toLowerCase()) || 
        f.address.toLowerCase().includes(query.toLowerCase())
      )
    : MOCK_FACILITIES;

  return (
    <div className="flex-1 flex flex-col bg-bg">
      <AppBar title="Accredited Facilities" onBack={() => navigate(-1)} />
      <div className="bp-stripe" aria-hidden="true" />
      
      <ScreenContainer className="pt-4 pb-20 gap-4">
        <h1 className="text-h1 font-bold text-text-primary">Find a Facility</h1>
        <p className="text-body-sm text-text-secondary">
          Search for PhilHealth accredited hospitals and clinics near you.
        </p>

        <div className="flex items-center gap-2 h-11 px-4 bg-white border border-border rounded-full focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm">
          <Search size={18} className="text-text-secondary shrink-0" />
          <input
            type="search"
            placeholder="Search by name or city..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-body text-text-primary outline-none placeholder-text-secondary"
          />
        </div>

        <div className="flex flex-col gap-3 mt-2">
          {results.length > 0 ? (
            results.map(facility => (
              <Card key={facility.id} padding="md">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-body font-bold text-text-primary">{facility.name}</h3>
                  <span className="bg-primary-light text-primary text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                    {facility.type}
                  </span>
                </div>
                <div className="flex flex-col gap-1 mt-2 text-body-sm text-text-secondary">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="shrink-0" />
                    <span>{facility.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="shrink-0" />
                    <span>{facility.phone}</span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-body text-text-secondary">No facilities found for "{query}".</p>
            </div>
          )}
        </div>
      </ScreenContainer>
    </div>
  );
}
