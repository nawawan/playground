
import { BlogTop } from "../../presentation/page/blogs/BlogTop";

import { useGenerateProps } from "./useGenerateProps";

export const BlogTopContainer = () => {
    const generatedProps = useGenerateProps();
    return <BlogTop {...generatedProps} />;
}