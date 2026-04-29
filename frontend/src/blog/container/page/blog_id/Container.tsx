import { Blog } from "../../../presentation/page/blog_id/Blog";
import useGenerateProps from "./useGenerateProps";

const BlogContainer = () => {
    const generatedProps = useGenerateProps();
    return <Blog {...generatedProps} />;
}

export default BlogContainer;