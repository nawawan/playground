import { describe, expect, it } from "vitest";
import { composeTravel, durationMinutes, summarizeTravel } from "./travel";
import type { TrajectoryActivity, TrajectoryPhoto } from "./types";

const photo = (id: string, at: number | null): TrajectoryPhoto => ({
  id,
  activityId: "",
  url: "",
  thumbnailUrl: "",
  distanceM: null,
  lng: null,
  lat: null,
  source: null,
  takenAt: null,
  at,
});

const activity = (id: string, date: string, points: number, photos: TrajectoryPhoto[] = []): TrajectoryActivity => ({
  id,
  title: id,
  subtitle: "",
  type: "bike",
  date,
  km: 1000,
  gain: 100,
  duration: "60",
  note: "",
  color: "red",
  center: [0, 0],
  zoom: 1,
  track: Array.from({ length: points }, (_, i) => [i, 0] as [number, number]),
  elevation: Array.from({ length: points }, (_, i) => i),
  travelId: "t",
  photos,
});

describe("durationMinutes", () => {
  it("reads minutes and the h/m format", () => {
    expect(durationMinutes("307")).toBe(307);
    expect(durationMinutes("6h 12m")).toBe(372);
    expect(durationMinutes("45m")).toBe(45);
    expect(durationMinutes("")).toBe(0);
    expect(durationMinutes("abc")).toBe(0);
  });
});

describe("summarizeTravel", () => {
  it("adds up the activities and finds the period", () => {
    const summary = summarizeTravel([
      activity("b", "2026-05-11T09:00:00", 3),
      activity("a", "2026-05-10T09:00:00", 3),
    ]);
    expect(summary).toMatchObject({
      count: 2,
      distance: 2000,
      gain: 200,
      minutes: 120,
      startDate: "2026-05-10T09:00:00",
      endDate: "2026-05-11T09:00:00",
    });
  });
});

describe("composeTravel", () => {
  const day1 = activity("a", "2026-05-10T09:00:00", 5, [photo("p1", 0.5), photo("p2", null)]);
  const day2 = activity("b", "2026-05-11T09:00:00", 5, [photo("p3", 1)]);
  // Given out of order: the travel reads from its first day.
  const composed = composeTravel({ id: "t", name: "戸隠" }, [day2, day1]);

  it("joins the days in date order", () => {
    expect(composed.title).toBe("戸隠");
    expect(composed.track).toHaveLength(10);
    expect(composed.elevation).toHaveLength(10);
    expect(composed.segments).toEqual([day1.track, day2.track]);
    expect(composed.km).toBe(2000);
    expect(composed.duration).toBe("120");
  });

  it("moves the photos onto the joined chart", () => {
    // Day 1 has indices 0..4, day 2 has 5..9 of a chart whose last index is 9.
    const byId = Object.fromEntries(composed.photos.map((p) => [p.id, p.at]));
    expect(byId.p1).toBeCloseTo(2 / 9, 6);
    expect(byId.p2).toBeNull();
    expect(byId.p3).toBe(1);
  });
});
