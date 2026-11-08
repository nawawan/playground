import { Box, CircularProgress } from "@mui/material";
import AdminProfile from "../../../presentation/page/AdminProfile";
import useGenerateProps from "./useGenerateProps";

export const AdminProfileContainer = () => {
    const { isLoading, ...generatedProps } = useGenerateProps();
    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    return <AdminProfile {...generatedProps} />;
};

export default AdminProfileContainer;
