import  HomePage  from '../../presentation/page/HomePage';
import { useGenerateProps } from './useGenerateProps';

export const HomePageContainer = () => {
    const generatedProps = useGenerateProps();
    return <HomePage {...generatedProps} />;
};

export default HomePageContainer;