import { Microbe, Site, Trait, Range, ScoringResult } from '../types';

const MICROBE_NAMES_PREFIX = ['Pseudo', 'Cyano', 'Myco', 'Halo', 'Thio', 'Nitro', 'Vibrio', 'Actino'];
const MICROBE_NAMES_SUFFIX = ['bacter', 'coccus', 'monas', 'spirillum', 'bacillus', 'myces', 'plankton'];

export const generateMicrobe = (id: string, bias?: Partial<Microbe>): Microbe => {
  const prefix = MICROBE_NAMES_PREFIX[Math.floor(Math.random() * MICROBE_NAMES_PREFIX.length)];
  const suffix = MICROBE_NAMES_SUFFIX[Math.floor(Math.random() * MICROBE_NAMES_SUFFIX.length)];
  
  const types: ('Bacteria' | 'Fungi' | 'Algae')[] = ['Bacteria', 'Fungi', 'Algae'];
  const traits = [
    Trait.FAST_REPRODUCTION, Trait.TOXIN_RESISTANCE, Trait.HIGH_YIELD, 
    Trait.BIO_LUMINESCENCE, Trait.OXYGEN_DEPLETION, Trait.SLOW_GROWTH, Trait.INVASIVE, Trait.NONE
  ];

  // Weighted random for traits to ensure mix of good/bad
  const randomTrait = Math.random() > 0.3 
    ? traits[Math.floor(Math.random() * 4)] // Good/Neutral
    : traits[Math.floor(Math.random() * 3) + 4]; // Bad

  return {
    id,
    name: `${prefix}${suffix}-${Math.floor(Math.random() * 999)}`,
    type: types[Math.floor(Math.random() * types.length)],
    temp: Math.floor(Math.random() * 10) + 1, // 1-10 Scale
    salinity: Math.floor(Math.random() * 10) + 1, // 1-10 Scale
    ph: Math.floor(Math.random() * 10) + 1, // 1-10 Scale
    trait: randomTrait,
    ...bias
  };
};

export const generateSites = (): Site[] => {
  return [
    {
      id: 1,
      name: "Coastal Estuary (Site 1)",
      description: "A shallow mixing zone. Needs moderate temp and low salinity.",
      requirements: {
        temp: { min: 4, max: 6 },
        salinity: { min: 2, max: 4 },
        ph: { min: 6, max: 8 },
        desirable: [Trait.FAST_REPRODUCTION],
        undesirable: [Trait.OXYGEN_DEPLETION]
      },
      nextSiteClue: "Deep Sea Vent"
    },
    {
      id: 2,
      name: "Deep Sea Vent (Site 2)",
      description: "High pressure environment. Extreme heat and salinity.",
      requirements: {
        temp: { min: 8, max: 10 },
        salinity: { min: 8, max: 10 },
        ph: { min: 3, max: 5 },
        desirable: [Trait.TOXIN_RESISTANCE],
        undesirable: [Trait.SLOW_GROWTH]
      },
      nextSiteClue: "Bleached Coral Reef"
    },
    {
      id: 3,
      name: "Bleached Coral Reef (Site 3)",
      description: "Delicate ecosystem recovering from acidification.",
      requirements: {
        temp: { min: 5, max: 7 },
        salinity: { min: 4, max: 6 },
        ph: { min: 7, max: 9 },
        desirable: [Trait.HIGH_YIELD, Trait.BIO_LUMINESCENCE],
        undesirable: [Trait.INVASIVE]
      },
      nextSiteClue: "Simulation Complete."
    }
  ];
};

export const calculateScore = (selected: Microbe[], site: Site): ScoringResult => {
  if (selected.length === 0) {
    return {
      avgTemp: 0, avgSalinity: 0, avgPh: 0, desirableCount: 0, undesirableCount: 0, score: 0, passed: false, breakdown: []
    }
  }

  const avgTemp = selected.reduce((acc, m) => acc + m.temp, 0) / selected.length;
  const avgSalinity = selected.reduce((acc, m) => acc + m.salinity, 0) / selected.length;
  const avgPh = selected.reduce((acc, m) => acc + m.ph, 0) / selected.length;

  let score = 0;
  const breakdown: string[] = [];

  // 1. Temp (20 pts)
  if (avgTemp >= site.requirements.temp.min && avgTemp <= site.requirements.temp.max) {
    score += 20;
    breakdown.push(`Temperature: ${avgTemp.toFixed(1)} (Target ${site.requirements.temp.min}-${site.requirements.temp.max}) [+20]`);
  } else {
    breakdown.push(`Temperature: ${avgTemp.toFixed(1)} (Target ${site.requirements.temp.min}-${site.requirements.temp.max}) [0]`);
  }

  // 2. Salinity (20 pts)
  if (avgSalinity >= site.requirements.salinity.min && avgSalinity <= site.requirements.salinity.max) {
    score += 20;
    breakdown.push(`Salinity: ${avgSalinity.toFixed(1)} (Target ${site.requirements.salinity.min}-${site.requirements.salinity.max}) [+20]`);
  } else {
    breakdown.push(`Salinity: ${avgSalinity.toFixed(1)} (Target ${site.requirements.salinity.min}-${site.requirements.salinity.max}) [0]`);
  }

  // 3. pH (20 pts)
  if (avgPh >= site.requirements.ph.min && avgPh <= site.requirements.ph.max) {
    score += 20;
    breakdown.push(`pH Level: ${avgPh.toFixed(1)} (Target ${site.requirements.ph.min}-${site.requirements.ph.max}) [+20]`);
  } else {
    breakdown.push(`pH Level: ${avgPh.toFixed(1)} (Target ${site.requirements.ph.min}-${site.requirements.ph.max}) [0]`);
  }

  // 4. Desirable (20 pts)
  const desCount = selected.filter(m => site.requirements.desirable.includes(m.trait)).length;
  if (desCount >= 1) {
    score += 20;
    breakdown.push(`Desirable Trait: Found ${desCount} (+20)`);
  } else {
    breakdown.push("Desirable Trait: None Found (0)");
  }

  // 5. Undesirable (20 pts)
  const undesCount = selected.filter(m => site.requirements.undesirable.includes(m.trait)).length;
  if (undesCount === 0) {
    score += 20;
    breakdown.push("Undesirable Trait: None Present (+20)");
  } else {
    breakdown.push(`Undesirable Trait: Found ${undesCount} (0)`);
  }

  return {
    avgTemp,
    avgSalinity,
    avgPh,
    desirableCount: desCount,
    undesirableCount: undesCount,
    score,
    passed: score >= 60,
    breakdown
  };
};