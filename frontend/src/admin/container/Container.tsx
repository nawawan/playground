import AdminHome from "../presentation/AdminHome";
import useGenerateProps from "./useGenerateProps";


export const AdminHomeContainer = () => {
    const generatedProps = useGenerateProps();
    return <AdminHome {...generatedProps} />;
};