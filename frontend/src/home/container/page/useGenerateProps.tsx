import { useNavigate } from 'react-router-dom';
import React from 'react';

import { type HomePageProps } from '../../presentation/page/HomePage';
import { LoginDialogContainer } from './widgets/LoginDialog/Container';

export const useGenerateProps = (): HomePageProps => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    return {
        contents: [
            { id: 'maze', title: 'Maze Creator', description: '迷路作成するやつ' },
            { id: 'blogs', title: 'ブログ', description: '日々の出来事をつらつらと' },
        ],
        onContentClick: (id: string) => {
            navigate(`/${id}`);
        },
        onLoginClick: () => {
            setOpen(true);
        },
        LoginDialog: <LoginDialogContainer open={open} onClose={() => {setOpen(false)}} />,
    };
};

export default useGenerateProps;
