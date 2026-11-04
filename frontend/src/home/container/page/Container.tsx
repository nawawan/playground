import { CssBaseline, ThemeProvider } from '@mui/material';
import HomePage from '../../presentation/page/HomePage';
import { theme } from '../../../presentation/theme/theme';
import { useGenerateProps } from './useGenerateProps';

export const HomePageContainer = () => {
    const generatedProps = useGenerateProps();
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <HomePage {...generatedProps} />
        </ThemeProvider>
    );
};

export default HomePageContainer;
