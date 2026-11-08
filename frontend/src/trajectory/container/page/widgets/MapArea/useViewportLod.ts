import * as Sentry from "@sentry/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { isDetailedZoom, LOD_TILE_ZOOM } from "../../../../domain/lod";
import { tileKey, tilesCovering } from "../../../../domain/tile";
import type { LodOverrides, MapViewport } from "../../../../domain/types";
import { fetchActivityTrajectory, fetchTrajectoriesInTile } from "../../helper/fetchTrajectories";
import { useTrajectoryPageState } from "../../state/useTrajectoryPageState";

const VIEWPORT_DEBOUNCE_MS = 300;

type ReportedViewport = { activeId: string; viewport: MapViewport };

const logError = (e: unknown) =>
  Sentry.captureException(
    new Error("Failed to fetch LOD trajectories: " + (e instanceof Error ? e.message : String(e))),
  );

// Switches the shown trajectories to a higher LOD while the map is zoomed in.
// - All view: the activities in the map tiles covering the viewport are fetched
//   tile by tile (stable, cacheable requests). Fetched tiles are kept until the
//   map zooms back out or the selection changes, so panning back or zooming in
//   does not refetch.
// - Single view: the selected activity is fetched, independent of the viewport.
// Anything not covered falls back to the base (LOD 1) track.
export const useViewportLod = () => {
  const { activeId, viewMode, onLodOverridesChange } = useTrajectoryPageState();
  const [reported, setReported] = useState<ReportedViewport | null>(null);
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;
  const timerRef = useRef<number | null>(null);
  const tileCacheRef = useRef<Map<string, LodOverrides>>(new Map());

  const cancelPending = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const onViewportChange = useCallback((viewport: MapViewport) => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setReported({ activeId: activeIdRef.current, viewport });
    }, VIEWPORT_DEBOUNCE_MS);
  }, []);

  // A viewport reported for another selection says nothing about this one.
  useEffect(() => cancelPending, [activeId]);
  useEffect(() => cancelPending, []);
  const viewport = reported?.activeId === activeId ? reported.viewport : null;

  const detailed = viewport !== null && isDetailedZoom(viewport.zoom);
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;
  // All view re-evaluates only when the covering tiles change; single view only on selection.
  const requestKey =
    viewMode === "all" && viewport
      ? tilesCovering(viewport.bounds, LOD_TILE_ZOOM).map(tileKey).join(",")
      : activeId;

  useEffect(() => {
    const current = viewportRef.current;
    if (!detailed || !current) {
      tileCacheRef.current.clear();
      onLodOverridesChange({});
      return;
    }

    if (viewMode === "single") {
      const controller = new AbortController();
      fetchActivityTrajectory(activeId, controller.signal)
        .then(onLodOverridesChange)
        .catch((e) => {
          if (!controller.signal.aborted) logError(e);
        });
      return () => controller.abort();
    }

    const cache = tileCacheRef.current;
    const tiles = tilesCovering(current.bounds, LOD_TILE_ZOOM);
    const apply = () => onLodOverridesChange(Object.assign({}, ...tiles.map((tile) => cache.get(tileKey(tile)))));

    const missing = tiles.filter((tile) => !cache.has(tileKey(tile)));
    if (missing.length === 0) {
      apply();
      return;
    }

    // Tile data does not depend on the viewport, so finished tiles are cached even
    // if the viewport has moved on; only a request that is still current updates the display.
    let stale = false;
    Promise.all(
      missing.map(async (tile) => {
        cache.set(tileKey(tile), await fetchTrajectoriesInTile(tile));
      }),
    )
      .then(() => {
        if (!stale) apply();
      })
      .catch(logError);

    return () => {
      stale = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailed, requestKey, viewMode, activeId]);

  return { onViewportChange };
};
