import React from 'react';
import { Umbrella, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#5D4037] text-[#FDF5E6] w-full mt-16 py-10 px-6 hidden md:flex flex-col items-center gap-4 text-center">
      <div className="flex items-center gap-2 text-2xl font-bold text-[#FDF5E6]">
        <Umbrella className="w-6 h-6 text-[#90BE6D]" />
        <span>Umbrella Totoro</span>
      </div>

      <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold">
        <span className="text-[#FDF5E6]/80 hover:text-[#90BE6D] transition-colors cursor-pointer">
          NEA & Data.gov.sg v2 Real-time API
        </span>
        <span className="text-[#FDF5E6]/80 hover:text-[#90BE6D] transition-colors cursor-pointer">
          Rainfall Station Sensors
        </span>
        <span className="text-[#FDF5E6]/80 hover:text-[#90BE6D] transition-colors cursor-pointer">
          Sheltered Linkway Network
        </span>
        <span className="text-[#FDF5E6]/80 hover:text-[#90BE6D] transition-colors cursor-pointer">
          Singlish Dialect Engine
        </span>
      </div>

      <p className="text-[#FDF5E6]/60 text-xs flex items-center gap-1">
        <span>Crafted with</span>
        <Heart className="w-3.5 h-3.5 text-[#FF8C00] fill-current" />
        <span>for Singapore commuters • Stay dry & steady, lah! © {new Date().getFullYear()}</span>
      </p>
    </footer>
  );
};
