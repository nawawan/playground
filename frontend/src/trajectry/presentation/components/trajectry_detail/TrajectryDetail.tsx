import type { TrajectryActivity } from "../../../domain/types";

type TrajectryDetailProps = {
  activity: TrajectryActivity;
};

export const TrajectryDetail = ({ activity }: TrajectryDetailProps) => (
  <div className="trajectry-detail">
    <div className="trajectry-hand trajectry-detail__title">{activity.title}</div>
    <div className="trajectry-detail__subtitle">{activity.subtitle}</div>
    <div className="trajectry-mono trajectry-detail__stats">
      <span>{activity.date}</span>
      <span>·</span>
      <span>{activity.km}km</span>
      <span>·</span>
      <span>↑{activity.gain}m</span>
      <span>·</span>
      <span>{activity.duration}</span>
    </div>
  </div>
);
