import AdminHome from "../../presentation/page/AdminHome";
import useGenerateProps from "./useGenerateProps";


export const AdminHomeContainer = () => {
    const generatedProps = useGenerateProps();
    return <AdminHome {...generatedProps} />;
};

export default AdminHomeContainer;