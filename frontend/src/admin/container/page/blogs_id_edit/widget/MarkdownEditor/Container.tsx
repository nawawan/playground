import { Box, CircularProgress } from '@mui/material';
import MarkdownEditor from '../../../../../../presentation/widgets/MarkdownEditor/MarkdownEditor';
import useGenerateProps from './useGenerateProps';

type Props = {
    article_id: string;
};

const Container = (props: Props) => {
    const { loaded, ...generatedProps } = useGenerateProps(props.article_id);
    if (!loaded) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
        </Box>
    );
    return <MarkdownEditor {...generatedProps} />;
};

export default Container;
