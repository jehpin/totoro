import { VerdictConfig, VerdictOutput } from '../types';

export function calculateVerdict(config: VerdictConfig): VerdictOutput {
  const { location, travelMode, singlishLevel } = config;
  const rainChance = location.weather.rainChance;
  const uvIndex = location.weather.uvIndex;
  const temp = location.weather.temp;

  let decision: VerdictOutput['decision'] = 'MUST_BRING';
  let headline = '';
  let subtext = '';
  let badgeColor = 'bg-[#90BE6D] text-[#1e1b13]';
  let borderColor = 'border-[#325f3f]';
  const advice: string[] = [];
  let singlishTip = '';

  if (rainChance >= 70) {
    decision = 'MUST_BRING';
    badgeColor = 'bg-[#90BE6D] text-[#225031]';
    borderColor = 'border-[#325f3f]';

    if (singlishLevel === 'hawker_uncle') {
      headline = "Take it, don't say I never warn!";
      subtext = `${rainChance}% chance pouring down! Sky black like soy sauce already.`;
      singlishTip = "Confirm plus chop will rain. Grab sturdy brolly, otherwise shirt become see-through!";
    } else if (singlishLevel === 'mild') {
      headline = "Must take umbrella, confirm rain soon!";
      subtext = `${rainChance}% rain probability in ${location.name}. Heavy showers incoming.`;
      singlishTip = "Better pack an umbrella or plan your route via sheltered linkways.";
    } else {
      headline = "Rain Highly Likely — Bring an Umbrella";
      subtext = `${rainChance}% precipitation expected in ${location.name}.`;
      singlishTip = "Heavy showers expected. Carry a water-resistant umbrella or waterproof jacket.";
    }

    advice.push(`Thunderstorms predicted within the next 1–2 hours`);
    if (travelMode === 'walk') {
      advice.push(`Walking route has high wet exposure. Stick to MRT sheltered bridges.`);
    } else if (travelMode === 'public_transit') {
      advice.push(`Transfer at sheltered bus interchanges; watch out for slippery tiles.`);
    } else if (travelMode === 'bicycle') {
      advice.push(`Avoid cycling during sudden downpours; road visibility will drop.`);
    }
  } else if (rainChance >= 45) {
    decision = 'BETTER_BRING';
    badgeColor = 'bg-[#baeaff] text-[#004d62]';
    borderColor = 'border-[#0c6780]';

    if (singlishLevel === 'hawker_uncle') {
      headline = "Better bring lah, 50-50 might kenna!";
      subtext = `${rainChance}% chance. Weather unpredictable like Singapore toto!`;
      singlishTip = "Later sudden shower then you stuck at void deck eating cup noodles.";
    } else if (singlishLevel === 'mild') {
      headline = "Safe bet to bring brolly along!";
      subtext = `${rainChance}% passing shower chance in ${location.name}.`;
      singlishTip = "Keep a compact umbrella in your tote bag just in case.";
    } else {
      headline = "Moderate Chance of Rain — Recommended to Carry";
      subtext = `${rainChance}% chance of scattered showers in ${location.name}.`;
      singlishTip = "Keep an umbrella on hand for intermittent afternoon showers.";
    }

    advice.push(`Passing cloud clusters moving inland from the coast`);
    if (uvIndex >= 6) {
      advice.push(`UV index is ${uvIndex} (High). Umbrella doubles as UV shield!`);
    }
  } else if (rainChance >= 25) {
    decision = 'OPTIONAL';
    badgeColor = 'bg-[#ffdbc9] text-[#763400]';
    borderColor = 'border-[#b35200]';

    if (singlishLevel === 'hawker_uncle') {
      headline = "Can bring can don't bring, your choice!";
      subtext = `Only ${rainChance}% rain chance, but UV ${uvIndex} quite hot!`;
      singlishTip = "If lazy carry, wear sun cap or sunglasses also can.";
    } else if (singlishLevel === 'mild') {
      headline = "Low rain risk, but hot like oven!";
      subtext = `${rainChance}% slight drizzle chance, mainly sunny intervals.`;
      singlishTip = "Sun umbrella or hat is useful for the blazing heat.";
    } else {
      headline = "Low Rain Probability — Optional";
      subtext = `${rainChance}% chance of isolated light drizzle in ${location.name}.`;
      singlishTip = "Minimal rain expected, though UV protection is advised.";
    }

    advice.push(`Warm afternoon at ${temp}°C with high sun exposure`);
  } else {
    decision = 'NO_NEED';
    badgeColor = 'bg-[#fff8ef] text-[#5D4037] border border-[#e9e2d3]';
    borderColor = 'border-[#90BE6D]';

    if (singlishLevel === 'hawker_uncle') {
      headline = "Steady pom pi pi! No need umbrella!";
      subtext = `Only ${rainChance}% rain chance. Sun shining bright like diamond!`;
      singlishTip = "Go enjoy your iced teh peng and kopi c! Rain not coming today.";
    } else if (singlishLevel === 'mild') {
      headline = "Clear skies ahead! Leave it at home.";
      subtext = `${rainChance}% rain chance. Enjoy the sunny day.`;
      singlishTip = "Great weather for outdoor strolls and park walks.";
    } else {
      headline = "Fair Weather — No Umbrella Needed";
      subtext = `Clear conditions with only ${rainChance}% precipitation risk.`;
      singlishTip = "Dry skies throughout your trip. Sun protection recommended.";
    }

    advice.push(`Clear conditions across the district`);
  }

  return {
    decision,
    headline,
    subtext,
    badgeColor,
    borderColor,
    advice,
    singlishTip,
  };
}
