import { SingaporeLocation, HourlyForecastItem } from '../types';

function generateHourly(baseRain: number, baseTemp: number): HourlyForecastItem[] {
  const currentHour = new Date().getHours();
  const list: HourlyForecastItem[] = [];

  for (let i = 0; i < 12; i++) {
    const hour = (currentHour + i) % 24;
    const timeStr = `${hour % 12 === 0 ? 12 : hour % 12} ${hour >= 12 ? 'PM' : 'AM'}`;
    
    // Simulate typical SG afternoon convective rain peak between 13:00 - 17:00
    let factor = 1;
    if (hour >= 13 && hour <= 17) factor = 1.4;
    if (hour >= 1 && hour <= 6) factor = 0.5;
    
    const rainChance = Math.min(95, Math.max(10, Math.round(baseRain * factor + (Math.sin(i) * 15))));
    const temp = Math.round(baseTemp + (hour >= 11 && hour <= 15 ? 2 : -2) + Math.cos(i));
    
    let condition = 'Partly Cloudy';
    let icon: HourlyForecastItem['icon'] = 'cloud-sun';
    if (rainChance > 70) {
      condition = 'Heavy Thundery Showers';
      icon = 'cloud-lightning';
    } else if (rainChance > 45) {
      condition = 'Passing Showers';
      icon = 'cloud-rain';
    } else if (rainChance > 25) {
      condition = 'Cloudy with Drizzle';
      icon = 'cloud-drizzle';
    } else {
      condition = 'Fair & Warm';
      icon = 'sun';
    }

    list.push({
      time: i === 0 ? 'Now' : timeStr,
      hour,
      rainChance,
      temp,
      condition,
      icon,
    });
  }

  return list;
}

export const SINGAPORE_LOCATIONS: SingaporeLocation[] = [
  {
    id: 'orchard',
    name: 'Orchard / Somerset',
    region: 'Central',
    lat: 1.3048,
    lng: 103.8318,
    isPopular: true,
    weather: {
      temp: 30,
      feelsLike: 34,
      rainChance: 65,
      windSpeed: 14,
      windLabel: 'Kinda breezy',
      humidity: 82,
      humidityLabel: 'Sweat siah',
      uvIndex: 5.4,
      uvLabel: 'Moderate',
      summary: 'Passing thundery showers expected mid-afternoon.',
      singlishSummary: 'Aiyo, later 2pm sure pour one. Better standby brolly!',
      icon: 'cloud-rain',
      rainfallMm: 4.8,
    },
    hourlyForecast: generateHourly(65, 30),
  },
  {
    id: 'marina-bay',
    name: 'Marina Bay / CBD',
    region: 'South',
    lat: 1.2847,
    lng: 103.8587,
    isPopular: true,
    weather: {
      temp: 31,
      feelsLike: 35,
      rainChance: 55,
      windSpeed: 18,
      windLabel: 'Sea breeze strong',
      humidity: 78,
      humidityLabel: 'Humid but bearable',
      uvIndex: 6.2,
      uvLabel: 'High',
      summary: 'Coastal gusts with overcast sky creeping from southern waters.',
      singlishSummary: 'Wind very strong at bayfront, don’t hold flimsy umbrella ah!',
      icon: 'cloud-sun',
      rainfallMm: 2.1,
    },
    hourlyForecast: generateHourly(55, 31),
  },
  {
    id: 'jurong-east',
    name: 'Jurong East / West Coast',
    region: 'West',
    lat: 1.3329,
    lng: 103.7436,
    isPopular: true,
    weather: {
      temp: 29,
      feelsLike: 33,
      rainChance: 85,
      windSpeed: 12,
      windLabel: 'Gentle breeze',
      humidity: 88,
      humidityLabel: 'Very sticky',
      uvIndex: 4.1,
      uvLabel: 'Moderate',
      summary: 'Heavy thunderstorm warning with localized cloudburst.',
      singlishSummary: 'Wah lao! Jurong sky turn black already. Confirm heavy rain!',
      icon: 'cloud-lightning',
      rainfallMm: 14.5,
    },
    hourlyForecast: generateHourly(85, 29),
  },
  {
    id: 'tampines',
    name: 'Tampines / Pasir Ris',
    region: 'East',
    lat: 1.3532,
    lng: 103.9452,
    isPopular: true,
    weather: {
      temp: 30,
      feelsLike: 33,
      rainChance: 40,
      windSpeed: 15,
      windLabel: 'Breezy east coast',
      humidity: 79,
      humidityLabel: 'Normal warm',
      uvIndex: 5.8,
      uvLabel: 'Moderate',
      summary: 'Scattered light showers intermittent between sunny intervals.',
      singlishSummary: 'East side best side, only small small drizzle passing through.',
      icon: 'cloud-drizzle',
      rainfallMm: 1.2,
    },
    hourlyForecast: generateHourly(40, 30),
  },
  {
    id: 'woodlands',
    name: 'Woodlands / Marsiling',
    region: 'North',
    lat: 1.4382,
    lng: 103.7891,
    isPopular: true,
    weather: {
      temp: 28,
      feelsLike: 32,
      rainChance: 75,
      windSpeed: 16,
      windLabel: 'Cool squall wind',
      humidity: 86,
      humidityLabel: 'Very humid',
      uvIndex: 3.8,
      uvLabel: 'Low',
      summary: 'Moderate to heavy rain developing over the Causeway corridor.',
      singlishSummary: 'Sumatran squall coming in from Johor, take umbrella fast fast!',
      icon: 'cloud-rain',
      rainfallMm: 8.4,
    },
    hourlyForecast: generateHourly(75, 28),
  },
  {
    id: 'ang-mo-kio',
    name: 'Ang Mo Kio / Bishan',
    region: 'Central',
    lat: 1.3691,
    lng: 103.8454,
    isPopular: true,
    weather: {
      temp: 30,
      feelsLike: 34,
      rainChance: 60,
      windSpeed: 13,
      windLabel: 'Steady breeze',
      humidity: 83,
      humidityLabel: 'Sweat siah',
      uvIndex: 5.1,
      uvLabel: 'Moderate',
      summary: 'Cloudy skies with brief localized showers near Bishan Park.',
      singlishSummary: 'Can walk under sheltered linkway first, but standby your brolly.',
      icon: 'cloud-rain',
      rainfallMm: 3.5,
    },
    hourlyForecast: generateHourly(60, 30),
  },
  {
    id: 'punggol',
    name: 'Punggol / Sengkang',
    region: 'North',
    lat: 1.4054,
    lng: 103.9023,
    isPopular: true,
    weather: {
      temp: 29,
      feelsLike: 33,
      rainChance: 70,
      windSpeed: 17,
      windLabel: 'Waterway breeze',
      humidity: 85,
      humidityLabel: 'High moisture',
      uvIndex: 4.5,
      uvLabel: 'Moderate',
      summary: 'Overcast with water-cooling effect and afternoon showers.',
      singlishSummary: 'Punggol Waterway side got dark clouds, tap umbrella station nearby lah.',
      icon: 'cloud-rain',
      rainfallMm: 6.2,
    },
    hourlyForecast: generateHourly(70, 29),
  },
  {
    id: 'sentosa',
    name: 'Sentosa / HarbourFront',
    region: 'South',
    lat: 1.2494,
    lng: 103.8303,
    isPopular: true,
    weather: {
      temp: 32,
      feelsLike: 36,
      rainChance: 30,
      windSpeed: 20,
      windLabel: 'Chilly island breeze',
      humidity: 74,
      humidityLabel: 'Island tropical',
      uvIndex: 7.8,
      uvLabel: 'Very High',
      summary: 'Mostly sunny with clear skies and strong UV radiation.',
      singlishSummary: 'So hot until can fry egg! Sunscreen and sun umbrella must have!',
      icon: 'sun',
      rainfallMm: 0.0,
    },
    hourlyForecast: generateHourly(30, 32),
  },
  {
    id: 'clementi',
    name: 'Clementi / Dover / Buona Vista',
    region: 'West',
    lat: 1.3162,
    lng: 103.7649,
    weather: {
      temp: 29,
      feelsLike: 33,
      rainChance: 78,
      windSpeed: 14,
      windLabel: 'Breezy gust',
      humidity: 87,
      humidityLabel: 'Sweat siah',
      uvIndex: 4.2,
      uvLabel: 'Moderate',
      summary: 'Thundery showers building up over western educational hub.',
      singlishSummary: 'Students running for shelter already. Grab an umbrella bro!',
      icon: 'cloud-lightning',
      rainfallMm: 9.8,
    },
    hourlyForecast: generateHourly(78, 29),
  },
  {
    id: 'bugis',
    name: 'Bugis / Kampong Glam',
    region: 'Central',
    lat: 1.3006,
    lng: 103.8558,
    weather: {
      temp: 31,
      feelsLike: 35,
      rainChance: 58,
      windSpeed: 12,
      windLabel: 'Urban breeze',
      humidity: 80,
      humidityLabel: 'Warm & humid',
      uvIndex: 5.5,
      uvLabel: 'Moderate',
      summary: 'Passing cloud cover with light drizzle expected.',
      singlishSummary: 'Haji Lane cafes all pulling down awnings, get ready!',
      icon: 'cloud-drizzle',
      rainfallMm: 2.4,
    },
    hourlyForecast: generateHourly(58, 31),
  },
  {
    id: 'changi',
    name: 'Changi Airport / Jewel',
    region: 'East',
    lat: 1.3644,
    lng: 103.9915,
    weather: {
      temp: 30,
      feelsLike: 33,
      rainChance: 35,
      windSpeed: 22,
      windLabel: 'Coastal runway wind',
      humidity: 76,
      humidityLabel: 'Moderate',
      uvIndex: 6.0,
      uvLabel: 'High',
      summary: 'Mainly fair with coastal turbulence and high cloud deck.',
      singlishSummary: 'Only rain vortex inside Jewel waterfall! Outside safe lah.',
      icon: 'cloud-sun',
      rainfallMm: 0.5,
    },
    hourlyForecast: generateHourly(35, 30),
  },
];
