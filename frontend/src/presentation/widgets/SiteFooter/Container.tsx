import SiteFooter from "./SiteFooter";
import { useGenerateProps } from "./useGenerateProps";

export const SiteFooterContainer = () => {
  const generatedProps = useGenerateProps();
  return <SiteFooter {...generatedProps} />;
};

export default SiteFooterContainer;
