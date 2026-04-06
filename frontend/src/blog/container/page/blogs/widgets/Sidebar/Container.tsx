import Sidebar from "../../../../../presentation/Sidebar/Sidebar";

import { useGenerateProps } from "./useGenerateProps";


export const SidebarContainer = () => {
    const generatedProps = useGenerateProps();
    return <Sidebar {...generatedProps} />;
}