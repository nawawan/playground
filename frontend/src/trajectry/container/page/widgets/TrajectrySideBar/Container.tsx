import { TrajectrySideBar } from "../../../../presentation/components/trajectry_side_bar/TrajectrySideBar";
import { useTrajectryPageState } from "../../state/useTrajectryPageState";

export const TrajectrySideBarContainer = () => {
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
