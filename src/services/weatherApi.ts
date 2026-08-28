import { LiveWeatherData, SingaporeLocation, RainfallSensor, FourDayOutlookItem, LiveAirQuality } from '../types';

export async function fetchLiveWeatherData(): Promise<LiveWeatherData | null> {
  try {
    const res = await fetch('/api/weather/live');
    if (!res.ok) {
      console.warn('Backend live weather API returned status', res.status);
      return null;
    }
    const json = await res.json();
    if (!json.success || !json.data) return null;

    const data = json.data;

    // 1. Parse Air Quality (PSI, PM2.5, UV)
    const airQuality: LiveAirQuality = {
      psi: {
        overall: 48,
        north: 45,
        south: 50,
        east: 47,
        west: 52,
        central: 46,
        status: 'Good (Normal)',
      },
      pm25: {
        overall: 12,
        north: 10,
        south: 14,
        east: 11,
        west: 15,
        central: 12,
        status: 'Good',
      },
      uv: {
        index: 6,
        status: 'Moderate',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    };

    // Parse PSI
    try {
      const psiItems = data.psi?.data?.items || data.psi?.items;
      if (psiItems && psiItems.length > 0) {
        const latest = psiItems[psiItems.length - 1];
        const psiReadings = latest?.readings?.psi_twenty_four_hourly || latest?.readings?.psi;
        if (psiReadings) {
          airQuality.psi.overall = psiReadings.national || psiReadings.central || 48;
          airQuality.psi.north = psiReadings.north || airQuality.psi.overall;
          airQuality.psi.south = psiReadings.south || airQuality.psi.overall;
          airQuality.psi.east = psiReadings.east || airQuality.psi.overall;
          airQuality.psi.west = psiReadings.west || airQuality.psi.overall;
          airQuality.psi.central = psiReadings.central || airQuality.psi.overall;
          
          if (airQuality.psi.overall <= 50) airQuality.psi.status = 'Good';
          else if (airQuality.psi.overall <= 100) airQuality.psi.status = 'Moderate';
          else airQuality.psi.status = 'Unhealthy';
        }
      }
    } catch (e) {
      console.warn('Error parsing live PSI', e);
    }

    // Parse PM2.5
    try {
      const pm25Items = data.pm25?.data?.items || data.pm25?.items;
      if (pm25Items && pm25Items.length > 0) {
        const latest = pm25Items[pm25Items.length - 1];
        const pmReadings = latest?.readings?.pm25_one_hourly || latest?.readings?.pm25;
        if (pmReadings) {
          airQuality.pm25.overall = pmReadings.national || pmReadings.central || 12;
          airQuality.pm25.north = pmReadings.north || airQuality.pm25.overall;
          airQuality.pm25.south = pmReadings.south || airQuality.pm25.overall;
          airQuality.pm25.east = pmReadings.east || airQuality.pm25.overall;
          airQuality.pm25.west = pmReadings.west || airQuality.pm25.overall;
          airQuality.pm25.central = pmReadings.central || airQuality.pm25.overall;

          if (airQuality.pm25.overall <= 12) airQuality.pm25.status = 'Normal';
          else if (airQuality.pm25.overall <= 55) airQuality.pm25.status = 'Elevated';
          else airQuality.pm25.status = 'High';
        }
      }
    } catch (e) {
      console.warn('Error parsing live PM2.5', e);
    }

    // Parse UV Index
    try {
      const uvRecords = data.uv?.data?.records || data.uv?.records;
      if (uvRecords && uvRecords.length > 0) {
        const latestRecord = uvRecords[uvRecords.length - 1];
        const indexList = latestRecord?.index || [];
        if (indexList.length > 0) {
          const latestUV = indexList[indexList.length - 1];
          airQuality.uv.index = latestUV.value ?? 6;
          airQuality.uv.timestamp = latestUV.timestamp
            ? new Date(latestUV.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : airQuality.uv.timestamp;

          if (airQuality.uv.index <= 2) airQuality.uv.status = 'Low';
          else if (airQuality.uv.index <= 5) airQuality.uv.status = 'Moderate';
          else if (airQuality.uv.index <= 7) airQuality.uv.status = 'High';
          else if (airQuality.uv.index <= 10) airQuality.uv.status = 'Very High';
          else airQuality.uv.status = 'Extreme';
        }
      }
    } catch (e) {
      console.warn('Error parsing live UV', e);
    }

    // 2. Parse Rainfall Station Sensors
    const rainfallSensors: RainfallSensor[] = [];
    try {
      const rainfallData = data.rainfall?.data || data.rainfall;
      const stations = rainfallData?.stations || [];
      const readings = rainfallData?.readings?.[0]?.data || [];
      const readingMap = new Map<string, number>();

      for (const r of readings) {
        readingMap.set(r.stationId, r.value ?? 0);
      }

      for (const s of stations) {
        const val = readingMap.get(s.id) ?? 0;
        rainfallSensors.push({
          id: s.id,
          stationId: s.id,
          name: s.name || s.id,
          lat: s.location?.latitude ?? 1.3521,
          lng: s.location?.longitude ?? 103.8198,
          value: val,
        });
      }
    } catch (e) {
      console.warn('Error parsing rainfall sensors', e);
    }

    // 3. Parse 4-Day Outlook
    const fourDayOutlook: FourDayOutlookItem[] = [];
    try {
      const fourDayRecords = data.fourDay?.data?.records || data.fourDay?.records;
      if (fourDayRecords && fourDayRecords.length > 0) {
        const forecasts = fourDayRecords[0]?.forecasts || [];
        for (const item of forecasts) {
          fourDayOutlook.push({
            day: item.day || 'Upcoming',
            date: item.date || '',
            forecast: item.forecast?.text || (typeof item.forecast === 'string' ? item.forecast : 'Passing Showers'),
            tempLow: item.temperature?.low ?? 25,
            tempHigh: item.temperature?.high ?? 32,
            humidityLow: item.relative_humidity?.low ?? 65,
            humidityHigh: item.relative_humidity?.high ?? 95,
            windSpeed: `${item.wind?.speed?.low ?? 10} - ${item.wind?.speed?.high ?? 20} km/h`,
          });
        }
      }
    } catch (e) {
      console.warn('Error parsing 4-day outlook', e);
    }

    // 4. Parse 24-hr Forecast General & Regional
    let twentyFourHrGeneral = 'Partly cloudy with afternoon thundery showers in places.';
    const regionForecasts: Record<string, { forecast: string; tempLow: number; tempHigh: number }> = {};

    try {
      const twentyFourRecords = data.twentyFourHr?.data?.records || data.twentyFourHr?.records;
      if (twentyFourRecords && twentyFourRecords.length > 0) {
        const gen = twentyFourRecords[0]?.general;
        if (gen?.forecast?.text) {
          twentyFourHrGeneral = gen.forecast.text;
        }

        const regions = twentyFourRecords[0]?.regions;
        if (regions) {
          for (const reg of ['north', 'south', 'east', 'west', 'central']) {
            const rData = regions[reg];
            regionForecasts[reg] = {
              forecast: rData?.text || 'Passing Showers',
              tempLow: gen?.temperature?.low ?? 24,
              tempHigh: gen?.temperature?.high ?? 32,
            };
          }
        }
      }
    } catch (e) {
      console.warn('Error parsing 24-hr forecast', e);
    }

    return {
      twentyFourHrGeneral,
      regionForecasts,
      airQuality,
      rainfallSensors,
      fourDayOutlook,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isLive: true,
    };
  } catch (err) {
    console.error('Failed to connect to backend weather API', err);
    return null;
  }
}

/**
 * Merges live backend data into local Singapore locations for accurate regional displays
 */
export function applyLiveWeatherToLocations(
  locations: SingaporeLocation[],
  liveData: LiveWeatherData
): SingaporeLocation[] {
  return locations.map((loc) => {
    const regKey = loc.region.toLowerCase();
    const regForecast = liveData.regionForecasts?.[regKey];

    // Find nearest rainfall sensor to this location
    let nearbyRainMm = 0;
    if (liveData.rainfallSensors.length > 0) {
      let closestDist = Infinity;
      for (const sensor of liveData.rainfallSensors) {
        const dist = Math.hypot(sensor.lat - loc.lat, sensor.lng - loc.lng);
        if (dist < closestDist) {
          closestDist = dist;
          nearbyRainMm = sensor.value;
        }
      }
    }

    const rainChance = nearbyRainMm > 0 ? Math.min(95, 60 + nearbyRainMm * 10) : regForecast?.forecast.toLowerCase().includes('shower') || regForecast?.forecast.toLowerCase().includes('rain') ? 70 : 25;

    let icon: 'sun' | 'cloud-sun' | 'cloud-rain' | 'cloud-lightning' | 'cloud-drizzle' = 'cloud-sun';
    const desc = regForecast?.forecast.toLowerCase() || loc.weather.summary.toLowerCase();
    if (desc.includes('thunder') || desc.includes('lightning')) icon = 'cloud-lightning';
    else if (desc.includes('heavy') || desc.includes('rain')) icon = 'cloud-rain';
    else if (desc.includes('shower') || desc.includes('drizzle')) icon = 'cloud-drizzle';
    else if (desc.includes('fair') || desc.includes('sunny')) icon = 'sun';

    return {
      ...loc,
      weather: {
        ...loc.weather,
        temp: regForecast ? Math.round((regForecast.tempLow + regForecast.tempHigh) / 2) : loc.weather.temp,
        rainChance,
        rainfallMm: Number(nearbyRainMm.toFixed(1)),
        summary: regForecast?.forecast || loc.weather.summary,
        icon,
        uvIndex: liveData.airQuality.uv.index,
        uvLabel: liveData.airQuality.uv.status,
      },
    };
  });
}
