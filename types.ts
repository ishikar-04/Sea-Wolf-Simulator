export enum Trait {
  FAST_REPRODUCTION = "Fast Reproduction",
  TOXIN_RESISTANCE = "Toxin Resistance",
  HIGH_YIELD = "High Yield",
  BIO_LUMINESCENCE = "Bio-luminescence", // Neutral/Desirable
  OXYGEN_DEPLETION = "Oxygen Depletion", // Undesirable
  SLOW_GROWTH = "Slow Growth", // Undesirable
  INVASIVE = "Invasive", // Undesirable
  NONE = "None"
}

export interface Microbe {
  id: string;
  name: string;
  temp: number; // 0-100
  salinity: number; // 0-100
  ph: number; // 0-14 mapped to 0-100 scale often, but let's stick to 0-14 for realism or 0-100 for game simplicity. Let's use 0-100 generic units.
  trait: Trait;
  type: 'Bacteria' | 'Fungi' | 'Algae';
}

export interface Range {
  min: number;
  max: number;
}

export interface SiteRequirements {
  temp: Range;
  salinity: Range;
  ph: Range;
  desirable: Trait[];
  undesirable: Trait[];
}

export interface Site {
  id: number;
  name: string;
  description: string;
  requirements: SiteRequirements;
  nextSiteClue: string;
}

export enum GameStage {
  INTRO = 'INTRO',
  TUTORIAL = 'TUTORIAL',
  PROFILING = 'PROFILING',
  CATEGORIZATION = 'CATEGORIZATION', // The Sieve
  PROSPECTING = 'PROSPECTING', // The Choice
  TREATMENT = 'TREATMENT', // Final Selection
  SCORING = 'SCORING',
  GAME_OVER = 'GAME_OVER'
}

export interface ScoringResult {
  avgTemp: number;
  avgSalinity: number;
  avgPh: number;
  desirableCount: number;
  undesirableCount: number;
  score: number;
  passed: boolean;
  breakdown: string[];
}