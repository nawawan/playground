import { describe, expect, it } from "vitest";
import { formatDate, formatDuration, formatGain, formatKm, formatPeriod, formatShortDate, photoLabel } from "./format";
import type { TrajectoryPhoto } from "./types";

describe("format", () => {
  it("formats dates", () => {
    expect(formatDate("2026-08-30T08:00:00")).toBe("2026.08.30");
    expect(formatShortDate("2026-08-30T08:00:00")).toBe("08.30");
    expect(formatDate("not a date")).toBe("not a date");
  });

  it("formats a period", () => {
    expect(formatPeriod("2026-05-10T09:00:00", "2026-05-11T09:00:00")).toBe("05.10–05.11");
    expect(formatPeriod("2026-05-10T09:00:00", "2026-05-10T15:00:00")).toBe("05.10");
  });

  it("formats numbers", () => {
    expect(formatKm(86916)).toBe("86 km");
    expect(formatGain(969.7)).toBe("+969m");
    expect(formatDuration("307")).toBe("307 min");
    expect(formatDuration("6h 12m")).toBe("6h 12m");
  });

  it("labels photos", () => {
    const photo = { distanceM: 25800 } as TrajectoryPhoto;
    expect(photoLabel(photo)).toBe("写真（25.8 km 地点）");
    expect(photoLabel({ distanceM: null } as TrajectoryPhoto)).toBe("写真（位置情報なし）");
  });
});
