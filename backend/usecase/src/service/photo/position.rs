//! Decides where a photo sits on an activity.
//!
//! A [`Track`] is built from the finest stored LOD of an activity. Its
//! cumulative distances are scaled so that the last point equals the activity's
//! total distance, which keeps `distance_m` consistent with the value shown for
//! the activity even though the thinned line is slightly shorter than the raw one.

use chrono::{Duration, NaiveDateTime};

use crate::model::photo::{PhotoPosition, PositionSource};
use crate::model::trajectory::Coordinate;
use crate::service::trajectory::geo::haversine_distance;

/// A photo taken within this window outside the recorded time range is still
/// attached to the start / end of the track.
pub const TIME_TOLERANCE_SECONDS: i64 = 5 * 60;

/// An EXIF GPS point farther than this from the track is not trusted.
pub const MAX_SNAP_DISTANCE_M: f64 = 500.0;

pub struct Track {
    coordinates: Vec<Coordinate>,
    recorded_ats: Vec<NaiveDateTime>,
    /// Meters from the start, one per coordinate, scaled to the activity distance.
    cumulative: Vec<f64>,
}

impl Track {
    /// `None` when the track has fewer than two points.
    pub fn new(
        coordinates: Vec<Coordinate>,
        recorded_ats: Vec<NaiveDateTime>,
        activity_distance_m: f64,
    ) -> Option<Self> {
        if coordinates.len() < 2 {
            return None;
        }

        let mut cumulative = Vec::with_capacity(coordinates.len());
        let mut sum = 0.0;
        cumulative.push(0.0);
        for pair in coordinates.windows(2) {
            sum += haversine_distance(&pair[0], &pair[1]);
            cumulative.push(sum);
        }

        let scale = if sum > 0.0 && activity_distance_m > 0.0 {
            activity_distance_m / sum
        } else {
            1.0
        };
        cumulative.iter_mut().for_each(|d| *d *= scale);

        Some(Self {
            coordinates,
            recorded_ats,
            cumulative,
        })
    }

    pub fn total_distance_m(&self) -> f64 {
        *self.cumulative.last().unwrap_or(&0.0)
    }

    /// Places a photo by its shooting time (UTC) with a binary search over the
    /// recorded times. `None` when the track has no usable times or the time is
    /// outside the recorded range (beyond the tolerance).
    pub fn locate_by_time(&self, taken_at: NaiveDateTime) -> Option<PhotoPosition> {
        if self.recorded_ats.len() != self.coordinates.len() {
            return None;
        }
        let first = *self.recorded_ats.first()?;
        let last = *self.recorded_ats.last()?;
        let tolerance = Duration::seconds(TIME_TOLERANCE_SECONDS);
        if taken_at < first - tolerance || last + tolerance < taken_at {
            return None;
        }
        let t = taken_at.clamp(first, last);

        // Number of points recorded at or before `t` (the times are ascending).
        let after = self.recorded_ats.partition_point(|r| *r <= t);
        if after >= self.recorded_ats.len() {
            return Some(self.point_at(self.recorded_ats.len() - 1, 0.0, PositionSource::Time));
        }
        let i = after.saturating_sub(1);
        let span = (self.recorded_ats[i + 1] - self.recorded_ats[i]).num_milliseconds();
        let ratio = if span > 0 {
            (t - self.recorded_ats[i]).num_milliseconds() as f64 / span as f64
        } else {
            0.0
        };
        Some(self.point_at(i, ratio, PositionSource::Time))
    }

    /// Snaps an EXIF GPS point to the nearest point of the track. `None` when
    /// the nearest point is farther than [`MAX_SNAP_DISTANCE_M`].
    pub fn locate_nearest(&self, lng: f64, lat: f64) -> Option<PhotoPosition> {
        let mut best: Option<(f64, usize, f64)> = None; // (squared meters, segment, ratio)
        for (i, pair) in self.coordinates.windows(2).enumerate() {
            // Local equirectangular projection around the segment; precise
            // enough at the scale of a single segment.
            let scale_x = pair[0].latitude.to_radians().cos() * METERS_PER_DEGREE;
            let to_xy = |lng_: f64, lat_: f64| {
                (
                    (lng_ - pair[0].longitude) * scale_x,
                    (lat_ - pair[0].latitude) * METERS_PER_DEGREE,
                )
            };
            let (bx, by) = to_xy(pair[1].longitude, pair[1].latitude);
            let (px, py) = to_xy(lng, lat);
            let len2 = bx * bx + by * by;
            let ratio = if len2 > 0.0 {
                ((px * bx + py * by) / len2).clamp(0.0, 1.0)
            } else {
                0.0
            };
            let (dx, dy) = (px - ratio * bx, py - ratio * by);
            let d2 = dx * dx + dy * dy;
            if best.is_none_or(|(b, _, _)| d2 < b) {
                best = Some((d2, i, ratio));
            }
        }

        let (d2, i, ratio) = best?;
        if d2.sqrt() > MAX_SNAP_DISTANCE_M {
            return None;
        }
        Some(self.point_at(i, ratio, PositionSource::Exif))
    }

    /// Places a photo at `distance_m` from the start (clamped to the track).
    pub fn locate_by_distance(&self, distance_m: f64, source: PositionSource) -> PhotoPosition {
        let d = distance_m.clamp(0.0, self.total_distance_m());
        let after = self.cumulative.partition_point(|c| *c <= d);
        if after >= self.cumulative.len() {
            return self.point_at(self.cumulative.len() - 1, 0.0, source);
        }
        let i = after.saturating_sub(1);
        let span = self.cumulative[i + 1] - self.cumulative[i];
        let ratio = if span > 0.0 {
            (d - self.cumulative[i]) / span
        } else {
            0.0
        };
        self.point_at(i, ratio, source)
    }

    /// The point `ratio` (0..1) of the way from vertex `i` to vertex `i + 1`.
    fn point_at(&self, i: usize, ratio: f64, source: PositionSource) -> PhotoPosition {
        let a = &self.coordinates[i];
        let Some(b) = self.coordinates.get(i + 1) else {
            return PhotoPosition {
                distance_m: self.cumulative[i],
                lng: a.longitude,
                lat: a.latitude,
                source,
            };
        };
        PhotoPosition {
            distance_m: self.cumulative[i] + (self.cumulative[i + 1] - self.cumulative[i]) * ratio,
            lng: a.longitude + (b.longitude - a.longitude) * ratio,
            lat: a.latitude + (b.latitude - a.latitude) * ratio,
            source,
        }
    }
}

const METERS_PER_DEGREE: f64 = 111_320.0;

/// Decides the position of a photo automatically: by shooting time first (the
/// binary search is exact even where the route doubles back), then by EXIF GPS.
/// `None` when neither is usable; the photo is then placed by hand.
pub fn decide_position(
    track: &Track,
    taken_at_utc: Option<NaiveDateTime>,
    gps: Option<(f64, f64)>,
) -> Option<PhotoPosition> {
    taken_at_utc
        .and_then(|t| track.locate_by_time(t))
        .or_else(|| gps.and_then(|(lng, lat)| track.locate_nearest(lng, lat)))
}

#[cfg(test)]
mod tests {
    use super::*;
    use chrono::NaiveDate;

    fn at(minute: u32, second: u32) -> NaiveDateTime {
        NaiveDate::from_ymd_opt(2026, 5, 10)
            .unwrap()
            .and_hms_opt(9, minute, second)
            .unwrap()
    }

    /// Four points heading east along the equator, one minute apart,
    /// 0.01 degrees (~1113 m) per segment.
    fn east_track() -> Track {
        let coordinates = (0..4)
            .map(|i| Coordinate {
                latitude: 0.0,
                longitude: i as f64 * 0.01,
            })
            .collect();
        let recorded_ats = (0..4).map(|i| at(i, 0)).collect();
        Track::new(coordinates, recorded_ats, 3000.0).unwrap()
    }

    #[test]
    fn needs_at_least_two_points() {
        let one = vec![Coordinate {
            latitude: 0.0,
            longitude: 0.0,
        }];
        assert!(Track::new(one, vec![at(0, 0)], 0.0).is_none());
    }

    #[test]
    fn scales_distances_to_the_activity_distance() {
        assert!((east_track().total_distance_m() - 3000.0).abs() < 1e-6);
    }

    #[test]
    fn locates_by_time_with_interpolation() {
        let p = east_track().locate_by_time(at(1, 30)).unwrap();
        assert_eq!(p.source, PositionSource::Time);
        assert!((p.lng - 0.015).abs() < 1e-9);
        assert!((p.distance_m - 1500.0).abs() < 1e-6);
    }

    #[test]
    fn locates_exactly_on_a_recorded_time() {
        let p = east_track().locate_by_time(at(2, 0)).unwrap();
        assert!((p.lng - 0.02).abs() < 1e-9);
        assert!((p.distance_m - 2000.0).abs() < 1e-6);
    }

    #[test]
    fn locates_at_the_last_recorded_time() {
        let p = east_track().locate_by_time(at(3, 0)).unwrap();
        assert!((p.lng - 0.03).abs() < 1e-9);
        assert!((p.distance_m - 3000.0).abs() < 1e-6);
    }

    #[test]
    fn clamps_within_the_tolerance_and_rejects_beyond_it() {
        let track = east_track();
        // 4 minutes before the start: attached to the start.
        let before = NaiveDate::from_ymd_opt(2026, 5, 10)
            .unwrap()
            .and_hms_opt(8, 56, 0)
            .unwrap();
        assert_eq!(track.locate_by_time(before).unwrap().distance_m, 0.0);
        // 4 minutes after the end: attached to the end.
        let after = NaiveDate::from_ymd_opt(2026, 5, 10)
            .unwrap()
            .and_hms_opt(9, 7, 0)
            .unwrap();
        assert!((track.locate_by_time(after).unwrap().distance_m - 3000.0).abs() < 1e-6);
        // 10 minutes after the end: rejected.
        let far = NaiveDate::from_ymd_opt(2026, 5, 10)
            .unwrap()
            .and_hms_opt(9, 13, 0)
            .unwrap();
        assert!(track.locate_by_time(far).is_none());
    }

    #[test]
    fn rejects_time_when_recorded_times_do_not_match_coordinates() {
        let coordinates = (0..3)
            .map(|i| Coordinate {
                latitude: 0.0,
                longitude: i as f64 * 0.01,
            })
            .collect();
        let track = Track::new(coordinates, vec![at(0, 0)], 1000.0).unwrap();
        assert!(track.locate_by_time(at(0, 0)).is_none());
    }

    #[test]
    fn handles_duplicate_recorded_times() {
        let coordinates = vec![
            Coordinate {
                latitude: 0.0,
                longitude: 0.0,
            },
            Coordinate {
                latitude: 0.0,
                longitude: 0.01,
            },
            Coordinate {
                latitude: 0.0,
                longitude: 0.02,
            },
        ];
        let track = Track::new(coordinates, vec![at(0, 0), at(0, 0), at(1, 0)], 2000.0).unwrap();
        let p = track.locate_by_time(at(0, 0)).unwrap();
        assert!(p.distance_m.is_finite());
    }

    #[test]
    fn snaps_gps_to_the_nearest_point() {
        // ~111 m north of the middle of the second segment.
        let p = east_track().locate_nearest(0.015, 0.001).unwrap();
        assert_eq!(p.source, PositionSource::Exif);
        assert!((p.lng - 0.015).abs() < 1e-6);
        assert!(p.lat.abs() < 1e-9);
        assert!((p.distance_m - 1500.0).abs() < 1.0);
    }

    #[test]
    fn snaps_gps_beyond_the_end_to_the_end() {
        let p = east_track().locate_nearest(0.0305, 0.0).unwrap();
        assert!((p.distance_m - 3000.0).abs() < 1e-6);
    }

    #[test]
    fn rejects_gps_far_from_the_track() {
        // ~1.1 km north of the track.
        assert!(east_track().locate_nearest(0.015, 0.01).is_none());
    }

    #[test]
    fn decide_prefers_time_over_gps() {
        let track = east_track();
        // The time says the start, the GPS says the middle of the last segment.
        let p = decide_position(&track, Some(at(0, 0)), Some((0.025, 0.0))).unwrap();
        assert_eq!(p.source, PositionSource::Time);
        assert_eq!(p.distance_m, 0.0);
    }

    #[test]
    fn decide_falls_back_to_gps_when_time_is_unusable() {
        let track = east_track();
        let p = decide_position(&track, None, Some((0.025, 0.0))).unwrap();
        assert_eq!(p.source, PositionSource::Exif);
        let far = NaiveDate::from_ymd_opt(2026, 5, 9)
            .unwrap()
            .and_hms_opt(9, 0, 0)
            .unwrap();
        let p = decide_position(&track, Some(far), Some((0.025, 0.0))).unwrap();
        assert_eq!(p.source, PositionSource::Exif);
    }

    #[test]
    fn decide_gives_none_when_nothing_is_usable() {
        let track = east_track();
        assert!(decide_position(&track, None, None).is_none());
        // GPS far from the track and no time.
        assert!(decide_position(&track, None, Some((0.015, 0.01))).is_none());
    }

    #[test]
    fn locates_by_distance_and_clamps() {
        let track = east_track();
        let p = track.locate_by_distance(1500.0, PositionSource::Manual);
        assert_eq!(p.source, PositionSource::Manual);
        assert!((p.lng - 0.015).abs() < 1e-9);
        assert_eq!(
            track
                .locate_by_distance(-10.0, PositionSource::Manual)
                .distance_m,
            0.0
        );
        let end = track.locate_by_distance(99_999.0, PositionSource::Manual);
        assert!((end.distance_m - 3000.0).abs() < 1e-6);
        assert!((end.lng - 0.03).abs() < 1e-9);
    }
}
