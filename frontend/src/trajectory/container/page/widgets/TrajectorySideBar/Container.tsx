import { useMemo, useState } from "react";
import { NewTravelDialog } from "../../../../presentation/components/trajectory_side_bar/NewTravelDialog";
import { TrajectorySideBar } from "../../../../presentation/components/trajectory_side_bar/TrajectorySideBar";
import { buildYearGroups } from "../../../../domain/entries";
import { useTrajectoryPageState } from "../../state/useTrajectoryPageState";
import { useGenerateProps } from "./useGenerateProps";

type TrajectorySideBarContainerProps = {
  canUpload: boolean;
};

export const TrajectorySideBarContainer = ({ canUpload }: TrajectorySideBarContainerProps) => {
  useGenerateProps();
  const { activities, travels, activeId, onCreateTravel, onOpenUpload, onSelectActivity, onSelectTravel } =
    useTrajectoryPageState();
  const [newTravelOpen, setNewTravelOpen] = useState(false);
  const groups = useMemo(() => buildYearGroups(activities, travels), [activities, travels]);

  return (
    <>
      <TrajectorySideBar
        activeId={activeId}
        canEdit={canUpload}
        groups={groups}
        onNewTravel={() => setNewTravelOpen(true)}
        onSelectActivity={onSelectActivity}
        onSelectTravel={onSelectTravel}
        onUpload={onOpenUpload}
        totalCount={activities.length}
      />
      {canUpload && (
        <NewTravelDialog onClose={() => setNewTravelOpen(false)} onCreate={onCreateTravel} open={newTravelOpen} />
      )}
    </>
  );
};
