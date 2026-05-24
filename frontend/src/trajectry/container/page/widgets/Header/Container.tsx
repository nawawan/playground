import { Header } from "../../../../presentation/components/header/Header";
import { useTrajectryPageState } from "../../state/useTrajectryPageState";

export const HeaderContainer = () => {
  const { onOpenUpload } = useTrajectryPageState();

  return <Header onUpload={onOpenUpload} />;
};
