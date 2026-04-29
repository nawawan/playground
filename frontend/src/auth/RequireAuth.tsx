import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Unauthorized from "../errors/Unauthorized";
import { CheckAuthorizedUser } from "../helper/CheckUser";

export const RequireAuth = () => {
    const [state, setState] = useState<"loading" | "authorized" | "unauthorized">("loading");

    useEffect(() => {
        CheckAuthorizedUser().then(ok => setState(ok ? "authorized" : "unauthorized"));
    }, []);

    if (state === "loading") return null;
    if (state === "unauthorized") return <Unauthorized />;
    return <Outlet />;
};
