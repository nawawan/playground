import { type HomePageProps } from '../../presentation/page/HomePage';
import { useNavigate } from 'react-router-dom';

export const useGenerateProps = (): HomePageProps => {
    const navigate = useNavigate();
    return {
        contents: [
            { id: 'maze', title: 'Maze Creator', description: '迷路作成するやつ' },
            { id: 'blogs', title: 'ブログ', description: '日々の出来事をつらつらと' },
        ],
        onContentClick: (id: string) => {
            if (id === 'blogs') {
                window.location.href = '/blogs';
            } else {
                navigate(`/${id}`);
            }
        },
        onLoginClick: () => {
            alert('ログイン機能はまだ実装されていません。');
        }
    };
};

export default useGenerateProps;