import { Outlet } from "react-router-dom";
import Unauthorized from "../errors/Unauthorized";
import { CheckAuthorizedUser } from "../helper/CheckUser";

export const RequireAuth = () => {
    const isAuthorized = CheckAuthorizedUser();

    console.log('isAuthorized', isAuthorized);

    if (!isAuthorized) {
        return <Unauthorized />;
    }
    return <Outlet />;
};