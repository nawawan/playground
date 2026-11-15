import { useState } from "react";
import { TrajectoryDetail } from "../../../../presentation/components/trajectory_detail/TrajectoryDetail";
import { summarizeTravel, travelIdOfSelection } from "../../../../domain/travel";
import { useTrajectoryPageState } from "../../state/useTrajectoryPageState";

type TrajectoryDetailContainerProps = {
  canUpload: boolean;
};

export const TrajectoryDetailContainer = ({ canUpload }: TrajectoryDetailContainerProps) => {
  const { activeActivity, activeId, activities, travels, viewMode, onChangeTravel } = useTrajectoryPageState();
  const [saving, setSaving] = useState(false);

  if (!activeActivity) return null;

  const endDate =
    viewMode === "travel"
      ? summarizeTravel(activities.filter((activity) => activity.travelId === travelIdOfSelection(activeId))).endDate
      : undefined;

  return (
    <TrajectoryDetail
      activity={activeActivity}
      busy={saving}
      canEdit={canUpload && viewMode === "single"}
      endDate={endDate}
      onChangeTravel={async (activityId, travelId) => {
        setSaving(true);
        try {
          await onChangeTravel(activityId, travelId);
        } catch {
          // reported by the state; the select keeps showing the stored value
        } finally {
          setSaving(false);
        }
      }}
      travels={travels}
    />
  );
};
