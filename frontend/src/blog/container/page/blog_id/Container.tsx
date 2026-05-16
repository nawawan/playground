import { Box, CircularProgress } from "@mui/material";
import { Blog } from "../../../presentation/page/blog_id/Blog";
import useGenerateProps from "./useGenerateProps";

const BlogContainer = () => {
    const { isLoading, ...generatedProps } = useGenerateProps();
    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    return <Blog {...generatedProps} />;
}

export default BlogContainer;