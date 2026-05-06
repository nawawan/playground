import BlogEdit from '../../../presentation/page/edit_id/BlogEdit';
import useGenerateProps from './useGenerateProps';

const BlogEditContainer = () => {
    const generatedProps = useGenerateProps();
    return <BlogEdit {...generatedProps} />;
};

export default BlogEditContainer;
