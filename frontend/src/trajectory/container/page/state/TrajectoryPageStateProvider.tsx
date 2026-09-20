import type { ReactNode } from "react";
import { useGenerateTrajectoryPageProps } from "../useGenerateProps";
import { TrajectoryPageStateContext } from "./TrajectoryPageStateContext";

export const TrajectoryPageStateProvider = ({ children }: { children: ReactNode }) => {
  const state = useGenerateTrajectoryPageProps();

  return <TrajectoryPageStateContext.Provider value={state}>{children}</TrajectoryPageStateContext.Provider>;
};
