import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThinningPreview } from "./ThinningPreview";
import { MapArea } from "../map_area/MapArea";
import { TrajectoryHeight } from "../trajectory_height/TrajectoryHeight";
import { trajectoryActivities } from "../../../domain/mockData";
import { fixtureTracks } from "../../../domain/rawTrack";
import { deviationStats, lodEpsilon, maxTurnAngle, thinTrajectory } from "../../../domain/simplify";
import { generateSyntheticTrack, type SyntheticPreset } from "../../../domain/syntheticTrack";
import type { TrajectoryActivity } from "../../../domain/types";

type PreviewArgs = {
  source: string;
  lod: "raw" | "1" | "2" | "3" | "4" | "custom";
  customEpsilon: number;
  showRaw: boolean;
  showCheckpoints: boolean;
  mapStyle: "terrain" | "streets";
  // synthetic-only
  syntheticPoints: number;
  syntheticStepMeters: number;
  syntheticNoiseMeters: number;
  syntheticSeed: number;
};

const SYNTHETIC_SOURCES: SyntheticPreset[] = ["winding-pass", "hairpins", "straight-noisy"];
const sourceOptions = [...SYNTHETIC_SOURCES.map((p) => `synthetic:${p}`), ...Object.keys(fixtureTracks)];

const base = trajectoryActivities[0];

const jsonBytes = (track: unknown, elevation: number[]) => JSON.stringify({ track, elevation }).length;

const PreviewStory = (args: PreviewArgs) => {
  const raw = useMemo(() => {
    if (args.source.startsWith("synthetic:")) {
      return generateSyntheticTrack({
        preset: args.source.replace("synthetic:", "") as SyntheticPreset,
        points: args.syntheticPoints,
        stepMeters: args.syntheticStepMeters,
        noiseMeters: args.syntheticNoiseMeters,
        seed: args.syntheticSeed,
        origin: base.center,
      });
    }
    return fixtureTracks[args.source] ?? { track: base.track, elevation: base.elevation };
  }, [args.source, args.syntheticPoints, args.syntheticStepMeters, args.syntheticNoiseMeters, args.syntheticSeed]);

  const epsilon = args.lod === "raw" ? 0 : args.lod === "custom" ? args.customEpsilon : lodEpsilon(Number(args.lod));

  const thinned = useMemo(() => thinTrajectory(raw.track, raw.elevation, epsilon), [raw, epsilon]);
  // "raw" shows the untouched track rather than a zero-epsilon thinning.
  const shownTrack = args.lod === "raw" ? raw.track : thinned.track;
  const shownElevation = args.lod === "raw" ? raw.elevation : thinned.elevation;

  const stats = useMemo(() => {
    const indices = args.lod === "raw" ? raw.track.map((_, i) => i) : thinned.indices;
    const deviation = deviationStats(raw.track, indices);
    return {
      rawPoints: raw.track.length,
      thinnedPoints: shownTrack.length,
      epsilon,
      maxDeviationMeters: deviation.maxMeters,
      meanDeviationMeters: deviation.meanMeters,
      maxTurnAngleDeg: maxTurnAngle(shownTrack),
      rawBytes: jsonBytes(raw.track, raw.elevation),
      thinnedBytes: jsonBytes(shownTrack, shownElevation),
    };
  }, [args.lod, raw, thinned, shownTrack, shownElevation, epsilon]);

  // Id depends on the data source only, so the map re-fits when the source changes but not when the level does.
  const activity: TrajectoryActivity = {
    ...base,
    id: `thinning-${args.source}-${raw.track.length}`,
    track: shownTrack,
    elevation: shownElevation,
    photos: [],
    center: raw.track[0] ?? base.center,
  };

  const [here, setHere] = useState(0.5);

  return (
    <ThinningPreview
      stats={stats}
      map={
        <MapArea
          activePhotoId={null}
          activity={activity}
          here={here}
          mapStyle={args.mapStyle}
          onPhotoSelect={() => undefined}
          referenceTrack={args.showRaw && args.lod !== "raw" ? raw.track : undefined}
          showCheckpoints={args.showCheckpoints}
        />
      }
      height={
        <TrajectoryHeight
          activePhotoId={null}
          activity={activity}
          here={here}
          onHereChange={setHere}
          onPhotoSelect={() => undefined}
        />
      }
    />
  );
};

const meta = {
  title: "Trajectory/Tools/ThinningPreview",
  component: PreviewStory,
  parameters: { layout: "fullscreen" },
  args: {
    source: sourceOptions[0],
    lod: "1",
    customEpsilon: 50,
    showRaw: true,
    showCheckpoints: true,
    mapStyle: "terrain",
    syntheticPoints: 3000,
    syntheticStepMeters: 6,
    syntheticNoiseMeters: 1.5,
    syntheticSeed: 1,
  },
  argTypes: {
    source: { control: "select", options: sourceOptions, description: "synthetic:* or a file in domain/fixtures/" },
    lod: {
      control: "inline-radio",
      options: ["raw", "1", "2", "3", "4", "custom"],
      description: "backend LOD (1=500m, 2=100m, 3=20m, 4=1m)",
    },
    customEpsilon: { control: { type: "range", min: 0.5, max: 1000, step: 0.5 }, if: { arg: "lod", eq: "custom" } },
    syntheticPoints: { control: { type: "range", min: 200, max: 20000, step: 100 } },
    syntheticStepMeters: { control: { type: "range", min: 1, max: 30, step: 1 } },
    syntheticNoiseMeters: { control: { type: "range", min: 0, max: 10, step: 0.5 } },
    syntheticSeed: { control: { type: "number" } },
    mapStyle: { control: "inline-radio", options: ["terrain", "streets"] },
  },
} satisfies Meta<typeof PreviewStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// Fixed levels, for quick screenshot comparison.
export const Lod3: Story = { args: { lod: "3" } };
export const Lod1Hairpins: Story = { args: { source: "synthetic:hairpins", lod: "1" } };
