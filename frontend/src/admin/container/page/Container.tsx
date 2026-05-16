import { Box, CircularProgress } from "@mui/material";
import AdminHome from "../../presentation/page/AdminHome";
import useGenerateProps from "./useGenerateProps";

export const AdminHomeContainer = () => {
    const { isLoading, ...generatedProps } = useGenerateProps();
    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    return <AdminHome {...generatedProps} />;
};

export default AdminHomeContainer;