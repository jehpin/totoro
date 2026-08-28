import React, { useState } from 'react';
import { Wind, Droplets, SunMedium, Thermometer, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { WeatherCondition, HourlyForecastItem } from '../types';

interface WeatherStatsGridProps {
  weather: WeatherCondition;
  hourlyForecast: HourlyForecastItem[];
}

export const WeatherStatsGrid: React.FC<WeatherStatsGridProps> = ({
  weather,
  hourlyForecast,
}) => {
  const [showHourly, setShowHourly] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* 4 Primary Weather Stat Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Wind */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border-2 border-[#efe7d9] flex flex-col items-center justify-center text-center gap-1.5 soft-shadow hover:border-[#87CEEB] transition-colors group">
          <div className="w-12 h-12 rounded-full bg-[#baeaff]/30 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Wind className="w-6 h-6 text-[#0c6780]" />
          </div>
          <p className="text-xs font-bold text-[#717971] uppercase tracking-wider">
            Wind
          </p>
          <p className="text-xl md:text-2xl font-bold text-[#5D4037]">
            {weather.windLabel}
          </p>
          <span className="text-xs font-semibold text-[#5D4037]/60">
            {weather.windSpeed} km/h gusts
          </span>
        </div>

        {/* Card 2: Humidity */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border-2 border-[#efe7d9] flex flex-col items-center justify-center text-center gap-1.5 soft-shadow hover:border-[#FF8C00]/40 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-[#ffdbc9]/40 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Droplets className="w-6 h-6 text-[#FF8C00]" />
          </div>
          <p className="text-xs font-bold text-[#717971] uppercase tracking-wider">
            Humidity
          </p>
          <p className="text-xl md:text-2xl font-bold text-[#5D4037]">
            {weather.humidityLabel}
          </p>
          <span className="text-xs font-semibold text-[#5D4037]/60">
            {weather.humidity}% relative
          </span>
        </div>

        {/* Card 3: UV Index */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border-2 border-[#efe7d9] flex flex-col items-center justify-center text-center gap-1.5 soft-shadow hover:border-[#90BE6D] transition-colors group">
          <div className="w-12 h-12 rounded-full bg-[#bcefc5]/30 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <SunMedium className="w-6 h-6 text-[#b35200]" />
          </div>
          <p className="text-xs font-bold text-[#717971] uppercase tracking-wider">
            UV Index
          </p>
          <p className="text-xl md:text-2xl font-bold text-[#5D4037]">
            {weather.uvLabel}
          </p>
          <span className="text-xs font-semibold text-[#5D4037]/60">
            Index {weather.uvIndex} (Max 9.0)
          </span>
        </div>

        {/* Card 4: Temperature */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border-2 border-[#efe7d9] flex flex-col items-center justify-center text-center gap-1.5 soft-shadow hover:border-[#87CEEB] transition-colors group">
          <div className="w-12 h-12 rounded-full bg-[#baeaff]/30 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Thermometer className="w-6 h-6 text-[#0c6780]" />
          </div>
          <p className="text-xs font-bold text-[#717971] uppercase tracking-wider">
            Temp
          </p>
          <p className="text-xl md:text-2xl font-bold text-[#5D4037]">
            {weather.temp}°C
          </p>
          <span className="text-xs font-semibold text-[#5D4037]/60">
            Feels like {weather.feelsLike}°C
          </span>
        </div>
      </section>

      {/* Hourly Timeline Drawer Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowHourly(!showHourly)}
          className="text-xs font-bold text-[#5D4037] hover:text-[#4A7856] bg-white/80 hover:bg-white px-4 py-2 rounded-full border border-[#efe7d9] shadow-xs flex items-center gap-1.5 transition-all"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{showHourly ? 'Hide Hourly Rain Breakdown' : 'View 12-Hour Rain Barometer'}</span>
          {showHourly ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable 12-Hour Timeline */}
      {showHourly && (
        <div className="bg-white rounded-2xl p-5 border-2 border-[#efe7d9] shadow-sm animate-[fade-in_0.3s_ease-out]">
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-sm font-bold text-[#5D4037] flex items-center gap-1.5">
              <span>Next 12 Hours Precipitation Timeline</span>
            </h4>
            <span className="text-xs text-[#717971] font-medium">Updated every 15 min</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-12 gap-2 overflow-x-auto pb-2">
            {hourlyForecast.map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-between p-2.5 rounded-xl border transition-all text-center min-w-[70px] ${
                  item.time === 'Now'
                    ? 'bg-[#4A7856]/10 border-[#4A7856] text-[#225031] font-bold'
                    : 'bg-[#fbf3e4]/60 border-[#efe7d9] text-[#5D4037]'
                }`}
              >
                <span className="text-xs font-bold">{item.time}</span>
                
                {/* Mini Rain Bar Gauge */}
                <div className="w-3 h-14 bg-[#e9e2d3] rounded-full my-2 relative overflow-hidden flex flex-col justify-end">
                  <div
                    className={`w-full rounded-full transition-all duration-500 ${
                      item.rainChance >= 65
                        ? 'bg-[#FF8C00]'
                        : item.rainChance >= 40
                        ? 'bg-[#87CEEB]'
                        : 'bg-[#90BE6D]'
                    }`}
                    style={{ height: `${item.rainChance}%` }}
                  />
                </div>

                <span className="text-xs font-extrabold">{item.rainChance}%</span>
                <span className="text-[11px] opacity-75">{item.temp}°C</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
