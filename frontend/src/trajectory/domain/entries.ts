import { startTimeOf, summarizeTravel, sortByStart, type TravelSummary } from "./travel";
import type { TrajectoryActivity, Travel } from "./types";

// One row of the sidebar: a standalone activity, or a travel with its activities.
export type SidebarEntry =
  | { kind: "activity"; activity: TrajectoryActivity; sortKey: number }
  | {
      kind: "travel";
      travel: Travel;
      // oldest first
      children: TrajectoryActivity[];
      summary: TravelSummary;
      sortKey: number;
    };

export type YearGroup = {
  year: number;
  // newest first, travels and standalone activities mixed
  entries: SidebarEntry[];
  // counted per activity (a travel counts its activities, not itself)
  activityCount: number;
  // meters
  distance: number;
};

// Groups the sidebar by year. A standalone activity sorts by its start time and a
// travel by its first activity; a travel belongs to the year it starts in. A travel
// without activities has no date and is not listed.
export const buildYearGroups = (activities: TrajectoryActivity[], travels: Travel[]): YearGroup[] => {
  const knownTravels = new Map(travels.map((travel) => [travel.id, travel]));
  const childrenOf = new Map<string, TrajectoryActivity[]>();
  const entries: SidebarEntry[] = [];

  for (const activity of activities) {
    const travel = activity.travelId === null ? undefined : knownTravels.get(activity.travelId);
    if (!travel) {
      entries.push({ kind: "activity", activity, sortKey: startTimeOf(activity) });
      continue;
    }
    childrenOf.set(travel.id, [...(childrenOf.get(travel.id) ?? []), activity]);
  }

  for (const [travelId, members] of childrenOf) {
    const children = sortByStart(members);
    entries.push({
      kind: "travel",
      travel: knownTravels.get(travelId) as Travel,
      children,
      summary: summarizeTravel(children),
      sortKey: startTimeOf(children[0]),
    });
  }

  const groups = new Map<number, YearGroup>();
  for (const entry of entries.sort((a, b) => b.sortKey - a.sortKey)) {
    const year = new Date(entry.sortKey).getFullYear();
    const group = groups.get(year) ?? { year, entries: [], activityCount: 0, distance: 0 };
    group.entries.push(entry);
    if (entry.kind === "activity") {
      group.activityCount += 1;
      group.distance += entry.activity.km;
    } else {
      group.activityCount += entry.summary.count;
      group.distance += entry.summary.distance;
    }
    groups.set(year, group);
  }

  return [...groups.values()].sort((a, b) => b.year - a.year);
};
