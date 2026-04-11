import { type LoginDialogProps } from "../../../../../presentation/widgets/LoginDialog/LoginDialog";
export type DialogProps = {
    open: boolean,
    onClose: () => void,
}

export const useGenerateProps = (props: DialogProps): LoginDialogProps => {
    const { open, onClose } = props;
    return {
        open: open,
        onClose: onClose,
        onLogin: (username: string, password: string) => {
            alert(`ログイン機能はまだ実装されていません。入力されたユーザー名: ${username}, パスワード: ${password}`);
            // navigate('/admin');
        },
    };
};