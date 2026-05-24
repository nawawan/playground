import type { TrajectryActivity } from "../../../domain/types";

type ActivityCardProps = {
  activity: TrajectryActivity;
  active: boolean;
  onSelect: (activityId: string) => void;
};

export const ActivityCard = ({ activity, active, onSelect }: ActivityCardProps) => (
  <button
    className={`trajectry-activity-card${active ? " is-active" : ""}`}
    type="button"
    onClick={() => onSelect(activity.id)}
  >
    <div className="trajectry-activity-card__top">
      <span className="trajectry-activity-card__icon">{activity.type === "bike" ? "🚴" : "🏃"}</span>
      <span className="trajectry-activity-card__title">{activity.title}</span>
      <span className="trajectry-mono trajectry-activity-card__date">{activity.date}</span>
    </div>
    <div className="trajectry-activity-card__subtitle">{activity.subtitle}</div>
    <div className="trajectry-mono trajectry-activity-card__stats">
      <span>{activity.km} km</span>
      <span>↑ {activity.gain}m</span>
      <span>{activity.duration}</span>
    </div>
  </button>
);
