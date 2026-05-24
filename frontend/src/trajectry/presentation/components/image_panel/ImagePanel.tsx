import { elevationAt, formatKmAt } from "../../../domain/geo";
import type { TrajectryActivity } from "../../../domain/types";

type ImagePanelProps = {
  activity: TrajectryActivity;
  activePhotoId: string | null;
  here: number;
  onPhotoSelect: (photoId: string) => void;
};

const photoBackground = (color: string) =>
  `repeating-linear-gradient(135deg, ${color}cc 0 8px, ${color}99 8px 16px)`;

const StatTile = ({ label, value }: { label: string; value: string }) => (
  <div className="trajectry-stat-tile">
    <div className="trajectry-mono trajectry-stat-tile__label">{label}</div>
    <div className="trajectry-stat-tile__value">{value}</div>
  </div>
);

export const ImagePanel = ({ activity, activePhotoId, here, onPhotoSelect }: ImagePanelProps) => {
  const hereElevation = Math.round(elevationAt(activity.elevation, here));
  const hereKm = formatKmAt(activity.km, here);

  return (
    <div className="trajectry-image-panel">
      <div className="trajectry-image-panel__stats">
        <StatTile label="elev here" value={`${hereElevation}m`} />
        <StatTile label="at" value={`${hereKm} / ${activity.km}km`} />
      </div>
      {activity.note && activity.note !== "—" && <div className="trajectry-image-panel__note">"{activity.note}"</div>}
      <div>
        <div className="trajectry-mono trajectry-image-panel__grid-title">
          <span>PHOTOS</span>
          <span>{activity.photos.length}</span>
        </div>
        <div className="trajectry-image-panel__grid">
          {activity.photos.map((photo) => (
            <button
              aria-label={photo.caption}
              className={`trajectry-image-panel__thumb${photo.id === activePhotoId ? " is-active" : ""}`}
              key={photo.id}
              onClick={() => onPhotoSelect(photo.id)}
              style={{ background: photoBackground(photo.color) }}
              type="button"
            >
              {photo.id === activePhotoId && <i aria-hidden="true" />}
              <span>{photo.stamp}</span>
            </button>
          ))}
          <button className="trajectry-image-panel__add" type="button">
            +
          </button>
        </div>
      </div>
    </div>
  );
};
