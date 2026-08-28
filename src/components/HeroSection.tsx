import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Droplets, Compass, Sparkles, CloudRain, Sun, CloudLightning } from 'lucide-react';
import { SingaporeLocation } from '../types';
import { SINGAPORE_LOCATIONS } from '../data/singaporeLocations';

interface HeroSectionProps {
  currentLocation: SingaporeLocation;
  onSelectLocation: (loc: SingaporeLocation) => void;
  onAutoDetect: () => void;
  isDetectingLocation: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLocation,
  onSelectLocation,
  onAutoDetect,
  isDetectingLocation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeWeatherMode, setActiveWeatherMode] = useState<'normal' | 'squall' | 'drizzle' | 'sunny'>('normal');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Filter locations based on search query
  const filteredLocations = SINGAPORE_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Raindrop canvas animation over the illustration
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const drops: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];
    const dropCount = activeWeatherMode === 'squall' ? 120 : activeWeatherMode === 'drizzle' ? 35 : activeWeatherMode === 'sunny' ? 0 : 60;

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 14 + 10,
        speed: Math.random() * 6 + 12,
        opacity: Math.random() * 0.4 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (activeWeatherMode !== 'sunny') {
        ctx.strokeStyle = 'rgba(230, 245, 255, 0.65)';
        ctx.lineWidth = activeWeatherMode === 'squall' ? 2 : 1.2;
        ctx.lineCap = 'round';

        drops.forEach((drop) => {
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - (activeWeatherMode === 'squall' ? 4 : 1), drop.y + drop.length);
          ctx.stroke();

          drop.y += drop.speed;
          drop.x -= activeWeatherMode === 'squall' ? 2.5 : 0.8;

          if (drop.y > height) {
            drop.y = -drop.length;
            drop.x = Math.random() * (width + 50);
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeWeatherMode]);

  const rainChance = currentLocation.weather.rainChance;

  // Rain water gauge fill percentage (min 15%, max 95%)
  const gaugePercent = Math.min(100, Math.max(15, rainChance));

  return (
    <section className="flex flex-col md:flex-row items-center gap-8 lg:gap-12 pt-4 md:pt-8">
      {/* Left Column: Heading, Search, and Rain Probability Gauge */}
      <div className="flex-1 w-full flex flex-col gap-6">
        {/* Main Headline */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e9e2d3] text-[#5D4037] text-xs font-bold mb-3 tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#90BE6D] animate-ping" />
            Live SG Rainfall Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[48px] font-bold text-[#5D4037] tracking-tight leading-[1.15]">
            Steady, lah! <br />
            <span className="text-[#4A7856]">Ready for the rain?</span>
          </h1>
          <p className="text-[#5D4037]/80 text-base md:text-lg mt-2 font-medium">
            Real-time Singapore cloudburst alerts, sheltered linkway guides & quirky Singlish forecasts.
          </p>
        </div>

        {/* Location Selector Input with Autocomplete */}
        <div className="relative w-full max-w-md" ref={dropdownRef}>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Where you at, ah?"
              className="w-full bg-[#FDF5E6] border-2 border-[#4A7856] rounded-full px-6 py-3.5 pr-24 font-semibold text-lg text-[#1e1b13] focus:outline-none focus:ring-4 focus:ring-[#4A7856]/20 inset-shadow-soft placeholder:text-[#717971] transition-all"
            />
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={onAutoDetect}
                disabled={isDetectingLocation}
                title="Detect GPS location"
                className="p-1.5 rounded-full hover:bg-[#e9e2d3] text-[#4A7856] transition-colors"
              >
                <Compass className={`w-5 h-5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
              </button>
              <MapPin className="w-5 h-5 text-[#4A7856]" />
            </div>
          </div>

          {/* Location Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#FDF5E6] border-2 border-[#4A7856]/40 rounded-2xl p-2 shadow-xl z-40 max-h-72 overflow-y-auto">
              <div className="px-3 py-1.5 text-xs font-bold text-[#5D4037]/70 uppercase tracking-wider">
                Select Singapore Town / Hub
              </div>
              {filteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    onSelectLocation(loc);
                    setSearchTerm('');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                    currentLocation.id === loc.id
                      ? 'bg-[#4A7856] text-white'
                      : 'text-[#1e1b13] hover:bg-[#e9e2d3]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 opacity-75" />
                    <span>{loc.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    currentLocation.id === loc.id
                      ? 'bg-white/20 text-white'
                      : 'bg-[#e9e2d3] text-[#5D4037]'
                  }`}>
                    {loc.weather.rainChance}% rain
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rain Probability Card with Fill Gauge */}
        <div className="bg-[#fbf3e4] rounded-2xl p-5 md:p-6 border-2 border-[#87CEEB] soft-shadow inline-flex items-center gap-5 max-w-md w-full">
          {/* Circular Water Filling Level Indicator */}
          <div className="w-16 h-16 rounded-full border-4 border-[#e9e2d3] flex items-center justify-center relative overflow-hidden bg-white shrink-0 shadow-inner">
            <div
              className={`absolute bottom-0 left-0 right-0 transition-all duration-700 ${
                rainChance >= 65 ? 'bg-[#FF8C00]/60' : rainChance >= 40 ? 'bg-[#87CEEB]/70' : 'bg-[#90BE6D]/60'
              }`}
              style={{ height: `${gaugePercent}%` }}
            />
            {/* Animated wave line */}
            <div
              className="absolute left-0 right-0 h-1 bg-white/40 opacity-75"
              style={{ bottom: `${gaugePercent}%` }}
            />
            <Droplets className="w-7 h-7 relative z-10 text-[#5D4037] drop-shadow-sm" />
          </div>

          {/* Text Summary */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-2xl md:text-3xl text-[#5D4037]">
                {rainChance}% chance
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                rainChance >= 65 
                  ? 'bg-[#ffdad6] text-[#ba1a1a]' 
                  : rainChance >= 40 
                  ? 'bg-[#baeaff] text-[#004d62]' 
                  : 'bg-[#bcefc5] text-[#00210d]'
              }`}>
                {rainChance >= 65 ? 'HIGH RISK' : rainChance >= 40 ? 'MODERATE' : 'LOW RISK'}
              </span>
            </div>
            <p className="text-sm md:text-base font-medium text-[#5D4037]/80 mt-0.5">
              {rainChance >= 65
                ? 'better watch out, thunder clouds building!'
                : rainChance >= 40
                ? 'passing showers, take brolly just in case!'
                : 'mostly fine, steady sun all day!'}
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Studio Ghibli Aesthetic Artwork Card */}
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="relative w-full max-w-lg h-[360px] md:h-[420px] rounded-3xl overflow-hidden border-4 border-[#FDF5E6] soft-shadow group">
          {/* Main Ghibli Style Character under Giant Taro Leaf */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkGWUVjgovGnSNM1-jaF9DQkNJR2rVcTPZ2YEt-HR_zf2k-zEkJrokInuCL8pKgDRfMoLDgxMzFRpNlLvOLtsfUw6BqabGvg6Q3i7T3014j_itAHAbJqPKZTyNuWF7fkRAEedVKzRvzLnAg-ACpZtM6NLMKSNY-J6CayAMltNUi2YjTkiVOjRO4dqar94yPsV7-8LT74XPkqYgGo6kiJnl-WGSfsAN_W4jHf4f4pwbqnwiKY3fSlJM"
            alt="A hand-drawn Studio Ghibli style illustration of a cute character huddled cozy under a giant lush green taro leaf shelter during a gentle forest rain in Singapore."
            className="w-full h-full object-cover select-none pointer-events-none transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Interactive Dynamic Rain Particles Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-10"
          />

          {/* Weather Simulation Mode Badges Overlay */}
          <div className="absolute top-4 left-4 z-20 flex gap-1.5 bg-[#FDF5E6]/90 backdrop-blur-md p-1 rounded-full border border-[#e9e2d3] shadow-md">
            <button
              onClick={() => setActiveWeatherMode('normal')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                activeWeatherMode === 'normal'
                  ? 'bg-[#4A7856] text-white shadow-xs'
                  : 'text-[#5D4037] hover:bg-[#e9e2d3]'
              }`}
            >
              Gentle Rain
            </button>
            <button
              onClick={() => setActiveWeatherMode('squall')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                activeWeatherMode === 'squall'
                  ? 'bg-[#4A7856] text-white shadow-xs'
                  : 'text-[#5D4037] hover:bg-[#e9e2d3]'
              }`}
            >
              ⚡ Squall
            </button>
            <button
              onClick={() => setActiveWeatherMode('sunny')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                activeWeatherMode === 'sunny'
                  ? 'bg-[#4A7856] text-white shadow-xs'
                  : 'text-[#5D4037] hover:bg-[#e9e2d3]'
              }`}
            >
              ☀️ Sunny
            </button>
          </div>

          {/* District Tag Overlay */}
          <div className="absolute bottom-4 right-4 z-20 bg-[#1e1b13]/70 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
            <MapPin className="w-3.5 h-3.5 text-[#90BE6D]" />
            <span>{currentLocation.name}</span>
            <span className="opacity-60">•</span>
            <span className="text-[#90BE6D]">{currentLocation.weather.temp}°C</span>
          </div>
        </div>
      </div>
    </section>
  );
};
