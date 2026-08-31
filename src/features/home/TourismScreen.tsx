/**
 * TourismScreen — Philippine destinations, available to unverified users
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { db } from '../../mock/db';

interface Destination {
  id: string;
  name: string;
  tagline: string;
  category: string;
  region: string;
  rating: number;
  imageColor: string;
  imageEmoji: string;
  description: string;
  highlights: string[];
}

export function TourismScreen() {
  const destinations = db.get<Destination[]>('tourism') ?? [];
  const [selected, setSelected] = useState<Destination | null>(null);
  const categories = [...new Set(destinations.map(d => d.category))];
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter ? destinations.filter(d => d.category === filter) : destinations;

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Tourism" showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer noPadding className="gap-0">
        {/* Category filter */}
        <div className="px-4 py-3 bg-white border-b border-border">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            <button onClick={() => setFilter(null)} className={`shrink-0 px-3 py-1.5 rounded-full text-body-sm font-semibold ${!filter ? 'bg-primary text-white' : 'bg-bg text-text-secondary'}`}>All</button>
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c === filter ? null : c)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-body-sm font-semibold ${filter === c ? 'bg-primary text-white' : 'bg-bg text-text-secondary'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pt-4 pb-4 grid grid-cols-2 gap-3">
          {filtered.map((dest, i) => (
            <motion.button
              key={dest.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(dest === selected ? null : dest)}
              className="rounded-lg overflow-hidden border border-border text-left hover:shadow-card-hover transition-all active:scale-[0.98]"
              style={{ backgroundColor: dest.imageColor }}
            >
              <div className="h-20 flex items-center justify-center text-4xl" aria-hidden="true">
                {dest.imageEmoji}
              </div>
              <div className="bg-white p-3">
                <p className="text-body font-bold text-text-primary leading-tight">{dest.name}</p>
                <p className="text-xs text-text-secondary">{dest.region}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={10} className="text-accent fill-accent" />
                  <span className="text-xs text-text-secondary">{dest.rating}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Destination detail modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end" style={{ maxWidth: 430, left: '50%', transform: 'translateX(-50%)' }}>
            <motion.div
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-t-2xl w-full p-6 pb-8 max-h-[80vh] overflow-y-auto"
            >
              <div className="h-32 rounded-xl flex items-center justify-center text-6xl mb-4" style={{ backgroundColor: selected.imageColor }}>
                {selected.imageEmoji}
              </div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h2 className="text-h1 font-bold text-text-primary">{selected.name}</h2>
                  <p className="text-body-sm text-text-secondary flex items-center gap-1">
                    <MapPin size={12} /> {selected.region}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-accent/20 px-2 py-1 rounded-full">
                  <Star size={12} className="text-accent fill-accent" />
                  <span className="text-xs font-bold">{selected.rating}</span>
                </div>
              </div>
              <p className="text-body-sm text-text-secondary">{selected.tagline}</p>
              <p className="text-body text-text-primary mt-3 leading-relaxed">{selected.description}</p>
              <div className="mt-4">
                <p className="text-body-sm font-semibold text-text-primary mb-2">Highlights</p>
                {selected.highlights.map(h => (
                  <p key={h} className="text-body-sm text-text-secondary py-1 flex items-center gap-2">
                    <span className="text-primary" aria-hidden="true">›</span> {h}
                  </p>
                ))}
              </div>
              <button onClick={() => setSelected(null)} className="mt-5 w-full h-12 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                Close
              </button>
            </motion.div>
          </div>
        )}
      </ScreenContainer>
    </div>
  );
}
