/**
 * NGAsDirectoryScreen — Tier 1 Flow C
 * Browse agencies by Category or by Agency (alphabetical).
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Lock } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { CardSkeleton, ErrorState, Badge } from '../../components/ui/Card';
import { getAgencies, getCategories } from '../../mock/services/agencyService';
import type { Agency } from '../../mock/services/agencyService';
import { useAuth } from '../../state/AuthContext';

export function NGAsDirectoryScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'category' | 'agency'>('category');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isVerified = user?.verificationStatus === 'verified';
  const categories = getCategories();

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAgencies();
      setAgencies(data);
    } catch {
      setError("Couldn't load agencies. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = agencies.filter(a => {
    if (search) return a.name.toLowerCase().includes(search.toLowerCase()) || a.shortName.toLowerCase().includes(search.toLowerCase());
    if (selectedCategory) return a.categoryId === selectedCategory;
    return true;
  });

  const sorted = view === 'agency'
    ? [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    : filtered;

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="NGAs" showBack />
      <div className="bp-stripe" aria-hidden="true" />

      <ScreenContainer noPadding className="gap-0">
        {/* Search */}
        <div className="px-4 pt-4 pb-3 bg-white border-b border-border">
          <div className="flex items-center gap-2 h-10 px-3 bg-bg border border-border rounded-full">
            <Search size={16} className="text-text-secondary shrink-0" />
            <input
              type="search"
              placeholder="Search agencies…"
              value={search}
              onChange={e => { setSearch(e.target.value); setSelectedCategory(null); }}
              className="flex-1 bg-transparent text-body text-text-primary outline-none placeholder-text-secondary"
              aria-label="Search agencies"
            />
          </div>
        </div>

        {/* View toggle */}
        <div className="px-4 py-3 bg-white border-b border-border flex gap-2">
          {(['category', 'agency'] as const).map(v => (
            <button
              key={v}
              onClick={() => { setView(v); setSelectedCategory(null); }}
              className={[
                'flex-1 h-9 rounded-full text-body-sm font-semibold transition-all',
                view === v ? 'bg-primary text-white' : 'bg-bg text-text-secondary hover:bg-primary-light',
              ].join(' ')}
              aria-pressed={view === v}
            >
              By {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        <div className="px-4 pt-4 flex flex-col gap-4 pb-4 overflow-y-auto">
          {/* Category chips */}
          {view === 'category' && !search && (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-body-sm font-semibold transition-all ${!selectedCategory ? 'bg-primary text-white' : 'bg-bg text-text-secondary hover:bg-primary-light'}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-body-sm font-semibold transition-all ${selectedCategory === cat.id ? 'bg-primary text-white' : 'bg-bg text-text-secondary hover:bg-primary-light'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {isLoading && Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}

          {/* Error */}
          {error && <ErrorState title="Couldn't load agencies" description={error} onRetry={load} />}

          {/* Agency list */}
          {!isLoading && !error && sorted.map((agency, i) => (
            <motion.button
              key={agency.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => isVerified ? navigate(`/agencies/${agency.id}`) : navigate('/verify')}
              className="w-full bg-white rounded-lg border border-border p-4 flex items-center gap-3 text-left hover:shadow-card-hover hover:border-primary/20 transition-all active:scale-[0.99]"
              aria-label={`${agency.name}${!isVerified ? ' — requires verification' : ''}`}
            >
              {/* Logo placeholder */}
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                style={{ backgroundColor: agency.logoColor }}
                aria-hidden="true"
              >
                {agency.logoLetter}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-body font-semibold text-text-primary truncate">{agency.shortName}</p>
                  {agency.linked && isVerified && (
                    <Badge variant="success" className="text-xs shrink-0">Linked</Badge>
                  )}
                </div>
                <p className="text-body-sm text-text-secondary truncate">{agency.name}</p>
                <p className="text-xs text-text-secondary/70 truncate mt-0.5">{agency.category}</p>
              </div>

              {!isVerified ? (
                <Lock size={16} className="text-gray-300 shrink-0" aria-hidden="true" />
              ) : (
                <ChevronRight size={18} className="text-text-secondary shrink-0" />
              )}
            </motion.button>
          ))}

          {!isLoading && !error && sorted.length === 0 && (
            <div className="text-center py-8 text-text-secondary">
              <p className="text-h2 mb-1">No results</p>
              <p className="text-body-sm">No agencies match "{search}".</p>
            </div>
          )}
        </div>
      </ScreenContainer>
    </div>
  );
}
