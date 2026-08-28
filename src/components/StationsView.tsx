import React, { useState } from 'react';
import { Umbrella, MapPin, CheckCircle, AlertCircle, ArrowRight, Shield, QrCode, Search, Navigation } from 'lucide-react';
import { UmbrellaStation } from '../types';
import { UMBRELLA_STATIONS } from '../data/umbrellaStations';
import { rainAudio } from '../utils/audioSynth';

export const StationsView: React.FC = () => {
  const [stations, setStations] = useState<UmbrellaStation[]>(UMBRELLA_STATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBorrowModal, setActiveBorrowModal] = useState<UmbrellaStation | null>(null);
  const [borrowSuccess, setBorrowSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredStations = stations.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mrtStation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.locationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBorrow = (station: UmbrellaStation) => {
    setIsProcessing(true);
    rainAudio.playPop();

    setTimeout(() => {
      setStations((prev) =>
        prev.map((s) =>
          s.id === station.id && s.available > 0
            ? {
                ...s,
                available: s.available - 1,
                returnSlots: s.returnSlots + 1,
                status: s.available - 1 < 5 ? 'low_stock' : 'operational',
              }
            : s
        )
      );
      rainAudio.playUmbrellaOpen();
      setIsProcessing(false);
      setBorrowSuccess(`Umbrella #SG-${Math.floor(1000 + Math.random() * 9000)} unlocked at ${station.name}! Please return within 24 hours at any MRT station hub.`);
    }, 900);
  };

  const handleReturn = (station: UmbrellaStation) => {
    setIsProcessing(true);
    rainAudio.playPop();

    setTimeout(() => {
      setStations((prev) =>
        prev.map((s) =>
          s.id === station.id && s.returnSlots > 0
            ? {
                ...s,
                available: s.available + 1,
                returnSlots: s.returnSlots - 1,
                status: 'operational',
              }
            : s
        )
      );
      rainAudio.playPop();
      setIsProcessing(false);
      setBorrowSuccess(`Umbrella returned successfully at ${station.name}. Thank you for keeping Singapore dry!`);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-8 animate-[fade-in_0.4s_ease-out]">
      {/* Title & Info Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#5D4037]">
            Umbrella SG Sharing Network
          </h2>
          <p className="text-[#5D4037]/80 text-sm md:text-base font-medium">
            Islandwide self-service smart umbrella dispensers along covered linkways & MRT exits
          </p>
        </div>

        <div className="bg-[#bcefc5] text-[#00210d] px-4 py-2 rounded-2xl border border-[#90BE6D] text-xs font-bold flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#325f3f]" />
          <span>Zero Deposit • Free 24h Kampong Share</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search MRT station or covered linkway (e.g. Orchard, Jurong East)..."
            className="w-full bg-white border-2 border-[#efe7d9] rounded-2xl px-5 py-3 pl-11 text-sm font-semibold text-[#1e1b13] focus:outline-none focus:border-[#4A7856] transition-colors"
          />
          <Search className="w-4 h-4 text-[#717971] absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredStations.map((station) => {
          const availPct = Math.round((station.available / station.totalCapacity) * 100);

          return (
            <div
              key={station.id}
              className="bg-white rounded-3xl p-6 border-2 border-[#efe7d9] soft-shadow hover:border-[#87CEEB] transition-all flex flex-col justify-between gap-5"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A7856]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{station.mrtStation}</span>
                    <span className="bg-[#e9e2d3] text-[#5D4037] px-2 py-0.5 rounded-full text-[11px]">
                      {station.exit}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#5D4037] mt-1">
                    {station.name}
                  </h3>
                  <p className="text-xs font-medium text-[#717971]">
                    {station.locationName}
                  </p>
                </div>

                <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  station.status === 'low_stock'
                    ? 'bg-[#ffdad6] text-[#ba1a1a]'
                    : 'bg-[#bcefc5] text-[#00210d]'
                }`}>
                  {station.status === 'low_stock' ? 'Low Stock' : 'Ready'}
                </div>
              </div>

              {/* Live Inventory Meter */}
              <div className="bg-[#fbf3e4] p-4 rounded-2xl flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold text-[#5D4037]">
                  <span>Available Umbrellas: {station.available} / {station.totalCapacity}</span>
                  <span className="text-[#0c6780]">{station.returnSlots} slots open</span>
                </div>

                <div className="w-full h-3 bg-[#e9e2d3] rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-500 ${
                      availPct < 25 ? 'bg-[#FF8C00]' : 'bg-[#4A7856]'
                    }`}
                    style={{ width: `${availPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#717971] font-semibold pt-1">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-[#4A7856]" />
                    {station.shelteredWalkwayDistanceM}m covered walkway to MRT
                  </span>
                  <span>Free NFC Tap</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveBorrowModal(station)}
                  disabled={station.available === 0}
                  className="flex-1 bg-[#4A7856] hover:bg-[#3d6547] disabled:opacity-50 text-white font-bold text-sm py-3 rounded-full bouncy-button border-b-[3px] border-[#225031] flex items-center justify-center gap-1.5 transition-all"
                >
                  <Umbrella className="w-4 h-4" />
                  <span>Borrow (Take Brolly)</span>
                </button>

                <button
                  onClick={() => handleReturn(station)}
                  disabled={station.returnSlots === 0}
                  className="px-4 bg-[#f5edde] hover:bg-[#efe7d9] disabled:opacity-50 text-[#5D4037] font-bold text-sm py-3 rounded-full border border-[#e9e2d3] transition-colors"
                  title="Return umbrella here"
                >
                  Return
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Borrow Modal / Tap to Unlock Simulator */}
      {activeBorrowModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fff8ef] rounded-3xl p-6 md:p-8 max-w-md w-full border-4 border-white shadow-2xl flex flex-col items-center text-center gap-5 animate-[scale-in_0.2s_ease-out]">
            <div className="w-16 h-16 rounded-full bg-[#4A7856]/15 text-[#4A7856] flex items-center justify-center">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#5D4037]">
                Unlock Smart Brolly
              </h3>
              <p className="text-xs font-semibold text-[#5D4037]/75 mt-1">
                {activeBorrowModal.name}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-[#efe7d9] w-full text-left flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-[#717971]">
                <span>Dispenser Slot</span>
                <span className="text-[#4A7856]">Slot #04</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-[#717971]">
                <span>Loan Period</span>
                <span className="text-[#1e1b13]">24 Hours Free</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-[#717971]">
                <span>Windproof Rating</span>
                <span className="text-[#1e1b13]">Reinforced Fiberglass (50 km/h)</span>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setActiveBorrowModal(null)}
                className="flex-1 px-4 py-3 rounded-full font-bold text-sm bg-[#f5edde] hover:bg-[#efe7d9] text-[#5D4037] transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  const target = activeBorrowModal;
                  setActiveBorrowModal(null);
                  handleBorrow(target);
                }}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 rounded-full font-bold text-sm bg-[#4A7856] hover:bg-[#3d6547] text-white bouncy-button border-b-[3px] border-[#225031] transition-all"
              >
                {isProcessing ? 'Dispensing...' : 'Tap to Unlock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {borrowSuccess && (
        <div className="fixed bottom-6 right-6 max-w-md bg-[#bcefc5] text-[#00210d] border-2 border-[#4A7856] p-4 rounded-2xl shadow-xl z-50 flex items-start gap-3 animate-[slide-up_0.3s_ease-out]">
          <CheckCircle className="w-5 h-5 text-[#325f3f] shrink-0 mt-0.5" />
          <div className="flex-1 text-xs font-bold">
            <p>{borrowSuccess}</p>
          </div>
          <button
            onClick={() => setBorrowSuccess(null)}
            className="text-xs font-bold text-[#00210d]/60 hover:text-[#00210d]"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
