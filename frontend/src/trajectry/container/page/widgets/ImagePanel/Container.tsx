import { ImagePanel } from "../../../../presentation/components/image_panel/ImagePanel";
import { useTrajectryPageState } from "../../state/useTrajectryPageState";

export const ImagePanelContainer = () => {
  const { activeActivity, activePhotoId, here, onSelectPhoto } = useTrajectryPageState();

  return (
    <ImagePanel
      activePhotoId={activePhotoId}
      activity={activeActivity}
      here={here}
      onPhotoSelect={onSelectPhoto}
    />
  );
};
