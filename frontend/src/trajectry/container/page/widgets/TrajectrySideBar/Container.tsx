import { TrajectrySideBar } from "../../../../presentation/components/trajectry_side_bar/TrajectrySideBar";
import { useTrajectryPageState } from "../../state/useTrajectryPageState";
import { useGenerateProps } from "./useGenerateProps";

export const TrajectrySideBarContainer = () => {
  useGenerateProps();
  const { activities, activeId, onOpenUpload, onSelectActivity } = useTrajectryPageState();

  return (
    <TrajectrySideBar
      activeId={activeId}
      activities={activities}
      onSelectActivity={onSelectActivity}
      onUpload={onOpenUpload}
    />
  );
};
