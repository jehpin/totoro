import React from 'react';
import { Home, CloudRain, MapPin, SlidersHorizontal } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: 'home' | 'forecast' | 'stations' | 'settings';
  setActiveTab: (tab: 'home' | 'forecast' | 'stations' | 'settings') => void;
  onOpenSettings: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
}) => {
  return (
    <nav className="md:hidden bg-[#FDF5E6] text-[#4A7856] font-bold text-xs fixed bottom-0 left-0 right-0 w-full z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(93,64,55,0.08)] flex justify-around items-center px-4 py-2 border-t border-[#e9e2d3]">
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-full transition-all duration-200 ${
          activeTab === 'home'
            ? 'bg-[#4A7856] text-white shadow-xs scale-105'
            : 'text-[#5D4037]/75 hover:opacity-80'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[11px]">Home</span>
      </button>

      <button
        onClick={() => setActiveTab('forecast')}
        className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-full transition-all duration-200 ${
          activeTab === 'forecast'
            ? 'bg-[#4A7856] text-white shadow-xs scale-105'
            : 'text-[#5D4037]/75 hover:opacity-80'
        }`}
      >
        <CloudRain className="w-5 h-5 mb-0.5" />
        <span className="text-[11px]">Forecast</span>
      </button>

      <button
        onClick={() => setActiveTab('stations')}
        className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-full transition-all duration-200 ${
          activeTab === 'stations'
            ? 'bg-[#4A7856] text-white shadow-xs scale-105'
            : 'text-[#5D4037]/75 hover:opacity-80'
        }`}
      >
        <MapPin className="w-5 h-5 mb-0.5" />
        <span className="text-[11px]">Stations</span>
      </button>

      <button
        onClick={onOpenSettings}
        className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-full transition-all duration-200 ${
          activeTab === 'settings'
            ? 'bg-[#4A7856] text-white shadow-xs scale-105'
            : 'text-[#5D4037]/75 hover:opacity-80'
        }`}
      >
        <SlidersHorizontal className="w-5 h-5 mb-0.5" />
        <span className="text-[11px]">Lah-out</span>
      </button>
    </nav>
  );
};
