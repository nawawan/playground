import type { TrajectryActivity } from "../../../domain/types";
import { ActivityCard } from "../activity_card/ActivityCard";

type TrajectrySideBarProps = {
  activities: TrajectryActivity[];
  activeId: string;
  onSelectActivity: (activityId: string) => void;
  onUpload: () => void;
};

export const TrajectrySideBar = ({
  activities,
  activeId,
  onSelectActivity,
  onUpload,
}: TrajectrySideBarProps) => (
  <aside className="trajectry-side-bar">
    <div className="trajectry-side-bar__head">
      <div className="trajectry-hand trajectry-side-bar__title">journal</div>
      <div className="trajectry-mono trajectry-side-bar__subtitle">a year of small adventures</div>
    </div>
    <div className="trajectry-side-bar__list">
      <button className="trajectry-side-bar__new" type="button" onClick={onUpload}>
        + new activity
      </button>
      {activities.map((activity) => (
        <ActivityCard
          active={activity.id === activeId}
          activity={activity}
          key={activity.id}
          onSelect={onSelectActivity}
        />
      ))}
    </div>
  </aside>
);
