//! EXIF reading: GPS position, shooting time and orientation of a photo.

use std::io::Cursor;

use chrono::{NaiveDate, NaiveDateTime};
use exif::{In, Reader, Tag, Value};

/// EXIF `DateTimeOriginal` has no time zone. When `OffsetTimeOriginal` is
/// missing, assume Japan Standard Time.
pub const DEFAULT_UTC_OFFSET_SECONDS: i64 = 9 * 3600;

#[derive(Debug, Default, PartialEq)]
pub struct PhotoMetadata {
    /// `(lng, lat)` in degrees.
    pub gps: Option<(f64, f64)>,
    /// Shooting time as written by the camera (local time).
    pub taken_at_local: Option<NaiveDateTime>,
    /// UTC offset of `taken_at_local` in seconds, when the camera wrote it.
    pub utc_offset_seconds: Option<i64>,
    /// EXIF orientation (1..=8), 1 when absent.
    pub orientation: u8,
}

impl PhotoMetadata {
    /// The shooting time in UTC. `clock_offset_seconds` is added to correct a
    /// camera whose clock is off.
    pub fn taken_at_utc(&self, clock_offset_seconds: i64) -> Option<NaiveDateTime> {
        let local = self.taken_at_local?;
        let offset = self
            .utc_offset_seconds
            .unwrap_or(DEFAULT_UTC_OFFSET_SECONDS);
        local.checked_add_signed(chrono::Duration::seconds(clock_offset_seconds - offset))
    }
}

/// Reads the metadata of an image file. Images without EXIF (PNG, screenshots,
/// stripped files) give the default value instead of an error.
pub fn read_metadata(data: &[u8]) -> PhotoMetadata {
    let Ok(exif) = Reader::new().read_from_container(&mut Cursor::new(data)) else {
        return PhotoMetadata {
            orientation: 1,
            ..Default::default()
        };
    };

    let field = |tag: Tag| exif.get_field(tag, In::PRIMARY);

    let orientation = field(Tag::Orientation)
        .and_then(|f| f.value.get_uint(0))
        .filter(|o| (1..=8).contains(o))
        .map_or(1, |o| o as u8);

    let ascii = |tag: Tag| match field(tag).map(|f| &f.value) {
        Some(Value::Ascii(values)) => values.first().cloned(),
        _ => None,
    };

    let taken_at_local =
        ascii(Tag::DateTimeOriginal)
            .or_else(|| ascii(Tag::DateTime))
            .and_then(|bytes| exif::DateTime::from_ascii(&bytes).ok())
            .and_then(|dt| {
                NaiveDate::from_ymd_opt(dt.year.into(), dt.month.into(), dt.day.into())?
                    .and_hms_opt(dt.hour.into(), dt.minute.into(), dt.second.into())
            });

    let utc_offset_seconds = ascii(Tag::OffsetTimeOriginal).and_then(|bytes| parse_offset(&bytes));

    let gps = (|| {
        let lat = gps_degrees(field(Tag::GPSLatitude)?, ascii(Tag::GPSLatitudeRef)?, b'S')?;
        let lng = gps_degrees(
            field(Tag::GPSLongitude)?,
            ascii(Tag::GPSLongitudeRef)?,
            b'W',
        )?;
        // A camera without a fix writes 0/0.
        if lat == 0.0 && lng == 0.0 {
            return None;
        }
        Some((lng, lat))
    })();

    PhotoMetadata {
        gps,
        taken_at_local,
        utc_offset_seconds,
        orientation,
    }
}

/// `+09:00` -> 32400.
fn parse_offset(bytes: &[u8]) -> Option<i64> {
    let text = std::str::from_utf8(bytes).ok()?.trim();
    let sign = match text.as_bytes().first()? {
        b'+' => 1,
        b'-' => -1,
        _ => return None,
    };
    let (hours, minutes) = text[1..].split_once(':')?;
    let hours: i64 = hours.parse().ok()?;
    let minutes: i64 = minutes.parse().ok()?;
    if hours > 14 || minutes > 59 {
        return None;
    }
    Some(sign * (hours * 3600 + minutes * 60))
}

fn gps_degrees(field: &exif::Field, reference: Vec<u8>, negative_ref: u8) -> Option<f64> {
    let Value::Rational(parts) = &field.value else {
        return None;
    };
    if parts.len() < 3 || parts.iter().any(|r| r.denom == 0) {
        return None;
    }
    let degrees = parts[0].to_f64() + parts[1].to_f64() / 60.0 + parts[2].to_f64() / 3600.0;
    let negative = reference
        .first()
        .is_some_and(|r| r.eq_ignore_ascii_case(&negative_ref));
    Some(if negative { -degrees } else { degrees })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn local(h: u32) -> NaiveDateTime {
        NaiveDate::from_ymd_opt(2026, 5, 10)
            .unwrap()
            .and_hms_opt(h, 0, 0)
            .unwrap()
    }

    #[test]
    fn image_without_exif_gives_default_metadata() {
        let m = read_metadata(b"not an image");
        assert_eq!(m.gps, None);
        assert_eq!(m.taken_at_local, None);
        assert_eq!(m.orientation, 1);
    }

    #[test]
    fn converts_taken_at_with_the_camera_offset() {
        let m = PhotoMetadata {
            taken_at_local: Some(local(18)),
            utc_offset_seconds: Some(9 * 3600),
            orientation: 1,
            ..Default::default()
        };
        assert_eq!(m.taken_at_utc(0), Some(local(9)));
    }

    #[test]
    fn assumes_jst_without_an_offset() {
        let m = PhotoMetadata {
            taken_at_local: Some(local(18)),
            orientation: 1,
            ..Default::default()
        };
        assert_eq!(m.taken_at_utc(0), Some(local(9)));
    }

    #[test]
    fn applies_the_clock_offset() {
        let m = PhotoMetadata {
            taken_at_local: Some(local(18)),
            orientation: 1,
            ..Default::default()
        };
        // The camera is 10 minutes slow.
        assert_eq!(
            m.taken_at_utc(600),
            Some(local(9) + chrono::Duration::minutes(10))
        );
    }

    #[test]
    fn parses_offsets() {
        assert_eq!(parse_offset(b"+09:00"), Some(32400));
        assert_eq!(parse_offset(b"-05:30"), Some(-19800));
        assert_eq!(parse_offset(b"09:00"), None);
        assert_eq!(parse_offset(b"+99:00"), None);
    }
}
