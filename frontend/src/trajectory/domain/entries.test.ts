import { describe, expect, it } from "vitest";
import { buildYearGroups } from "./entries";
import type { TrajectoryActivity } from "./types";

const activity = (id: string, date: string, travelId: string | null = null, km = 1000): TrajectoryActivity => ({
  id,
  title: id,
  subtitle: "",
  type: "bike",
  date,
  km,
  gain: 0,
  duration: "10",
  note: "",
  color: "red",
  center: [0, 0],
  zoom: 1,
  track: [],
  elevation: [],
  travelId,
  photos: [],
});

const travels = [
  { id: "t1", name: "戸隠" },
  { id: "empty", name: "空" },
];

describe("buildYearGroups", () => {
  const activities = [
    activity("a2026-08", "2026-08-30T08:00:00"),
    activity("a2026-06", "2026-06-06T08:00:00"),
    activity("t1-day2", "2026-05-11T08:00:00", "t1"),
    activity("t1-day1", "2026-05-10T08:00:00", "t1"),
    activity("a2026-04", "2026-04-12T08:00:00"),
    activity("a2025", "2025-12-31T08:00:00"),
  ];
  const groups = buildYearGroups(activities, travels);

  it("groups by year, newest year first", () => {
    expect(groups.map((g) => g.year)).toEqual([2026, 2025]);
  });

  it("mixes travels and standalone activities by date, newest first", () => {
    const labels = groups[0].entries.map((e) => (e.kind === "travel" ? `travel:${e.travel.id}` : e.activity.id));
    expect(labels).toEqual(["a2026-08", "a2026-06", "travel:t1", "a2026-04"]);
  });

  it("lists a travel's activities oldest first", () => {
    const travel = groups[0].entries.find((e) => e.kind === "travel");
    expect(travel?.kind === "travel" && travel.children.map((c) => c.id)).toEqual(["t1-day1", "t1-day2"]);
  });

  it("counts the activities of a travel, not the travel", () => {
    expect(groups[0].activityCount).toBe(5);
    expect(groups[0].distance).toBe(5000);
    expect(groups[1].activityCount).toBe(1);
  });

  it("does not list a travel without activities", () => {
    const all = groups.flatMap((g) => g.entries);
    expect(all.some((e) => e.kind === "travel" && e.travel.id === "empty")).toBe(false);
  });

  it("files a travel under the year it starts in", () => {
    const g = buildYearGroups(
      [activity("d1", "2025-12-31T20:00:00", "t1"), activity("d2", "2026-01-01T08:00:00", "t1")],
      travels,
    );
    expect(g.map((x) => x.year)).toEqual([2025]);
    expect(g[0].activityCount).toBe(2);
  });

  it("shows an activity of an unknown travel as standalone", () => {
    const g = buildYearGroups([activity("x", "2026-01-01T08:00:00", "gone")], travels);
    expect(g[0].entries[0].kind).toBe("activity");
  });

  it("returns nothing for no activities", () => {
    expect(buildYearGroups([], travels)).toEqual([]);
  });
});
