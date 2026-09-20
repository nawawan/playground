import { TrajectoryHeight } from "../../../../presentation/components/trajectory_height/TrajectoryHeight";
import { useTrajectoryPageState } from "../../state/useTrajectoryPageState";

export const TrajectoryHeightContainer = () => {
  const { activeActivity, activePhotoId, here, onHereChange, onSelectPhoto } = useTrajectoryPageState();

  if (!activeActivity) return null;

  return (
    <TrajectoryHeight
      activePhotoId={activePhotoId}
      activity={activeActivity}
      here={here}
      onHereChange={onHereChange}
      onPhotoSelect={onSelectPhoto}
    />
  );
};
