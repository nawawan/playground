import { useParams } from 'react-router-dom';
import type { EditBlogProps } from '../../../presentation/page/edit_id/BlogEdit';
import MarkdownEditorContainer from './widget/MarkdownEditor/Container';

const useGenerateProps = (): EditBlogProps => {
    const { article_id } = useParams<{ article_id: string }>();
    return {
        Editor: <MarkdownEditorContainer article_id={article_id ?? ""} />,
    };
};

export default useGenerateProps;
