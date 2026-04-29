import { Outlet } from "react-router-dom";
import Unauthorized from "../errors/Unauthorized";
import { checkAuthorizedUser } from "../helper/CheckUser";

export const RequireAuth = () => {
    const isAuthorized = checkAuthorizedUser();

    if (!isAuthorized) {
        return <Unauthorized />;
    }
    return <Outlet />;
};