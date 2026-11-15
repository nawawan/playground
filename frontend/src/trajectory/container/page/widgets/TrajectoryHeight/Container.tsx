import { TrajectoryHeight } from "../../../../presentation/components/trajectory_height/TrajectoryHeight";
import { useTrajectoryPageState } from "../../state/useTrajectoryPageState";

export const TrajectoryHeightContainer = () => {
  const { activeActivity, activePhotoId, here, placingPhotoId, onCancelPlacing, onHereChange, onPlacePhoto, onSelectPhoto } =
    useTrajectoryPageState();

  if (!activeActivity) return null;

  return (
    <TrajectoryHeight
      activePhotoId={activePhotoId}
      activity={activeActivity}
      here={here}
      onCancelPlacing={onCancelPlacing}
      onHereChange={onHereChange}
      onPhotoSelect={onSelectPhoto}
      onPlacePhoto={(at) => void onPlacePhoto(at)}
      placingPhotoId={placingPhotoId}
    />
  );
};
