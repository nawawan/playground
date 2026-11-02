import { TrajectorySideBar } from "../../../../presentation/components/trajectory_side_bar/TrajectorySideBar";
import { useTrajectoryPageState } from "../../state/useTrajectoryPageState";
import { useGenerateProps } from "./useGenerateProps";

type TrajectorySideBarContainerProps = {
  canUpload: boolean;
};

export const TrajectorySideBarContainer = ({ canUpload }: TrajectorySideBarContainerProps) => {
  useGenerateProps();
  const { activities, activeId, onOpenUpload, onSelectActivity } = useTrajectoryPageState();

  return (
    <TrajectorySideBar
      activeId={activeId}
      activities={activities}
      canUpload={canUpload}
      onSelectActivity={onSelectActivity}
      onUpload={onOpenUpload}
    />
  );
};
