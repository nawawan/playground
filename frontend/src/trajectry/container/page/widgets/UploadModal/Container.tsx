import { UploadModal } from "../../../../presentation/components/upload_modal/UploadModal";
import { useTrajectryPageState } from "../../state/useTrajectryPageState";

export const UploadModalContainer = () => {
  const { onCloseUpload, uploadOpen } = useTrajectryPageState();

  return <UploadModal onClose={onCloseUpload} open={uploadOpen} />;
};
