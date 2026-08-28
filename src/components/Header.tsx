import React, { useState } from 'react';
import { Umbrella, Volume2, VolumeX, Sparkles, MapPin, SlidersHorizontal, CloudRain } from 'lucide-react';
import { rainAudio } from '../utils/audioSynth';
import { SingaporeLocation } from '../types';

interface HeaderProps {
  activeTab: 'home' | 'forecast' | 'stations' | 'settings';
  setActiveTab: (tab: 'home' | 'forecast' | 'stations' | 'settings') => void;
  currentLocation: SingaporeLocation;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentLocation,
  onOpenSettings,
}) => {
  const [isAudioOn, setIsAudioOn] = useState(false);

  const handleToggleAudio = () => {
    const newState = rainAudio.toggleRain(0.3);
    setIsAudioOn(newState);
  };

  return (
    <header className="bg-[#fff8ef]/95 backdrop-blur-md text-[#325f3f] w-full top-0 sticky border-b border-[#e9e2d3]/80 z-50 transition-colors">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-4 md:px-10 py-3.5">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-full bg-[#4A7856] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Umbrella className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="font-bold text-2xl md:text-3xl tracking-tight text-[#4A7856] flex items-center gap-1.5">
              <span>Umbrella Totoro</span>
              <span className="text-[11px] bg-[#90BE6D]/30 text-[#225031] px-2 py-0.5 rounded-full font-bold border border-[#90BE6D]/40">SG Live</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-2 items-center bg-[#f5edde]/70 p-1.5 rounded-full border border-[#e9e2d3]">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-200 ${
              activeTab === 'home'
                ? 'bg-[#4A7856] text-white shadow-sm'
                : 'text-[#5D4037] hover:bg-[#efe7d9]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('forecast')}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === 'forecast'
                ? 'bg-[#4A7856] text-white shadow-sm'
                : 'text-[#5D4037] hover:bg-[#efe7d9]'
            }`}
          >
            <CloudRain className="w-4 h-4" />
            Forecast & Radar
          </button>
          <button
            onClick={() => setActiveTab('stations')}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === 'stations'
                ? 'bg-[#4A7856] text-white shadow-sm'
                : 'text-[#5D4037] hover:bg-[#efe7d9]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Smart Stations
          </button>
        </nav>

        {/* Actions & Ambience Audio Pill */}
        <div className="flex items-center gap-2.5">
          {/* Ambient Rain Noise Button */}
          <button
            onClick={handleToggleAudio}
            title={isAudioOn ? "Mute soothing rain sound" : "Play soothing rain ambience"}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isAudioOn 
                ? 'bg-[#9ae1ff] border-[#0c6780] text-[#004d62] animate-pulse-gentle shadow-sm' 
                : 'bg-[#f5edde] border-[#e9e2d3] text-[#5D4037] hover:bg-[#efe7d9]'
            }`}
          >
            {isAudioOn ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAudioOn ? 'Rain Sound: On' : 'Rain Ambience'}</span>
          </button>

          {/* Quick Settings Drawer trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-full bg-[#f5edde] hover:bg-[#efe7d9] text-[#5D4037] border border-[#e9e2d3] transition-colors"
            title="Settings & Singlish Dialect"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
