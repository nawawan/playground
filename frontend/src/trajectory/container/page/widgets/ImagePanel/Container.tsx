import { ImagePanel } from "../../../../presentation/components/image_panel/ImagePanel";
import { useTrajectoryPageState } from "../../state/useTrajectoryPageState";

export const ImagePanelContainer = () => {
  const { activeActivity, activePhotoId, here, onSelectPhoto } = useTrajectoryPageState();

  if (!activeActivity) return null;

  return (
    <ImagePanel
      activePhotoId={activePhotoId}
      activity={activeActivity}
      here={here}
      onPhotoSelect={onSelectPhoto}
    />
  );
};
