import { useContext } from "react";
import { TrajectryPageStateContext } from "./TrajectryPageStateContext";

export const useTrajectryPageState = () => {
  const context = useContext(TrajectryPageStateContext);
  if (!context) {
    throw new Error("useTrajectryPageState must be used within TrajectryPageStateProvider");
  }
  return context;
};
