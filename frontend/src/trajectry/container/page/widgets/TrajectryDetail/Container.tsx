import { TrajectryDetail } from "../../../../presentation/components/trajectry_detail/TrajectryDetail";
import { useTrajectryPageState } from "../../state/useTrajectryPageState";

export const TrajectryDetailContainer = () => {
  const { activeActivity } = useTrajectryPageState();

  return <TrajectryDetail activity={activeActivity} />;
};
