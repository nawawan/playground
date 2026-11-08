import * as Sentry from "@sentry/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { isDetailedZoom } from "../../../../domain/lod";
import type { MapViewport } from "../../../../domain/types";
import { fetchActivityTrajectory, fetchTrajectoriesInBounds } from "../../helper/fetchTrajectories";
import { useTrajectoryPageState } from "../../state/useTrajectoryPageState";

const VIEWPORT_DEBOUNCE_MS = 300;

type ReportedViewport = { activeId: string; viewport: MapViewport };

// Switches the shown trajectories to a higher LOD while the map is zoomed in.
// - All view: only activities intersecting the viewport are fetched (bbox).
// - Single view: the selected activity is fetched, independent of the viewport.
// Anything outside the current view is dropped back to the base (LOD 1) track.
export const useViewportLod = () => {
  const { activeId, viewMode, onLodOverridesChange } = useTrajectoryPageState();
  const [reported, setReported] = useState<ReportedViewport | null>(null);
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;
  const timerRef = useRef<number | null>(null);

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
  // Single view depends only on the selection; All view re-fetches as the bbox changes.
  const requestKey = viewMode === "all" ? (viewport?.bounds.join(",") ?? "") : activeId;

  useEffect(() => {
    const current = viewportRef.current;
    if (!detailed || !current) {
      onLodOverridesChange({});
      return;
    }

    const controller = new AbortController();
    const request =
      viewMode === "all"
        ? fetchTrajectoriesInBounds(current.bounds, controller.signal)
        : fetchActivityTrajectory(activeId, controller.signal);

    request.then(onLodOverridesChange).catch((e) => {
      if (controller.signal.aborted) return;
      Sentry.captureException(
        new Error("Failed to fetch LOD trajectories: " + (e instanceof Error ? e.message : String(e))),
      );
    });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailed, requestKey, viewMode, activeId]);

  return { onViewportChange };
};
