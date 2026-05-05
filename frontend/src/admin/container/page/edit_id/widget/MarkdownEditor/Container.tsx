import MarkdownEditor from '../../../../../../presentation/widgets/MarkdownEditor/MarkdownEditor';
import useGenerateProps from './useGenerateProps';

type Props = {
    article_id: string;
};

const Container = (props: Props) => {
    const generatedProps = useGenerateProps(props.article_id);
    return <MarkdownEditor {...generatedProps} />;
};

export default Container;
