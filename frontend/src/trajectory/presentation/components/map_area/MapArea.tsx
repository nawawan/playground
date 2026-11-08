import { Box } from "@mui/material";
import { AttributionControl, Map as MapLibreMap, Marker, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { pointAt } from "../../../domain/geo";
import type { LngLat, MapStyleKey, MapViewport, TrajectoryActivity } from "../../../domain/types";
import { boundsOf, MAP_STYLE_SOURCES } from "./maplibre";

type MapAreaProps = {
  activity: TrajectoryActivity;
  activePhotoId: string | null;
  here: number;
  mapStyle: MapStyleKey;
  onPhotoSelect: (photoId: string) => void;
  // Fired when the map stops moving (after pan / zoom / fit).
  onViewportChange?: (viewport: MapViewport) => void;
  // Optional overlays used to compare a thinned track against the original.
  referenceTrack?: LngLat[];
  showCheckpoints?: boolean;
};

const TRACK_SOURCE_ID = "trajectory-track";
const REFERENCE_SOURCE_ID = "trajectory-reference";
const CHECKPOINT_SOURCE_ID = "trajectory-checkpoints";

type TrackOverlays = { referenceTrack?: LngLat[]; showCheckpoints?: boolean };

const addTrackLayers = (map: MapLibreMap, activity: TrajectoryActivity, overlays: TrackOverlays = {}) => {
  ["checkpoints", "reference", "track-glow", "track"].forEach((id) => {
    if (map.getLayer(id)) map.removeLayer(id);
  });
  [CHECKPOINT_SOURCE_ID, REFERENCE_SOURCE_ID, TRACK_SOURCE_ID].forEach((id) => {
    if (map.getSource(id)) map.removeSource(id);
  });

  if (overlays.referenceTrack) {
    map.addSource(REFERENCE_SOURCE_ID, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: { type: "LineString", coordinates: overlays.referenceTrack },
        properties: {},
      },
    });
    map.addLayer({
      id: "reference",
      type: "line",
      source: REFERENCE_SOURCE_ID,
      paint: { "line-color": "#2563eb", "line-width": 2, "line-opacity": 0.8 },
    });
  }

  map.addSource(TRACK_SOURCE_ID, {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: { type: "LineString", coordinates: activity.track },
      properties: {},
    },
  });
  map.addLayer({
    id: "track-glow",
    type: "line",
    source: TRACK_SOURCE_ID,
    paint: { "line-color": "red", "line-width": 10, "line-opacity": 0.18, "line-blur": 3 },
    layout: { "line-cap": "round", "line-join": "round" },
  });
  map.addLayer({
    id: "track",
    type: "line",
    source: TRACK_SOURCE_ID,
    paint: { "line-color": "red", "line-width": 4, "line-opacity": 0.95 },
    layout: { "line-cap": "round", "line-join": "round" },
  });

  if (overlays.showCheckpoints) {
    map.addSource(CHECKPOINT_SOURCE_ID, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: activity.track.map((coordinates) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates },
          properties: {},
        })),
      },
    });
    map.addLayer({
      id: "checkpoints",
      type: "circle",
      source: CHECKPOINT_SOURCE_ID,
      paint: { "circle-radius": 3, "circle-color": "#fff", "circle-stroke-color": "#111", "circle-stroke-width": 1.5 },
    });
  }
};

export const MapArea = ({
  activity,
  activePhotoId,
  here,
  mapStyle,
  onPhotoSelect,
  onViewportChange,
  referenceTrack,
  showCheckpoints,
}: MapAreaProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);
  const hereMarkerRef = useRef<Marker | null>(null);
  const startEndMarkersRef = useRef<Marker[]>([]);
  const photoMarkersRef = useRef<{ id: string; element: HTMLDivElement; marker: Marker }[]>([]);
  const onPhotoSelectRef = useRef(onPhotoSelect);
  onPhotoSelectRef.current = onPhotoSelect;
  const onViewportChangeRef = useRef(onViewportChange);
  onViewportChangeRef.current = onViewportChange;
  const mapStyleRef = useRef(mapStyle);
  mapStyleRef.current = mapStyle;
  const appliedStyleRef = useRef(mapStyle);
  const activityRef = useRef(activity);
  activityRef.current = activity;
  const fittedActivityRef = useRef<string | null>(null);
  const overlaysRef = useRef<TrackOverlays>({});
  overlaysRef.current = { referenceTrack, showCheckpoints };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new MapLibreMap({
      container: containerRef.current,
      style: MAP_STYLE_SOURCES[mapStyleRef.current](),
      center: activity.center,
      zoom: activity.zoom,
      attributionControl: false,
      pitchWithRotate: false,
      dragRotate: false,
    });
    map.addControl(new AttributionControl({ compact: true }), "bottom-right");
    map.addControl(new NavigationControl({ showCompass: false }), "bottom-right");
    map.on("load", () => setReady(true));
    map.on("moveend", () => {
      const [[west, south], [east, north]] = map.getBounds().toArray();
      onViewportChangeRef.current?.({ zoom: map.getZoom(), bounds: [west, south, east, north] });
    });
    mapRef.current = map;

    return () => {
      photoMarkersRef.current.forEach(({ marker }) => marker.remove());
      photoMarkersRef.current = [];
      startEndMarkersRef.current.forEach((marker) => marker.remove());
      startEndMarkersRef.current = [];
      hereMarkerRef.current?.remove();
      hereMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    // The initial style is already applied at construction; resetting it here
    // would wipe the track layers added by the activity effect below.
    if (appliedStyleRef.current === mapStyle) return;
    appliedStyleRef.current = mapStyle;

    map.setStyle(MAP_STYLE_SOURCES[mapStyle]());
    map.once("style.load", () => addTrackLayers(map, activityRef.current, overlaysRef.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    addTrackLayers(map, activity, { referenceTrack, showCheckpoints });
    // Only re-fit when the activity itself changes, not when toggling overlays.
    if (fittedActivityRef.current !== activity.id) {
      fittedActivityRef.current = activity.id;
      map.fitBounds(boundsOf(referenceTrack ?? activity.track), { padding: 80, duration: 900 });
    }

    startEndMarkersRef.current.forEach((marker) => marker.remove());
    const startEl = document.createElement("div");
    startEl.className = "trajectory-map-area__marker";
    const endEl = document.createElement("div");
    endEl.className = "trajectory-map-area__marker";
    startEndMarkersRef.current = [
      new Marker({ element: startEl }).setLngLat(activity.track[0]).addTo(map),
      new Marker({ element: endEl }).setLngLat(activity.track[activity.track.length - 1]).addTo(map),
    ];

    photoMarkersRef.current.forEach(({ marker }) => marker.remove());
    photoMarkersRef.current = activity.photos.map((photo) => {
      const el = document.createElement("div");
      el.className = "trajectory-map-area__photo-marker";
      el.setAttribute("aria-label", photo.caption);
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        onPhotoSelectRef.current(photo.id);
      });
      const marker = new Marker({ element: el }).setLngLat(pointAt(activity.track, photo.at)).addTo(map);
      return { id: photo.id, element: el, marker };
    });
  }, [activity, ready, referenceTrack, showCheckpoints]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    const lngLat = pointAt(activity.track, here);
    if (!hereMarkerRef.current) {
      const el = document.createElement("div");
      el.className = "trajectory-map-area__here";
      hereMarkerRef.current = new Marker({ element: el }).setLngLat(lngLat).addTo(map);
    } else {
      hereMarkerRef.current.setLngLat(lngLat);
    }
  }, [activity, here, ready]);

  useEffect(() => {
    photoMarkersRef.current.forEach(({ id, element }) => {
      element.classList.toggle("is-active", id === activePhotoId);
    });
  }, [activePhotoId]);

  return <Box className="trajectory-map-area" component="section" aria-label="route map" ref={containerRef} />;
};
