import { TrajectoryDetail } from "../../../../presentation/components/trajectory_detail/TrajectoryDetail";
import { useTrajectoryPageState } from "../../state/useTrajectoryPageState";

export const TrajectoryDetailContainer = () => {
  const { activeActivity } = useTrajectoryPageState();

  if (!activeActivity) return null;

  return <TrajectoryDetail activity={activeActivity} />;
};
