import { useNavigate } from 'react-router-dom';

import { type HomePageProps } from '../../presentation/page/HomePage';

export const useGenerateProps = (): HomePageProps => {
    const navigate = useNavigate();
    return {
        contents: [
            { id: 'maze', title: 'Maze Creator', description: '迷路作成するやつ' },
            { id: 'blogs', title: 'ブログ', description: '日々の出来事をつらつらと' },
        ],
        onContentClick: (id: string) => {
            navigate(`/${id}`);
        },
        onAdminClick: () => {
            window.location.href = '/admin';
        },
    };
};

export default useGenerateProps;
