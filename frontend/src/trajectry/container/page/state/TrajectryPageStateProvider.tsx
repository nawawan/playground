import type { ReactNode } from "react";
import { useGenerateTrajectryPageProps } from "../useGenerateProps";
import { TrajectryPageStateContext } from "./TrajectryPageStateContext";

export const TrajectryPageStateProvider = ({ children }: { children: ReactNode }) => {
  const state = useGenerateTrajectryPageProps();

  return <TrajectryPageStateContext.Provider value={state}>{children}</TrajectryPageStateContext.Provider>;
};
