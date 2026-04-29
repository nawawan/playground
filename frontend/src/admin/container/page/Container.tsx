import AdminHome from "../../presentation/page/AdminHome";
import useGenerateProps from "./useGenerateProps";

import { checkAuthorizedUser } from "../../../helper/CheckUser";
import { Unauthorized } from "../../../errors/Unauthorized";


export const AdminHomeContainer = () => {
    if (!checkAuthorizedUser()) {
        return <Unauthorized />;
    }
    const generatedProps = useGenerateProps();
    return <AdminHome {...generatedProps} />;
};

export default AdminHomeContainer;