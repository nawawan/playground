import { Header } from "../../../../presentation/components/header/Header";
import { useTrajectoryPageState } from "../../state/useTrajectoryPageState";

type HeaderContainerProps = {
  canUpload: boolean;
};

export const HeaderContainer = ({ canUpload }: HeaderContainerProps) => {
  const { onOpenUpload } = useTrajectoryPageState();

  return <Header canUpload={canUpload} onUpload={onOpenUpload} />;
};
