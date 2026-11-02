import { useContext } from "react";
import { TrajectoryPageStateContext } from "./TrajectoryPageStateContext";

export const useTrajectoryPageState = () => {
  const context = useContext(TrajectoryPageStateContext);
  if (!context) {
    throw new Error("useTrajectoryPageState must be used within TrajectoryPageStateProvider");
  }
  return context;
};
