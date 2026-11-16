//! Re-encodes an uploaded photo for publishing.
//!
//! Both outputs are freshly encoded JPEGs, so EXIF (including GPS) is dropped
//! from everything that is served publicly. The EXIF orientation is applied to
//! the pixels first.

use std::io::Cursor;

use image::metadata::Orientation;
use image::{DynamicImage, ImageFormat, ImageReader, Limits, imageops::FilterType};

pub const MAX_IMAGE_EDGE: u32 = 2048;
pub const THUMBNAIL_EDGE: u32 = 480;
const IMAGE_QUALITY: u8 = 85;
const THUMBNAIL_QUALITY: u8 = 80;
// Guard against decompression bombs: a 20MB JPEG can describe a huge bitmap.
const MAX_DECODE_PIXELS: u32 = 12_000;
const MAX_DECODE_ALLOC: u64 = 512 * 1024 * 1024;

pub struct ProcessedImage {
    pub image: Vec<u8>,
    pub thumbnail: Vec<u8>,
}

pub fn process_image(data: &[u8], orientation: u8) -> Result<ProcessedImage, String> {
    let mut reader = ImageReader::new(Cursor::new(data))
        .with_guessed_format()
        .map_err(|e| format!("failed to read image: {e}"))?;

    match reader.format() {
        Some(ImageFormat::Jpeg | ImageFormat::Png | ImageFormat::WebP) => {}
        _ => return Err("unsupported image format (JPEG, PNG and WebP are supported)".into()),
    }

    let mut limits = Limits::default();
    limits.max_image_width = Some(MAX_DECODE_PIXELS);
    limits.max_image_height = Some(MAX_DECODE_PIXELS);
    limits.max_alloc = Some(MAX_DECODE_ALLOC);
    reader.limits(limits);

    let mut decoded = reader
        .decode()
        .map_err(|e| format!("failed to decode image: {e}"))?;
    if let Some(orientation) = Orientation::from_exif(orientation) {
        decoded.apply_orientation(orientation);
    }

    let image = shrink(&decoded, MAX_IMAGE_EDGE);
    let thumbnail = shrink(&decoded, THUMBNAIL_EDGE);
    Ok(ProcessedImage {
        image: encode_jpeg(&image, IMAGE_QUALITY)?,
        thumbnail: encode_jpeg(&thumbnail, THUMBNAIL_QUALITY)?,
    })
}

/// Fits the image into `edge` x `edge`, never enlarging it.
fn shrink(image: &DynamicImage, edge: u32) -> DynamicImage {
    if image.width() <= edge && image.height() <= edge {
        return image.clone();
    }
    image.resize(edge, edge, FilterType::Triangle)
}

fn encode_jpeg(image: &DynamicImage, quality: u8) -> Result<Vec<u8>, String> {
    let mut out = Vec::new();
    let encoder = image::codecs::jpeg::JpegEncoder::new_with_quality(&mut out, quality);
    // JPEG has no alpha channel.
    image
        .to_rgb8()
        .write_with_encoder(encoder)
        .map_err(|e| format!("failed to encode image: {e}"))?;
    Ok(out)
}

#[cfg(test)]
mod tests {
    use super::*;
    use image::{ImageBuffer, Rgb};

    fn png(width: u32, height: u32) -> Vec<u8> {
        let buffer = ImageBuffer::from_fn(width, height, |x, _| {
            if x < width / 2 {
                Rgb([255u8, 0, 0])
            } else {
                Rgb([0u8, 0, 255])
            }
        });
        let mut out = Vec::new();
        DynamicImage::ImageRgb8(buffer)
            .write_to(&mut Cursor::new(&mut out), ImageFormat::Png)
            .unwrap();
        out
    }

    fn dimensions(jpeg: &[u8]) -> (u32, u32) {
        let image = image::load_from_memory_with_format(jpeg, ImageFormat::Jpeg).unwrap();
        (image.width(), image.height())
    }

    #[test]
    fn makes_a_thumbnail_and_keeps_small_images_as_they_are() {
        let processed = process_image(&png(1000, 600), 1).unwrap();
        assert_eq!(dimensions(&processed.image), (1000, 600));
        assert_eq!(dimensions(&processed.thumbnail), (480, 288));
    }

    #[test]
    fn shrinks_large_images() {
        let processed = process_image(&png(4000, 1000), 1).unwrap();
        assert_eq!(dimensions(&processed.image), (2048, 512));
    }

    #[test]
    fn applies_the_orientation() {
        // Orientation 6: rotate 90 degrees clockwise, so width and height swap.
        let processed = process_image(&png(800, 400), 6).unwrap();
        assert_eq!(dimensions(&processed.image), (400, 800));
    }

    #[test]
    fn output_is_jpeg_without_exif() {
        let processed = process_image(&png(100, 100), 1).unwrap();
        assert_eq!(&processed.image[..2], &[0xFF, 0xD8]);
        assert!(
            exif::Reader::new()
                .read_from_container(&mut Cursor::new(&processed.image))
                .is_err()
        );
    }

    #[test]
    fn rejects_unsupported_input() {
        assert!(process_image(b"GIF89a....", 1).is_err());
        assert!(process_image(b"plain text", 1).is_err());
    }
}
