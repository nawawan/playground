import type { LngLat } from "./types";

export type RawTrack = {
  track: LngLat[];
  elevation: number[];
};

// Parses <trkpt lat lon><ele> from a GPX document. Only used for previewing thinning in Storybook.
export const parseGpx = (text: string): RawTrack => {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  const track: LngLat[] = [];
  const elevation: number[] = [];
  Array.from(doc.getElementsByTagName("trkpt")).forEach((point) => {
    const lat = Number(point.getAttribute("lat"));
    const lng = Number(point.getAttribute("lon"));
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;
    track.push([lng, lat]);
    elevation.push(Number(point.getElementsByTagName("ele")[0]?.textContent ?? 0));
  });
  return { track, elevation };
};

// JSON shaped like the backend response ({ coordinates: [{ latitude, longitude }], elevations })
// or a plain { track: [lng, lat][], elevation: number[] }.
export const parseJsonTrack = (text: string): RawTrack => {
  const data = JSON.parse(text);
  if (Array.isArray(data.track)) {
    return { track: data.track, elevation: data.elevation ?? data.track.map(() => 0) };
  }
  const coordinates: { latitude: number; longitude: number }[] = data.coordinates ?? [];
  return {
    track: coordinates.map((c) => [c.longitude, c.latitude] as LngLat),
    elevation: data.elevations ?? coordinates.map(() => 0),
  };
};

// Every *.gpx / *.json dropped into domain/fixtures/ becomes a selectable data source in the story.
const files = import.meta.glob("./fixtures/*.{gpx,json}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const fixtureTracks: Record<string, RawTrack> = Object.fromEntries(
  Object.entries(files).map(([path, text]) => {
    const name = path.replace("./fixtures/", "");
    return [name, path.endsWith(".gpx") ? parseGpx(text) : parseJsonTrack(text)];
  }),
);
