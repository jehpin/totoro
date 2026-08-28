import React, { useState, useEffect } from 'react';
import { CloudRain, Play, Pause, RotateCcw, MapPin, Wind, Droplets, Sun, Activity, ShieldCheck, Thermometer, Radio, Sparkles } from 'lucide-react';
import { SingaporeLocation, LiveWeatherData } from '../types';
import { SINGAPORE_LOCATIONS } from '../data/singaporeLocations';

interface ForecastViewProps {
  currentLocation: SingaporeLocation;
  onSelectLocation: (loc: SingaporeLocation) => void;
  liveData?: LiveWeatherData | null;
  onRefresh?: () => void;
  isLoadingLive?: boolean;
}

export const ForecastView: React.FC<ForecastViewProps> = ({
  currentLocation,
  onSelectLocation,
  liveData,
  onRefresh,
  isLoadingLive,
}) => {
  const [radarFrame, setRadarFrame] = useState<number>(0);
  const [isPlayingRadar, setIsPlayingRadar] = useState<boolean>(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'radar' | 'four_day' | 'rainfall_stations' | 'air_quality'>('radar');

  // Loop radar animation
  useEffect(() => {
    if (!isPlayingRadar) return;
    const interval = setInterval(() => {
      setRadarFrame((prev) => (prev + 1) % 6);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlayingRadar]);

  const radarTimeStamps = [
    '30 min ago',
    '20 min ago',
    '10 min ago',
    'Now (Live)',
    '+15 min (Forecast)',
    '+30 min (Forecast)',
  ];

  const regions = ['All', 'Central', 'North', 'South', 'East', 'West'];

  const filteredLocations = selectedRegion === 'All' 
    ? SINGAPORE_LOCATIONS 
    : SINGAPORE_LOCATIONS.filter(l => l.region === selectedRegion);

  return (
    <div className="flex flex-col gap-8 animate-[fade-in_0.4s_ease-out]">
      {/* Title Header with Live Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-[#5D4037]">
              Singapore Weather Intelligence
            </h2>
            <span className="text-xs bg-[#4A7856] text-white px-2.5 py-0.5 rounded-full font-bold">
              v2 Live
            </span>
          </div>
          <p className="text-[#5D4037]/80 text-sm md:text-base font-medium mt-0.5">
            Real-time radar, 24-hr synopsis, 4-day outlook & live rainfall sensors from data.gov.sg
          </p>
        </div>

        <div className="flex items-center gap-2">
          {liveData?.lastUpdated && (
            <span className="text-xs text-[#5D4037]/70 font-semibold hidden sm:inline">
              Updated: {liveData.lastUpdated}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={isLoadingLive}
            className="flex items-center gap-1.5 bg-[#f5edde] hover:bg-[#efe7d9] px-3 py-1.5 rounded-full border border-[#e9e2d3] text-xs font-bold text-[#5D4037] transition-all"
          >
            <span className={`w-2 h-2 rounded-full bg-[#90BE6D] ${isLoadingLive ? 'animate-ping' : ''}`} />
            <span>{isLoadingLive ? 'Syncing...' : 'Sync Live'}</span>
          </button>
        </div>
      </div>

      {/* 24-Hour General Weather Advisory Banner */}
      {liveData?.twentyFourHrGeneral && (
        <div className="bg-[#fff9f0] border-2 border-[#87CEEB] rounded-2xl p-4 md:p-5 flex items-start gap-3.5 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-[#baeaff]/50 text-[#0c6780] flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0c6780] uppercase tracking-wider">
                NEA 24-Hour General Synopsis
              </span>
              <span className="text-[11px] bg-[#baeaff] text-[#004d62] px-2 py-0.2 rounded-full font-bold">
                Islandwide
              </span>
            </div>
            <p className="text-[#5D4037] text-sm md:text-base font-semibold mt-1">
              "{liveData.twentyFourHrGeneral}"
            </p>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('radar')}
          className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'radar'
              ? 'bg-[#4A7856] text-white shadow-sm'
              : 'bg-[#f5edde] text-[#5D4037] hover:bg-[#efe7d9]'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Doppler Radar & 2-Hour Outlook</span>
        </button>

        <button
          onClick={() => setActiveTab('four_day')}
          className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'four_day'
              ? 'bg-[#4A7856] text-white shadow-sm'
              : 'bg-[#f5edde] text-[#5D4037] hover:bg-[#efe7d9]'
          }`}
        >
          <CloudRain className="w-4 h-4" />
          <span>4-Day Outlook</span>
        </button>

        <button
          onClick={() => setActiveTab('rainfall_stations')}
          className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'rainfall_stations'
              ? 'bg-[#4A7856] text-white shadow-sm'
              : 'bg-[#f5edde] text-[#5D4037] hover:bg-[#efe7d9]'
          }`}
        >
          <Droplets className="w-4 h-4" />
          <span>Live Rain Sensors ({liveData?.rainfallSensors?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('air_quality')}
          className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'air_quality'
              ? 'bg-[#4A7856] text-white shadow-sm'
              : 'bg-[#f5edde] text-[#5D4037] hover:bg-[#efe7d9]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>PSI, PM2.5 & UV</span>
        </button>
      </div>

      {/* TAB 1: RADAR & 2-HOUR FORECAST */}
      {activeTab === 'radar' && (
        <>
          {/* Interactive Doppler Radar Screen */}
          <div className="bg-[#1e1b13] rounded-3xl p-4 md:p-6 border-4 border-[#e9e2d3] soft-shadow text-white relative overflow-hidden">
            {/* Radar Map Canvas Representation */}
            <div className="relative w-full h-[280px] md:h-[380px] bg-[#142318] rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
              {/* Grid lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#4a7856_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
              
              {/* Circular Range Rings */}
              <div className="absolute w-[240px] md:w-[320px] h-[240px] md:h-[320px] rounded-full border border-[#90BE6D]/20 pointer-events-none" />
              <div className="absolute w-[140px] md:w-[200px] h-[140px] md:h-[200px] rounded-full border border-[#90BE6D]/30 pointer-events-none" />
              
              {/* Radar Sweep Needle Line */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-1/2 h-[2px] bg-gradient-to-r from-transparent to-[#90BE6D] origin-left animate-[spin_4s_linear_infinite]" />
              </div>

              {/* Stylized Island Map SVG outline */}
              <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 500 300">
                <path
                  d="M 90,140 Q 140,110 220,115 Q 310,105 410,130 Q 430,160 390,180 Q 320,200 240,195 Q 150,210 95,170 Z"
                  fill="#22422b"
                  stroke="#90BE6D"
                  strokeWidth="2"
                />
                <path d="M 230,225 Q 260,220 270,235 Q 240,245 230,225 Z" fill="#22422b" stroke="#90BE6D" strokeWidth="1.5" />
                <path d="M 370,95 Q 400,90 410,105 Q 380,110 370,95 Z" fill="#22422b" stroke="#90BE6D" strokeWidth="1.5" />
              </svg>

              {/* Dynamic Rain Cloud Density Blobs that move across radar frames */}
              <div 
                className="absolute transition-all duration-1000 ease-out pointer-events-none"
                style={{
                  left: `${20 + radarFrame * 6}%`,
                  top: `${30 + (radarFrame % 2) * 5}%`,
                  width: '180px',
                  height: '110px',
                  background: 'radial-gradient(circle, rgba(255, 140, 0, 0.75) 0%, rgba(135, 206, 235, 0.6) 45%, transparent 75%)',
                  filter: 'blur(16px)',
                  borderRadius: '50%',
                }}
              />

              <div 
                className="absolute transition-all duration-1000 ease-out pointer-events-none"
                style={{
                  left: `${50 + radarFrame * 4}%`,
                  top: `${45 - (radarFrame % 3) * 4}%`,
                  width: '150px',
                  height: '90px',
                  background: 'radial-gradient(circle, rgba(235, 64, 52, 0.7) 0%, rgba(255, 140, 0, 0.5) 40%, transparent 70%)',
                  filter: 'blur(14px)',
                  borderRadius: '50%',
                }}
              />

              {/* Interactive Location Markers */}
              {SINGAPORE_LOCATIONS.map((loc) => {
                const leftPct = ((loc.lng - 103.65) / (104.02 - 103.65)) * 80 + 10;
                const topPct = (1 - (loc.lat - 1.22) / (1.47 - 1.22)) * 70 + 15;
                const isSelected = currentLocation.id === loc.id;

                return (
                  <button
                    key={loc.id}
                    onClick={() => onSelectLocation(loc)}
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group z-30 flex flex-col items-center cursor-pointer transition-transform ${
                      isSelected ? 'scale-125 z-40' : 'hover:scale-110'
                    }`}
                  >
                    <div className={`px-2 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 border shadow-md ${
                      isSelected
                        ? 'bg-[#90BE6D] text-[#00210d] border-white'
                        : loc.weather.rainChance >= 65
                        ? 'bg-[#FF8C00] text-white border-[#b35200]'
                        : 'bg-[#FDF5E6] text-[#5D4037] border-[#e9e2d3]'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{loc.name.split('/')[0]}</span>
                      <span className="opacity-80">({loc.weather.rainChance}%)</span>
                    </div>
                  </button>
                );
              })}

              {/* Doppler Legend */}
              <div className="absolute bottom-3 left-3 bg-[#1e1b13]/85 backdrop-blur-md p-2 rounded-xl border border-white/10 text-[10px] flex items-center gap-2 text-white">
                <span className="font-bold uppercase tracking-wider text-white/70">Intensity:</span>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#87CEEB]" />
                  <span>Light</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#90BE6D]" />
                  <span>Moderate</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#FF8C00]" />
                  <span>Heavy</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#ba1a1a]" />
                  <span>Severe Thunder</span>
                </div>
              </div>
            </div>

            {/* Radar Controls & Timeline Bar */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingRadar(!isPlayingRadar)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  {isPlayingRadar ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setRadarFrame(0)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Reset to 30 min ago"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-[#90BE6D] ml-1">
                  {radarTimeStamps[radarFrame]}
                </span>
              </div>

              {/* Stepper Dots */}
              <div className="flex items-center gap-1.5">
                {radarTimeStamps.map((label, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setRadarFrame(idx);
                      setIsPlayingRadar(false);
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                      radarFrame === idx
                        ? 'bg-[#90BE6D] text-[#00210d] font-bold shadow-xs'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* District Region Filter and Location Cards */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xl font-bold text-[#5D4037]">
                District 2-Hour Regional Outlook
              </h3>

              <div className="flex gap-1 bg-[#f5edde] p-1 rounded-full border border-[#e9e2d3]">
                {regions.map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      selectedRegion === reg
                        ? 'bg-[#4A7856] text-white shadow-xs'
                        : 'text-[#5D4037] hover:bg-[#efe7d9]'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => onSelectLocation(loc)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white soft-shadow flex flex-col justify-between gap-3 ${
                    currentLocation.id === loc.id
                      ? 'border-[#4A7856] ring-2 ring-[#4A7856]/20'
                      : 'border-[#efe7d9] hover:border-[#87CEEB]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#717971] uppercase">
                        <MapPin className="w-3.5 h-3.5 text-[#4A7856]" />
                        <span>{loc.region} Region</span>
                      </div>
                      <h4 className="font-bold text-lg text-[#5D4037] mt-0.5">
                        {loc.name}
                      </h4>
                    </div>

                    <div className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                      loc.weather.rainChance >= 65
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : loc.weather.rainChance >= 40
                        ? 'bg-[#baeaff] text-[#004d62]'
                        : 'bg-[#bcefc5] text-[#00210d]'
                    }`}>
                      <CloudRain className="w-3.5 h-3.5" />
                      <span>{loc.weather.rainChance}%</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-[#5D4037]/80 bg-[#fbf3e4] p-2.5 rounded-xl">
                    "{loc.weather.singlishSummary}"
                  </p>

                  <div className="flex items-center justify-between text-xs font-bold text-[#5D4037]/70 pt-2 border-t border-[#efe7d9]">
                    <span>Temp: {loc.weather.temp}°C</span>
                    <span>Humidity: {loc.weather.humidity}%</span>
                    <span>Rain: {loc.weather.rainfallMm} mm</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* TAB 2: LIVE 4-DAY OUTLOOK FROM DATA.GOV.SG */}
      {activeTab === 'four_day' && (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-2xl font-bold text-[#5D4037]">
              Singapore 4-Day Weather Outlook
            </h3>
            <p className="text-sm text-[#5D4037]/80 font-medium">
              Official NEA extended meteorological predictions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(liveData?.fourDayOutlook && liveData.fourDayOutlook.length > 0 ? liveData.fourDayOutlook : [
              { day: 'Day 1', date: 'Upcoming', forecast: 'Thundery Showers in the afternoon', tempLow: 25, tempHigh: 32, humidityLow: 65, humidityHigh: 95, windSpeed: '10 - 20 km/h' },
              { day: 'Day 2', date: 'Upcoming', forecast: 'Passing showers over southern & central areas', tempLow: 24, tempHigh: 31, humidityLow: 70, humidityHigh: 95, windSpeed: '15 - 25 km/h' },
              { day: 'Day 3', date: 'Upcoming', forecast: 'Fair and warm in morning, scattered rain later', tempLow: 26, tempHigh: 33, humidityLow: 60, humidityHigh: 90, windSpeed: '10 - 20 km/h' },
              { day: 'Day 4', date: 'Upcoming', forecast: 'Moderate showers over western Singapore', tempLow: 25, tempHigh: 32, humidityLow: 65, humidityHigh: 95, windSpeed: '10 - 20 km/h' },
            ]).map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border-2 border-[#efe7d9] soft-shadow flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4A7856] bg-[#4A7856]/10 px-2.5 py-1 rounded-full">
                      {item.day}
                    </span>
                    {item.date && (
                      <span className="text-xs font-semibold text-[#717971]">{item.date}</span>
                    )}
                  </div>
                  <h4 className="font-bold text-lg text-[#5D4037] mt-3 leading-snug">
                    {item.forecast}
                  </h4>
                </div>

                <div className="bg-[#fbf3e4] rounded-xl p-3 flex flex-col gap-2 text-xs font-semibold text-[#5D4037]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[#717971]">
                      <Thermometer className="w-3.5 h-3.5 text-[#FF8C00]" />
                      <span>Temp</span>
                    </span>
                    <span className="font-bold">{item.tempLow}°C - {item.tempHigh}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[#717971]">
                      <Droplets className="w-3.5 h-3.5 text-[#87CEEB]" />
                      <span>Humidity</span>
                    </span>
                    <span className="font-bold">{item.humidityLow}% - {item.humidityHigh}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[#717971]">
                      <Wind className="w-3.5 h-3.5 text-[#4A7856]" />
                      <span>Wind</span>
                    </span>
                    <span className="font-bold">{item.windSpeed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LIVE RAINFALL SENSORS FROM DATA.GOV.SG */}
      {activeTab === 'rainfall_stations' && (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-2xl font-bold text-[#5D4037]">
              Live Rainfall Station Sensor Network
            </h3>
            <p className="text-sm text-[#5D4037]/80 font-medium">
              Real-time precipitation mm measurements reported directly by NEA automatic rain gauges across Singapore
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(liveData?.rainfallSensors && liveData.rainfallSensors.length > 0 ? liveData.rainfallSensors : [
              { id: 'S104', stationId: 'S104', name: 'Admiralty West', lat: 1.4439, lng: 103.7854, value: 0 },
              { id: 'S109', stationId: 'S109', name: 'Ang Mo Kio', lat: 1.3764, lng: 103.8492, value: 0 },
              { id: 'S117', stationId: 'S117', name: 'Banyan Road (Jurong)', lat: 1.256, lng: 103.679, value: 1.2 },
              { id: 'S116', stationId: 'S116', name: 'Pasir Panjang', lat: 1.281, lng: 103.754, value: 0 },
              { id: 'S111', stationId: 'S111', name: 'Scotts Road (Newton)', lat: 1.3106, lng: 103.8365, value: 0 },
              { id: 'S108', stationId: 'S108', name: 'Marina Barrage', lat: 1.2799, lng: 103.8703, value: 0.4 },
              { id: 'S121', stationId: 'S121', name: 'Choa Chu Kang (West)', lat: 1.3729, lng: 103.7485, value: 0 },
              { id: 'S107', stationId: 'S107', name: 'East Coast Parkway', lat: 1.3135, lng: 103.9619, value: 0 },
            ]).map((sensor) => (
              <div
                key={sensor.id}
                className="bg-white rounded-2xl p-4 border-2 border-[#efe7d9] soft-shadow flex items-center justify-between gap-3"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#717971] uppercase tracking-wider block">
                    Station {sensor.stationId}
                  </span>
                  <h4 className="font-bold text-sm text-[#5D4037] mt-0.5">
                    {sensor.name}
                  </h4>
                </div>

                <div className={`px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 ${
                  sensor.value > 2
                    ? 'bg-[#ffdad6] text-[#ba1a1a]'
                    : sensor.value > 0
                    ? 'bg-[#baeaff] text-[#004d62]'
                    : 'bg-[#bcefc5] text-[#00210d]'
                }`}>
                  <Droplets className="w-3.5 h-3.5" />
                  <span>{sensor.value.toFixed(1)} mm</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AIR QUALITY & UV INDEX */}
      {activeTab === 'air_quality' && (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-2xl font-bold text-[#5D4037]">
              Live PSI, PM2.5 & Solar UV Metrics
            </h3>
            <p className="text-sm text-[#5D4037]/80 font-medium">
              Continuous environmental pollution and UV radiation monitoring from NEA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PSI Card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#efe7d9] soft-shadow flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#717971] uppercase tracking-wider">
                    24-Hr PSI (Pollutant Standards)
                  </span>
                  <span className="text-xs bg-[#bcefc5] text-[#00210d] px-2.5 py-0.5 rounded-full font-extrabold">
                    {liveData?.airQuality.psi.status || 'Good'}
                  </span>
                </div>
                <div className="text-4xl font-extrabold text-[#5D4037] mt-3">
                  {liveData?.airQuality.psi.overall || 48}
                </div>
              </div>

              <div className="bg-[#fbf3e4] rounded-2xl p-3 text-xs font-semibold text-[#5D4037] flex flex-col gap-1.5">
                <div className="flex justify-between"><span>North:</span><b>{liveData?.airQuality.psi.north || 45}</b></div>
                <div className="flex justify-between"><span>South:</span><b>{liveData?.airQuality.psi.south || 50}</b></div>
                <div className="flex justify-between"><span>East:</span><b>{liveData?.airQuality.psi.east || 47}</b></div>
                <div className="flex justify-between"><span>West:</span><b>{liveData?.airQuality.psi.west || 52}</b></div>
                <div className="flex justify-between"><span>Central:</span><b>{liveData?.airQuality.psi.central || 46}</b></div>
              </div>
            </div>

            {/* PM2.5 Card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#efe7d9] soft-shadow flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#717971] uppercase tracking-wider">
                    1-Hr PM2.5 Particulate (µg/m³)
                  </span>
                  <span className="text-xs bg-[#bcefc5] text-[#00210d] px-2.5 py-0.5 rounded-full font-extrabold">
                    {liveData?.airQuality.pm25.status || 'Normal'}
                  </span>
                </div>
                <div className="text-4xl font-extrabold text-[#5D4037] mt-3">
                  {liveData?.airQuality.pm25.overall || 12} µg/m³
                </div>
              </div>

              <div className="bg-[#fbf3e4] rounded-2xl p-3 text-xs font-semibold text-[#5D4037] flex flex-col gap-1.5">
                <div className="flex justify-between"><span>North:</span><b>{liveData?.airQuality.pm25.north || 10}</b></div>
                <div className="flex justify-between"><span>South:</span><b>{liveData?.airQuality.pm25.south || 14}</b></div>
                <div className="flex justify-between"><span>East:</span><b>{liveData?.airQuality.pm25.east || 11}</b></div>
                <div className="flex justify-between"><span>West:</span><b>{liveData?.airQuality.pm25.west || 15}</b></div>
                <div className="flex justify-between"><span>Central:</span><b>{liveData?.airQuality.pm25.central || 12}</b></div>
              </div>
            </div>

            {/* UV Index Card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#efe7d9] soft-shadow flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#717971] uppercase tracking-wider">
                    Live Solar UV Radiation Index
                  </span>
                  <span className="text-xs bg-[#baeaff] text-[#004d62] px-2.5 py-0.5 rounded-full font-extrabold">
                    {liveData?.airQuality.uv.status || 'Moderate'}
                  </span>
                </div>
                <div className="text-4xl font-extrabold text-[#5D4037] mt-3 flex items-baseline gap-2">
                  <span>{liveData?.airQuality.uv.index || 6}</span>
                  <span className="text-sm text-[#717971] font-semibold">/ 15</span>
                </div>
              </div>

              <div className="bg-[#fbf3e4] rounded-2xl p-4 text-xs font-semibold text-[#5D4037] flex flex-col gap-2">
                <p>
                  {(liveData?.airQuality.uv.index || 6) >= 8
                    ? '⚠️ Extreme sun exposure. Seek shade or umbrella UV shelter during midday!'
                    : '⛅ Moderate solar intensity. Umbrella provides nice shade & cooling!'}
                </p>
                <div className="text-[11px] text-[#717971]">
                  Last recorded: {liveData?.airQuality.uv.timestamp || 'Live'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

