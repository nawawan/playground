-- A travel groups several activities (e.g. a trip over multiple days).
-- Distance / duration / elevation / trajectory are derived from the children,
-- so only the name is stored.
CREATE TABLE travel (
    id BIGSERIAL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NULL means a standalone activity.
ALTER TABLE activity ADD COLUMN travel_id BIGINT REFERENCES travel(id) ON DELETE SET NULL;
CREATE INDEX activity_travel_id_idx ON activity (travel_id);

CREATE TABLE photo (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL REFERENCES activity(id) ON DELETE CASCADE,
    -- Object keys relative to the `_uploads/` prefix of the R2 bucket.
    image_key TEXT NOT NULL,
    thumbnail_key TEXT NOT NULL,
    -- Position along the activity (meters from the start). NULL = not placed yet.
    distance_m DOUBLE PRECISION,
    -- Position on the track (snapped).
    lng DOUBLE PRECISION,
    lat DOUBLE PRECISION,
    -- Raw EXIF GPS, kept only for reference.
    exif_lng DOUBLE PRECISION,
    exif_lat DOUBLE PRECISION,
    -- Shooting time converted to UTC (camera clock offset applied).
    taken_at TIMESTAMP,
    -- 'time' | 'exif' | 'manual'. NULL while not placed.
    position_source VARCHAR(16),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX photo_activity_id_idx ON photo (activity_id);
