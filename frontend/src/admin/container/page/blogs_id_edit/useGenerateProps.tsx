import { useParams, useSearchParams } from 'react-router-dom';
import type { EditBlogProps } from '../../../presentation/page/edit_id/BlogEdit';
import MarkdownEditorContainer from './widget/MarkdownEditor/Container';

const useGenerateProps = (): EditBlogProps => {
    const { blogId } = useParams<{ blogId: string }>();
    const searchParam = useSearchParams()[0];
    const title = searchParam.get('title');
    return {
        Editor: <MarkdownEditorContainer article_id={blogId ?? ""} title={title ?? undefined}/>,
    };
};

export default useGenerateProps;
