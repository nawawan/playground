import { Box } from "@mui/material";
import { AttributionControl, LngLatBounds, Map as MapLibreMap, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { GeoJSONSource } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import type { LngLat, MapStyleKey, MapViewport } from "../../../domain/types";
import { MAP_STYLE_SOURCES } from "./maplibre";

export type AllMapAreaTrack = {
  id: string;
  track: LngLat[];
};

type AllMapAreaProps = {
  tracks: AllMapAreaTrack[];
  mapStyle: MapStyleKey;
  // Fired when the map stops moving (after pan / zoom / fit).
  onViewportChange: (viewport: MapViewport) => void;
};

const SOURCE_ID = "all-tracks";
const LAYER_IDS = ["all-tracks-glow", "all-tracks-line"];

type TrackData = Parameters<GeoJSONSource["setData"]>[0];

const toFeatureCollection = (tracks: AllMapAreaTrack[]): TrackData => ({
  type: "FeatureCollection",
  features: tracks
    .filter(({ track }) => track.length >= 2)
    .map(({ id, track }) => ({
      type: "Feature",
      geometry: { type: "LineString", coordinates: track },
      properties: { activityId: id },
    })),
});

// Adds the shared source/layers, or just swaps the data when they already exist.
// A single source keeps the layer count constant however many activities exist.
const syncTracks = (map: MapLibreMap, tracks: AllMapAreaTrack[]) => {
  const data = toFeatureCollection(tracks);
  const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
  if (source) {
    source.setData(data);
    return;
  }

  map.addSource(SOURCE_ID, { type: "geojson", data });
  map.addLayer({
    id: LAYER_IDS[0],
    type: "line",
    source: SOURCE_ID,
    paint: { "line-color": "red", "line-width": 8, "line-opacity": 0.15, "line-blur": 3 },
    layout: { "line-cap": "round", "line-join": "round" },
  });
  map.addLayer({
    id: LAYER_IDS[1],
    type: "line",
    source: SOURCE_ID,
    paint: { "line-color": "red", "line-width": 3, "line-opacity": 0.85 },
    layout: { "line-cap": "round", "line-join": "round" },
  });
};

const boundsOfAll = (tracks: AllMapAreaTrack[]): LngLatBounds | null => {
  const points = tracks.flatMap(({ track }) => track);
  if (points.length === 0) return null;
  return points.reduce((bounds, point) => bounds.extend(point), new LngLatBounds(points[0], points[0]));
};

export const AllMapArea = ({ tracks, mapStyle, onViewportChange }: AllMapAreaProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);
  const tracksRef = useRef(tracks);
  tracksRef.current = tracks;
  const onViewportChangeRef = useRef(onViewportChange);
  onViewportChangeRef.current = onViewportChange;
  const mapStyleRef = useRef(mapStyle);
  mapStyleRef.current = mapStyle;
  const appliedStyleRef = useRef(mapStyle);
  const fittedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new MapLibreMap({
      container: containerRef.current,
      style: MAP_STYLE_SOURCES[mapStyleRef.current](),
      center: [138, 36],
      zoom: 4,
      attributionControl: false,
      pitchWithRotate: false,
      dragRotate: false,
    });
    map.addControl(new AttributionControl({ compact: true }), "bottom-right");
    map.addControl(new NavigationControl({ showCompass: false }), "bottom-right");
    map.on("load", () => setReady(true));
    map.on("moveend", () => {
      const [[west, south], [east, north]] = map.getBounds().toArray();
      onViewportChangeRef.current({ zoom: map.getZoom(), bounds: [west, south, east, north] });
    });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    // The initial style is applied at construction; resetting it would wipe the layers.
    if (appliedStyleRef.current === mapStyle) return;
    appliedStyleRef.current = mapStyle;

    map.setStyle(MAP_STYLE_SOURCES[mapStyle]());
    map.once("style.load", () => syncTracks(map, tracksRef.current));
  }, [mapStyle, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    // While a style switch is in flight the "style.load" handler above syncs the latest tracks.
    if (map.isStyleLoaded()) syncTracks(map, tracks);

    if (!fittedRef.current) {
      const bounds = boundsOfAll(tracks);
      if (bounds) {
        fittedRef.current = true;
        map.fitBounds(bounds, { padding: 60, duration: 900 });
      }
    }
  }, [tracks, ready]);

  return <Box className="trajectory-map-area" component="section" aria-label="all routes map" ref={containerRef} />;
};
