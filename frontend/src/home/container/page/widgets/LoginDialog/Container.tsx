import { LoginDialog } from "../../../../../presentation/widgets/LoginDialog/LoginDialog";

import { useGenerateProps, type DialogProps } from "./useGenerateProps";



export const LoginDialogContainer = (props: DialogProps) => {
    const generatedProps = useGenerateProps(props);
    return <LoginDialog {...generatedProps} />;
}