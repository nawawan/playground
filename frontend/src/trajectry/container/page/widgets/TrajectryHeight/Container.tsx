import { TrajectryHeight } from "../../../../presentation/components/trajectry_height/TrajectryHeight";
import { useTrajectryPageState } from "../../state/useTrajectryPageState";

export const TrajectryHeightContainer = () => {
  const { activeActivity, activePhotoId, here, onHereChange, onSelectPhoto } = useTrajectryPageState();

  return (
    <TrajectryHeight
      activePhotoId={activePhotoId}
      activity={activeActivity}
      here={here}
      onHereChange={onHereChange}
      onPhotoSelect={onSelectPhoto}
    />
  );
};
