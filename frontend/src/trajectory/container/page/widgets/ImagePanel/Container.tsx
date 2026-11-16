import { ImagePanel } from "../../../../presentation/components/image_panel/ImagePanel";
import { useTrajectoryPageState } from "../../state/useTrajectoryPageState";

type ImagePanelContainerProps = {
  canUpload: boolean;
};

export const ImagePanelContainer = ({ canUpload }: ImagePanelContainerProps) => {
  const {
    activeActivity,
    activePhotoId,
    here,
    photoUpload,
    placingPhotoId,
    viewMode,
    onCancelPlacing,
    onDeletePhoto,
    onSelectPhoto,
    onStartPlacing,
    onUploadPhotos,
  } = useTrajectoryPageState();

  if (!activeActivity) return null;

  return (
    <ImagePanel
      activePhotoId={activePhotoId}
      activity={activeActivity}
      // Photos belong to one activity, so they are edited from the activity, not from a travel.
      canEdit={canUpload && viewMode === "single"}
      here={here}
      onCancelPlacing={onCancelPlacing}
      onDeletePhoto={(photoId) => void onDeletePhoto(photoId)}
      onPhotoSelect={onSelectPhoto}
      onStartPlacing={onStartPlacing}
      onUploadFiles={(files, timeZone) => void onUploadPhotos(files, timeZone)}
      placingPhotoId={placingPhotoId}
      uploadStatus={photoUpload}
    />
  );
};
