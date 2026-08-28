import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { VerdictSection } from './components/VerdictSection';
import { WeatherStatsGrid } from './components/WeatherStatsGrid';
import { ForecastView } from './components/ForecastView';
import { StationsView } from './components/StationsView';
import { SettingsModal } from './components/SettingsModal';
import { BottomNavBar } from './components/BottomNavBar';
import { Footer } from './components/Footer';
import { SINGAPORE_LOCATIONS } from './data/singaporeLocations';
import { SingaporeLocation, SinglishLevel, LiveWeatherData } from './types';
import { rainAudio } from './utils/audioSynth';
import { fetchLiveWeatherData, applyLiveWeatherToLocations } from './services/weatherApi';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'forecast' | 'stations' | 'settings'>('home');
  const [locations, setLocations] = useState<SingaporeLocation[]>(SINGAPORE_LOCATIONS);
  const [currentLocation, setCurrentLocation] = useState<SingaporeLocation>(SINGAPORE_LOCATIONS[0]);
  const [singlishLevel, setSinglishLevel] = useState<SinglishLevel>('hawker_uncle');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [liveData, setLiveData] = useState<LiveWeatherData | null>(null);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);

  // Load live weather data from backend Express proxy to data.gov.sg
  const loadLiveData = useCallback(async () => {
    setIsLoadingLive(true);
    try {
      const data = await fetchLiveWeatherData();
      if (data) {
        setLiveData(data);
        setLocations((prevLocs) => {
          const updated = applyLiveWeatherToLocations(prevLocs, data);
          // Keep current selected location synced with fresh data
          const currentId = currentLocation.id;
          const freshCurrent = updated.find((l) => l.id === currentId);
          if (freshCurrent) {
            setCurrentLocation(freshCurrent);
          }
          return updated;
        });
      }
    } catch (e) {
      console.warn('Error loading live data', e);
    } finally {
      setIsLoadingLive(false);
    }
  }, [currentLocation.id]);

  useEffect(() => {
    loadLiveData();
    // Refresh live weather feed every 90 seconds
    const interval = setInterval(loadLiveData, 90 * 1000);
    return () => clearInterval(interval);
  }, [loadLiveData]);

  // Auto-detect user geolocation and find nearest Singapore district
  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);
    rainAudio.playPop();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingLocation(false);
        const { latitude, longitude } = position.coords;

        // Find closest Singapore location
        let closest = locations[0];
        let minDistance = Infinity;

        locations.forEach((loc) => {
          const d = Math.hypot(loc.lat - latitude, loc.lng - longitude);
          if (d < minDistance) {
            minDistance = d;
            closest = loc;
          }
        });

        setCurrentLocation(closest);
      },
      () => {
        setIsDetectingLocation(false);
        // Fallback gracefully to Orchard / CBD
        setCurrentLocation(locations[0]);
      },
      { timeout: 8000 }
    );
  };

  const handleSelectLocation = (loc: SingaporeLocation) => {
    rainAudio.playPop();
    setCurrentLocation(loc);
  };

  return (
    <div className="font-['Quicksand'] text-[#1e1b13] min-h-screen flex flex-col relative pb-24 md:pb-0 selection:bg-[#90BE6D] selection:text-[#1e1b13]">
      {/* Top App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLocation={currentLocation}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container Content */}
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-10 py-6 md:py-8 flex flex-col gap-10 md:gap-12">
        {activeTab === 'home' && (
          <>
            {/* Greeting & Hero Area */}
            <HeroSection
              currentLocation={currentLocation}
              onSelectLocation={handleSelectLocation}
              onAutoDetect={handleAutoDetectLocation}
              isDetectingLocation={isDetectingLocation}
            />

            {/* Verdict Interaction ("Bring Umbrella or Not?") */}
            <VerdictSection
              currentLocation={currentLocation}
              singlishLevel={singlishLevel}
            />

            {/* 4 Weather Stats Grid (Wind, Humidity, UV Index, Temp) */}
            <WeatherStatsGrid
              weather={currentLocation.weather}
              hourlyForecast={currentLocation.hourlyForecast}
            />
          </>
        )}

        {activeTab === 'forecast' && (
          <ForecastView
            currentLocation={currentLocation}
            onSelectLocation={handleSelectLocation}
            liveData={liveData}
            onRefresh={loadLiveData}
            isLoadingLive={isLoadingLive}
          />
        )}

        {activeTab === 'stations' && (
          <StationsView />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Desktop Footer */}
      <Footer />

      {/* Settings & Singlish Dialect Customizer Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        singlishLevel={singlishLevel}
        setSinglishLevel={setSinglishLevel}
      />
    </div>
  );
}
