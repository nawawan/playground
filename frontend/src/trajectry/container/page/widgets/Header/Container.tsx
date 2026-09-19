import { Header } from "../../../../presentation/components/header/Header";
import { useTrajectryPageState } from "../../state/useTrajectryPageState";

type HeaderContainerProps = {
  canUpload: boolean;
};

export const HeaderContainer = ({ canUpload }: HeaderContainerProps) => {
  const { onOpenUpload } = useTrajectryPageState();

  return <Header canUpload={canUpload} onUpload={onOpenUpload} />;
};
