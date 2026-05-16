import { useParams } from 'react-router-dom';
import type { EditBlogProps } from '../../../presentation/page/edit_id/BlogEdit';
import MarkdownEditorContainer from './widget/MarkdownEditor/Container';

const useGenerateProps = (): EditBlogProps => {
    const { blog_id } = useParams<{ blog_id: string }>();
    return {
        Editor: <MarkdownEditorContainer article_id={blog_id ?? ""} />,
    };
};

export default useGenerateProps;
