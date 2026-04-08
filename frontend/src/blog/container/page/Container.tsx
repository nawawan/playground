
import { BlogTop } from "../../presentation/page/blogs/BlogTop";

import { useGenerateProps } from "./blogs/useGenerateProps";

export const BlogTopContainer = () => {
    const generatedProps = useGenerateProps();
    return <BlogTop {...generatedProps} />;
}