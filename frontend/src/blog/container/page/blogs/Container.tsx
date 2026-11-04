import { CssBaseline, ThemeProvider } from "@mui/material";

import { BlogTop } from "../../../presentation/page/blogs/BlogTop";
import { theme } from "../../../../presentation/theme/theme";
import { type BlogResponse } from "../../../../shared/types/blog";

import { useGenerateProps } from "./useGenerateProps";

type Props = {
    initialBlogs?: BlogResponse[];
};

export const BlogTopContainer = (props: Props) => {
    const generatedProps = useGenerateProps(props.initialBlogs);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BlogTop {...generatedProps} />
        </ThemeProvider>
    );
};
