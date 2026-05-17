import { useParams } from 'react-router-dom';
import type { EditBlogProps } from '../../../presentation/page/edit_id/BlogEdit';
import MarkdownEditorContainer from './widget/MarkdownEditor/Container';

const useGenerateProps = (): EditBlogProps => {
    const { blogId } = useParams<{ blogId: string }>();
    console.log("blogId :" + blogId);
    return {
        Editor: <MarkdownEditorContainer article_id={blogId ?? ""} />,
    };
};

export default useGenerateProps;
