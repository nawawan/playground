import { useNavigate } from "react-router-dom";
import { CheckAuthorizedUser } from "../../../helper/CheckUser";
import type { SiteFooterProps } from "./SiteFooter";

export const useGenerateProps = (): SiteFooterProps => {
  const navigate = useNavigate();
  return {
    year: new Date().getFullYear(),
    onAdminClick: async () => {
      const isAuthorized = await CheckAuthorizedUser();
      if (isAuthorized) {
        navigate("/admin");
      } else {
        window.location.href = "/admin";
      }
    },
  };
};
