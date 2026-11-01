import { CssBaseline, ThemeProvider } from "@mui/material";

import { BlogTop } from "../../../presentation/page/blogs/BlogTop";
import { theme } from "../../../../presentation/theme/theme";

import { useGenerateProps } from "./useGenerateProps";

export const BlogTopContainer = () => {
    const generatedProps = useGenerateProps();
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BlogTop {...generatedProps} />
        </ThemeProvider>
    );
};
