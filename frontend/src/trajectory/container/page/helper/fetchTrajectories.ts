import type { LodTrajectoryResponse } from "../../../../shared/types/trajectory";
import { DETAILED_LOD } from "../../../domain/lod";
import { type Tile, tileKey } from "../../../domain/tile";
import type { LodOverride, LodOverrides } from "../../../domain/types";

const toOverride = (response: LodTrajectoryResponse): LodOverride => ({
  track: response.trajectory.coordinates,
  elevation: response.elevations,
});

// All view: LOD trajectories of the activities intersecting a map tile.
export const fetchTrajectoriesInTile = async (tile: Tile): Promise<LodOverrides> => {
  const query = new URLSearchParams({ lod: String(DETAILED_LOD), tile: tileKey(tile) });
  const res = await fetch(`/api/trajectories?${query}`);
  if (!res.ok) throw new Error(`Failed to fetch trajectories: ${res.status}`);

  const trajectories = (await res.json()) as LodTrajectoryResponse[];
  return Object.fromEntries(trajectories.map((t) => [String(t.activity_id), toOverride(t)]));
};

// Single activity view: the LOD trajectory of one activity, regardless of viewport.
export const fetchActivityTrajectory = async (
  activityId: string,
  signal: AbortSignal,
): Promise<LodOverrides> => {
  const query = new URLSearchParams({ lod: String(DETAILED_LOD) });
  const res = await fetch(`/api/activities/${encodeURIComponent(activityId)}/trajectory?${query}`, { signal });
  if (!res.ok) throw new Error(`Failed to fetch trajectory: ${res.status}`);

  const trajectory = (await res.json()) as LodTrajectoryResponse;
  return { [activityId]: toOverride(trajectory) };
};
