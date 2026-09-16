/**
 * HomeScreen — eGovPH HCI Prototype
 * Shows different content for unverified (locked tiles) and verified users.
 * Matches the real app's tile grid + announcement carousel + services layout.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Lock, ChevronRight, MapPin, Sun, Wifi, MessageCircle } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Card';
import { useAuth } from '../../state/AuthContext';

// ----------------------------------------------------------------
// Service tiles — matching real app's confirmed feature set
// ----------------------------------------------------------------
const ALL_TILES = [
  { id: 'ngas', label: 'NGAs', icon: '🏛️', path: '/agencies', requiresVerification: true },
  { id: 'lgus', label: 'LGUs', icon: '🏙️', path: '/lgu', requiresVerification: true },
  { id: 'jobs', label: 'Jobs', icon: '💼', path: '/employment', requiresVerification: false, isNew: true },
  { id: 'tourism', label: 'Tourism', icon: '🌴', path: '/home/tourism', requiresVerification: false },
  { id: 'travel', label: 'Travel', icon: '✈️', path: '/etravel', requiresVerification: false },
  { id: 'ofw', label: 'OFW', icon: '🌏', path: '/agencies/owwa', requiresVerification: true, isNew: true },
  { id: 'health', label: 'Health', icon: '❤️', path: '/agencies/philhealth', requiresVerification: true },
  { id: 'report', label: 'Report', icon: '📋', path: '/ereport', requiresVerification: false },
  { id: 'simcard', label: 'Sim Card', icon: '📱', path: '/services', requiresVerification: true },
  { id: 'startup', label: 'Start-Up', icon: '🚀', path: '/services', requiresVerification: true, isNew: true },
  { id: 'bpesh', label: 'Services Hub', icon: '🏢', path: '/bpesh', requiresVerification: true },
  { id: 'egovpay', label: 'eGovPay', icon: '💳', path: '/egovpay', requiresVerification: true },
];

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Bagong Pilipinas eGovPH Serbisyo Hub',
    subtitle: 'Avail Services →',
    bg: 'bg-primary',
    textColor: 'text-white',
    path: '/bpesh', // M-05: correct path
  },
  {
    id: 2,
    title: 'Book your NBI Clearance online',
    subtitle: 'No more long queues — book in minutes →',
    bg: 'bg-secondary',
    textColor: 'text-white',
    path: '/bpesh/appointment', // M-05: correct path
  },
  {
    id: 3,
    title: 'New: Digital TIN ID now available',
    subtitle: 'Access your BIR TIN ID in the Mobile ID wallet →',
    bg: 'bg-accent',
    textColor: 'text-text-primary',
    path: '/id/qr', // M-05: correct path
  },
];

export function HomeScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const isVerified = user?.verificationStatus === 'verified';

  // M-04: Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIdx(prev => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const visibleTiles = showAll ? ALL_TILES : ALL_TILES.slice(0, 8);

  const handleTileClick = (tile: typeof ALL_TILES[0]) => {
    if (tile.requiresVerification && !isVerified) {
      navigate('/verify');
    } else {
      navigate(tile.path);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar />
      {/* Bagong Pilipinas stripe */}
      <div className="bp-stripe shrink-0" aria-hidden="true" />

      <ScreenContainer noPadding className="gap-0">
        {/* Greeting + search */}
        <div className="bg-white px-4 pt-4 pb-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-sm text-text-secondary flex items-center gap-1">
                <MapPin size={12} /> {user?.lguCode === 'QC' ? 'Quezon City, Metro Manila' : 'Philippines'}
              </p>
              <h1 className="text-h2 font-bold text-text-primary">
                Mabuhay, {user?.firstName ?? user?.fullName?.split(' ')[0]}!
              </h1>
              {!isVerified && (
                <button
                  onClick={() => navigate('/verify')}
                  className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full hover:bg-secondary/20 transition-colors"
                >
                  ⚠ Verify account to unlock all services
                </button>
              )}
              {isVerified && (
                <span className="mt-1 badge-verified text-xs">
                  ✓ Verified
                </span>
              )}
            </div>
            {/* User avatar placeholder */}
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-body">{(user?.firstName ?? 'U')[0]}</span>
            </div>
          </div>

          {/* Search bar */}
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-3 h-11 px-4 bg-bg border border-border rounded-full text-text-secondary hover:border-primary/50 transition-colors w-full"
            aria-label="Search government services"
          >
            <Search size={18} />
            <span className="text-body text-text-secondary">Search Services like eTravel</span>
          </button>
        </div>

        {/* Horizontal service shortcuts strip */}
        <div className="bg-white px-4 py-3 border-t border-border">
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1">
            {[
              { icon: '✈️', label: 'Travel', path: '/etravel' },
              { icon: '❤️', label: 'Health', path: '/agencies/philhealth' },
              { icon: '💼', label: 'Jobs', path: '/employment' },
              { icon: '📋', label: 'Report', path: '/ereport' },
              { icon: '☀️', label: 'Weather', path: '/weather' },
              { icon: '💬', label: 'eGov AI', path: '/egov-ai' },
            ].map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 shrink-0 hover:text-primary transition-colors"
              >
                <div className="w-11 h-11 bg-primary-light rounded-full flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <span className="text-xs text-text-secondary font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Announcement carousel */}
        <div className="px-4 pt-4 pb-2">
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <motion.div
                key={carouselIdx}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`${ANNOUNCEMENTS[carouselIdx].bg} rounded-lg p-5 flex items-center gap-4 min-h-[90px]`}
              >
                {/* Serbisyo hub illustration placeholder */}
                <div className="flex-1">
                  <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1">
                    Bagong Pilipinas
                  </div>
                  <p className={`text-h2 font-bold ${ANNOUNCEMENTS[carouselIdx].textColor} leading-tight`}>
                    {ANNOUNCEMENTS[carouselIdx].title}
                  </p>
                  <button
                    onClick={() => navigate(ANNOUNCEMENTS[carouselIdx].path)}
                    className={`text-body-sm font-semibold mt-1 ${ANNOUNCEMENTS[carouselIdx].textColor} opacity-80 hover:opacity-100`}
                  >
                    {ANNOUNCEMENTS[carouselIdx].subtitle}
                  </button>
                </div>
                <div className="text-4xl shrink-0">🏛️</div>
              </motion.div>
            </div>
            {/* Dots */}
            <div className="flex gap-1 justify-center mt-2">
              {ANNOUNCEMENTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === carouselIdx ? 'bg-primary w-4' : 'bg-border'}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Widget row — Weather + Signal + AI */}
        <div className="px-4 py-3 grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/weather')}
            className="bg-white rounded-lg border border-border p-4 text-left hover:shadow-card-hover transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-2 text-text-secondary text-body-sm mb-1">
              <Sun size={14} /> Quezon City
            </div>
            <div className="text-h2 font-bold text-text-primary">32°C</div>
            <div className="text-body-sm text-text-secondary">Partly Cloudy</div>
            <div className="text-xs text-primary mt-1 font-medium">Weather and Alerts →</div>
          </button>
          <button
            onClick={() => navigate('/speedtest')}
            className="bg-white rounded-lg border border-border p-4 text-left hover:shadow-card-hover transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-2 text-text-secondary text-body-sm mb-1">
              <Wifi size={14} /> Signal Tester
            </div>
            <div className="text-h2 font-bold text-text-primary">--</div>
            <div className="text-body-sm text-text-secondary">Mbps</div>
            <div className="text-xs text-primary mt-1 font-medium">Tap to test →</div>
          </button>
        </div>

        {/* eGov AI promo */}
        <div className="px-4 pb-2">
          <button
            onClick={() => navigate('/egov-ai')}
            className="w-full bg-primary-light border border-primary/20 rounded-lg p-4 flex items-center gap-4 hover:bg-primary/10 transition-colors text-left"
          >
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
              <MessageCircle size={24} className="text-white" />
            </div>
            <div>
              <p className="text-body font-semibold text-primary">eGov AI Assistant</p>
              <p className="text-body-sm text-text-secondary">Ask about government services, requirements, and how to use the app.</p>
            </div>
            <ChevronRight size={18} className="text-primary shrink-0 ml-auto" />
          </button>
        </div>

        {/* Featured services section */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-h2 font-bold text-text-primary">Featured eGov Services</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate(isVerified ? '/agencies' : '/verify')}
              className="bg-primary rounded-lg p-4 text-left hover:bg-primary-dark transition-colors active:scale-[0.99] relative overflow-hidden"
            >
              <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Powered by eNGA</div>
              <p className="text-body font-bold text-white">National Government Services</p>
              <p className="text-xs text-white/70 mt-0.5">National Documents</p>
              {!isVerified && <Lock size={14} className="absolute top-3 right-3 text-white/60" />}
            </button>
            <button
              onClick={() => navigate('/lgu')}
              className="bg-white border border-border rounded-lg p-4 text-left hover:shadow-card-hover transition-all active:scale-[0.99]"
            >
              <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">Powered by eLGU</div>
              <p className="text-body font-bold text-text-primary">Local Government Services</p>
              <p className="text-xs text-text-secondary mt-0.5">Local Documents</p>
            </button>
          </div>
        </div>

        {/* Service tiles grid */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-h2 font-bold text-text-primary">All Services</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {visibleTiles.map(tile => {
              const locked = tile.requiresVerification && !isVerified;
              return (
                <motion.button
                  key={tile.id}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleTileClick(tile)}
                  className="flex flex-col items-center gap-2 group"
                  aria-label={`${tile.label}${locked ? ' — requires verification' : ''}`}
                >
                  <div className={[
                    'w-14 h-14 rounded-xl flex items-center justify-center text-2xl relative',
                    'border transition-all',
                    locked
                      ? 'bg-gray-100 border-border opacity-60'
                      : 'bg-primary-light border-transparent group-hover:border-primary/30',
                  ].join(' ')}>
                    <span>{tile.icon}</span>
                    {locked && (
                      <Lock size={12} className="absolute bottom-1 right-1 text-gray-400" aria-hidden="true" />
                    )}
                    {tile.isNew && !locked && (
                      <span className="badge-new absolute -top-1 -right-1 text-[9px] px-1 py-0">New</span>
                    )}
                  </div>
                  <span className={`text-xs font-semibold leading-tight text-center ${locked ? 'text-gray-400' : 'text-text-primary'}`}>
                    {tile.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <button
            onClick={() => setShowAll(s => !s)}
            className="w-full mt-4 flex items-center justify-center gap-1 text-primary text-body-sm font-semibold py-2 hover:underline"
          >
            {showAll ? 'Show Less' : `Show More (${ALL_TILES.length - 8} more)`}
          </button>
        </div>

        {/* Popular Destinations (Tourism — available to unverified) */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-h2 font-bold text-text-primary">Popular Destinations</h2>
            <button onClick={() => navigate('/home/tourism')} className="text-primary text-body-sm font-semibold hover:underline">
              See all
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
            {[
              { name: 'Coron', color: '#0EA5E9', emoji: '🏝️' },
              { name: 'Boracay', color: '#38BDF8', emoji: '🌊' },
              { name: 'Siargao', color: '#F59E0B', emoji: '🏄' },
              { name: 'Batanes', color: '#0284C7', emoji: '🌬️' },
            ].map(dest => (
              <button
                key={dest.name}
                onClick={() => navigate('/home/tourism')}
                className="shrink-0 w-24 h-28 rounded-lg relative overflow-hidden hover:scale-105 transition-transform"
                style={{ backgroundColor: dest.color }}
                aria-label={`${dest.name} destination`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <span className="text-3xl">{dest.emoji}</span>
                  <span className="text-white text-xs font-bold">{dest.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </ScreenContainer>
    </div>
  );
}
