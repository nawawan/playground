import { describe, expect, it } from "vitest";
import { atFromDistance, cumulativeDistances, distanceFromAt, withPhotos } from "./photoPosition";
import type { LngLat, TrajectoryActivity, TrajectoryPhoto } from "./types";

// Heading east along the equator; 0.01 degrees is about 1113 m.
// Point spacing is uneven on purpose: the chart is indexed by vertex, not distance.
const track: LngLat[] = [
  [0, 0],
  [0.01, 0],
  [0.03, 0],
  [0.04, 0],
];

describe("cumulativeDistances", () => {
  it("scales the distances to the activity distance", () => {
    const cumulative = cumulativeDistances(track, 4000);
    expect(cumulative[0]).toBe(0);
    expect(cumulative[1]).toBeCloseTo(1000, 6);
    expect(cumulative[2]).toBeCloseTo(3000, 6);
    expect(cumulative[3]).toBeCloseTo(4000, 6);
  });

  it("keeps the raw distance when the total is unknown", () => {
    expect(cumulativeDistances(track, 0)[1]).toBeCloseTo(1113, -1);
  });
});

describe("atFromDistance", () => {
  it("maps a distance onto the vertex-indexed chart", () => {
    // 2000 m is halfway between vertex 1 (1000 m) and vertex 2 (3000 m).
    expect(atFromDistance(track, 4000, 2000)).toBeCloseTo(1.5 / 3, 6);
    expect(atFromDistance(track, 4000, 1000)).toBeCloseTo(1 / 3, 6);
  });

  it("clamps to the ends of the track", () => {
    expect(atFromDistance(track, 4000, -50)).toBe(0);
    expect(atFromDistance(track, 4000, 9999)).toBe(1);
  });

  it("needs a track", () => {
    expect(atFromDistance([[0, 0]], 100, 50)).toBe(0);
  });

  it("is the inverse of distanceFromAt", () => {
    for (const at of [0, 0.2, 0.5, 0.77, 1]) {
      const distance = distanceFromAt(track, 4000, at);
      expect(atFromDistance(track, 4000, distance)).toBeCloseTo(at, 6);
    }
  });
});

describe("withPhotos", () => {
  const photo = (id: string, activityId: string, distanceM: number | null): TrajectoryPhoto => ({
    id,
    activityId,
    url: "",
    thumbnailUrl: "",
    distanceM,
    lng: null,
    lat: null,
    source: null,
    takenAt: null,
    at: null,
  });
  const activity = { id: "10", km: 4000, track } as TrajectoryActivity;

  it("keeps only the photos of the activity and resolves their position", () => {
    const result = withPhotos(activity, [photo("a", "10", 1000), photo("b", "11", 1000), photo("c", "10", null)]);
    expect(result.photos.map((p) => p.id)).toEqual(["a", "c"]);
    expect(result.photos[0].at).toBeCloseTo(1 / 3, 6);
    expect(result.photos[1].at).toBeNull();
  });
});
