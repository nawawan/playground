import type { LngLat } from "./types";

export type SyntheticPreset = "winding-pass" | "hairpins" | "straight-noisy";

export type SyntheticOptions = {
  preset: SyntheticPreset;
  points: number;
  stepMeters: number;
  noiseMeters: number;
  seed: number;
  origin: LngLat;
};

// mulberry32: deterministic so a story renders the same track every time.
const createRandom = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const gaussian = (random: () => number) =>
  Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());

const METERS_PER_DEG_LAT = 111320;

// Heading change (rad per step) for each preset.
const turnRate = (preset: SyntheticPreset, i: number, random: () => number, state: { drift: number }) => {
  state.drift = state.drift * 0.97 + gaussian(random) * 0.01;
  switch (preset) {
    case "hairpins": {
      // switchbacks: long gentle stretches, then ~180deg reversals
      const phase = (i % 400) / 400;
      const hairpin = phase > 0.46 && phase < 0.54 ? Math.PI / (0.08 * 400) * (Math.floor(i / 400) % 2 === 0 ? 1 : -1) : 0;
      return state.drift * 0.4 + hairpin;
    }
    case "straight-noisy":
      return state.drift * 0.08;
    default:
      return state.drift + 0.012 * Math.sin(i / 90);
  }
};

export const generateSyntheticTrack = (options: SyntheticOptions): { track: LngLat[]; elevation: number[] } => {
  const { preset, points, stepMeters, noiseMeters, seed, origin } = options;
  const random = createRandom(seed);
  const metersPerDegLng = METERS_PER_DEG_LAT * Math.cos((origin[1] * Math.PI) / 180);

  const state = { drift: 0 };
  let heading = 0.6;
  let x = 0;
  let y = 0;
  const track: LngLat[] = [];
  const elevation: number[] = [];

  for (let i = 0; i < points; i++) {
    heading += turnRate(preset, i, random, state);
    x += Math.cos(heading) * stepMeters;
    y += Math.sin(heading) * stepMeters;
    // GPS jitter is applied to the recorded position only, not the underlying path.
    const nx = x + gaussian(random) * noiseMeters;
    const ny = y + gaussian(random) * noiseMeters;
    track.push([origin[0] + nx / metersPerDegLng, origin[1] + ny / METERS_PER_DEG_LAT]);

    const t = points > 1 ? i / (points - 1) : 0;
    elevation.push(
      900 + 700 * Math.sin(Math.PI * t) + 60 * Math.sin(t * 40) + gaussian(random) * 1.5,
    );
  }

  return { track, elevation };
};
