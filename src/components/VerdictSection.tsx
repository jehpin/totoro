import React, { useState } from 'react';
import { Umbrella, Footprints, Bus, Car, Bike, Volume2, RefreshCw, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SingaporeLocation, SinglishLevel } from '../types';
import { calculateVerdict } from '../utils/verdictEngine';
import { rainAudio } from '../utils/audioSynth';

interface VerdictSectionProps {
  currentLocation: SingaporeLocation;
  singlishLevel: SinglishLevel;
}

export const VerdictSection: React.FC<VerdictSectionProps> = ({
  currentLocation,
  singlishLevel,
}) => {
  const [hasRevealed, setHasRevealed] = useState(false);
  const [travelMode, setTravelMode] = useState<'walk' | 'public_transit' | 'car' | 'bicycle'>('walk');
  const [tripDuration, setTripDuration] = useState<number>(30);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const verdict = calculateVerdict({
    location: currentLocation,
    travelMode,
    durationMinutes: tripDuration,
    singlishLevel,
  });

  const handleReveal = () => {
    rainAudio.playUmbrellaOpen();
    setHasRevealed(true);
  };

  const handleSpeakVerdict = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${verdict.headline}. ${verdict.subtext}. ${verdict.singlishTip}`);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <section className="bg-[#efe7d9] rounded-3xl p-6 md:p-10 flex flex-col items-center justify-center text-center gap-6 border-2 border-white soft-shadow relative overflow-hidden">
      {/* Background organic shape */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#90BE6D]/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#87CEEB]/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header Title */}
      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#5D4037]">
          Bring Umbrella or Not?
        </h2>
        <p className="text-sm md:text-base text-[#5D4037]/75 mt-1 font-medium">
          Instant verdict based on radar moisture & micro-climate for {currentLocation.name}
        </p>
      </div>

      {/* Trigger Button State vs. Revealed State */}
      {!hasRevealed ? (
        <div className="relative z-10 flex flex-col items-center gap-4 py-2">
          <button
            onClick={handleReveal}
            className="bg-[#4A7856] hover:bg-[#3d6547] text-white text-xl md:text-2xl font-bold px-10 md:px-14 py-4 md:py-5 rounded-full bouncy-button border-b-[5px] border-[#225031] shadow-lg flex items-center gap-3 transition-all cursor-pointer select-none"
          >
            <Umbrella className="w-7 h-7 stroke-[2.5]" />
            <span>Tell Me Fast!</span>
          </button>
          <span className="text-xs text-[#5D4037]/70 font-semibold tracking-wide uppercase">
            One-tap Singapore verdict
          </span>
        </div>
      ) : (
        <div className="w-full max-w-2xl flex flex-col items-center gap-6 relative z-10 animate-[fade-in_0.4s_ease-out]">
          {/* Big Verdict Banner */}
          <div
            className={`w-full ${verdict.badgeColor} px-6 md:px-10 py-6 rounded-2xl border-2 ${verdict.borderColor} shadow-md transform -rotate-1 transition-all duration-300`}
          >
            <div className="flex items-center justify-center gap-2 mb-1.5">
              {verdict.decision === 'MUST_BRING' ? (
                <AlertCircle className="w-6 h-6 text-[#225031]" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-[#0c6780]" />
              )}
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-80">
                Official Recommendation
              </span>
            </div>
            <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              {verdict.headline}
            </h3>
            <p className="text-sm md:text-base font-semibold mt-2 opacity-90 max-w-xl mx-auto">
              {verdict.subtext}
            </p>
          </div>

          {/* Singlish Uncle Tip & Advice Box */}
          <div className="w-full bg-white rounded-2xl p-5 md:p-6 border-2 border-[#e9e2d3] text-left shadow-sm flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-[#4A7856] font-bold text-sm md:text-base">
                <ShieldCheck className="w-5 h-5" />
                <span>Kopitiam Rain Tip</span>
              </div>
              <button
                onClick={handleSpeakVerdict}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#f5edde] hover:bg-[#efe7d9] text-[#5D4037] flex items-center gap-1.5 border border-[#e9e2d3] transition-colors"
                title="Read verdict out loud"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-[#4A7856]' : ''}`} />
                <span>{isSpeaking ? 'Reading...' : 'Listen'}</span>
              </button>
            </div>

            <p className="text-base text-[#1e1b13] font-semibold bg-[#FDF5E6] p-3.5 rounded-xl border border-[#e9e2d3]">
              "{verdict.singlishTip}"
            </p>

            {/* Travel Mode Customizer */}
            <div className="pt-2 border-t border-[#e9e2d3]/70">
              <span className="text-xs font-bold text-[#5D4037]/70 uppercase tracking-wider block mb-2">
                How you getting there?
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    rainAudio.playPop();
                    setTravelMode('walk');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    travelMode === 'walk'
                      ? 'bg-[#4A7856] text-white shadow-xs'
                      : 'bg-[#f5edde] text-[#5D4037] hover:bg-[#efe7d9]'
                  }`}
                >
                  <Footprints className="w-3.5 h-3.5" />
                  <span>Walking</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    rainAudio.playPop();
                    setTravelMode('public_transit');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    travelMode === 'public_transit'
                      ? 'bg-[#4A7856] text-white shadow-xs'
                      : 'bg-[#f5edde] text-[#5D4037] hover:bg-[#efe7d9]'
                  }`}
                >
                  <Bus className="w-3.5 h-3.5" />
                  <span>MRT / Bus</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    rainAudio.playPop();
                    setTravelMode('car');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    travelMode === 'car'
                      ? 'bg-[#4A7856] text-white shadow-xs'
                      : 'bg-[#f5edde] text-[#5D4037] hover:bg-[#efe7d9]'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Grab / Car</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    rainAudio.playPop();
                    setTravelMode('bicycle');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    travelMode === 'bicycle'
                      ? 'bg-[#4A7856] text-white shadow-xs'
                      : 'bg-[#f5edde] text-[#5D4037] hover:bg-[#efe7d9]'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>Cycling</span>
                </button>
              </div>
            </div>

            {/* Travel Specific Advice Points */}
            <ul className="text-xs sm:text-sm text-[#5D4037] space-y-1.5 font-medium list-disc list-inside">
              {verdict.advice.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Re-calculate / Reset button */}
          <button
            onClick={() => setHasRevealed(false)}
            className="text-xs font-bold text-[#5D4037] hover:text-[#4A7856] flex items-center gap-1.5 transition-colors underline underline-offset-4"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check again for another spot</span>
          </button>
        </div>
      )}
    </section>
  );
};
