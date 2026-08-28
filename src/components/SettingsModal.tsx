import React from 'react';
import { X, Volume2, Sparkles, MessageSquare, Bell, Info } from 'lucide-react';
import { SinglishLevel } from '../types';
import { rainAudio } from '../utils/audioSynth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  singlishLevel: SinglishLevel;
  setSinglishLevel: (level: SinglishLevel) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  singlishLevel,
  setSinglishLevel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#fff8ef] rounded-3xl p-6 md:p-8 max-w-lg w-full border-4 border-white shadow-2xl flex flex-col gap-6 animate-[scale-in_0.2s_ease-out] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-[#5D4037]">
              Settings & Lah-out
            </h3>
            <p className="text-xs font-semibold text-[#5D4037]/75">
              Personalize your Umbrella SG experience
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#e9e2d3] text-[#5D4037] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Singlish Dialect Level */}
        <div className="bg-white p-5 rounded-2xl border-2 border-[#efe7d9] flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#4A7856]">
            <MessageSquare className="w-4 h-4" />
            <span>Singlish Tone Intensity</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                rainAudio.playPop();
                setSinglishLevel('standard');
              }}
              className={`p-3 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                singlishLevel === 'standard'
                  ? 'bg-[#4A7856] text-white shadow-xs'
                  : 'bg-[#f5edde] text-[#5D4037] hover:bg-[#efe7d9]'
              }`}
            >
              <span>Standard</span>
              <span className="text-[10px] opacity-75">Formal</span>
            </button>

            <button
              onClick={() => {
                rainAudio.playPop();
                setSinglishLevel('mild');
              }}
              className={`p-3 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                singlishLevel === 'mild'
                  ? 'bg-[#4A7856] text-white shadow-xs'
                  : 'bg-[#f5edde] text-[#5D4037] hover:bg-[#efe7d9]'
              }`}
            >
              <span>Steady Lah</span>
              <span className="text-[10px] opacity-75">Mild</span>
            </button>

            <button
              onClick={() => {
                rainAudio.playPop();
                setSinglishLevel('hawker_uncle');
              }}
              className={`p-3 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                singlishLevel === 'hawker_uncle'
                  ? 'bg-[#4A7856] text-white shadow-xs'
                  : 'bg-[#f5edde] text-[#5D4037] hover:bg-[#efe7d9]'
              }`}
            >
              <span>Hawker Uncle</span>
              <span className="text-[10px] opacity-75">Full Singlish</span>
            </button>
          </div>
        </div>

        {/* Rain Ambience Sound Controls */}
        <div className="bg-white p-5 rounded-2xl border-2 border-[#efe7d9] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0c6780]">
              <Volume2 className="w-4 h-4" />
              <span>Ghibli Rain Ambience Synthesizer</span>
            </div>
          </div>
          <p className="text-xs text-[#5D4037]/80 font-medium">
            Procedurally synthesized rain noise with lowpass foliage filters. No audio files or data usage.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => rainAudio.startRain(0.25)}
              className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#f5edde] hover:bg-[#efe7d9] text-[#5D4037] transition-colors"
            >
              Gentle Leaf Drizzle
            </button>
            <button
              onClick={() => rainAudio.startRain(0.6)}
              className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#f5edde] hover:bg-[#efe7d9] text-[#5D4037] transition-colors"
            >
              Tropical Downpour
            </button>
            <button
              onClick={() => rainAudio.stopRain()}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab] transition-colors"
            >
              Mute
            </button>
          </div>
        </div>

        {/* Singapore Rain Facts */}
        <div className="bg-[#fbf3e4] p-4 rounded-2xl border border-[#e9e2d3] flex items-start gap-3">
          <Info className="w-5 h-5 text-[#4A7856] shrink-0 mt-0.5" />
          <div className="text-xs text-[#5D4037] space-y-1 font-medium">
            <p className="font-bold text-[#4A7856]">Did you know?</p>
            <p>
              Singapore averages 167 thunderstorm days a year, making it one of the highest lightning density zones in the world! That's why covered linkways cover over 200 km of MRT walkways.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#4A7856] text-white font-bold text-sm py-3.5 rounded-full bouncy-button border-b-[3px] border-[#225031] transition-all"
        >
          Confirm & Save Settings
        </button>
      </div>
    </div>
  );
};
