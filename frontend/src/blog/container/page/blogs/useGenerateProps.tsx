import { type BlogTopProps } from "../../../presentation/page/blogs/BlogTop";

import EntryCardsContainer from "./widgets/EntryCards/Container";
import SidebarContainer from "./widgets/Sidebar/Container";

export const useGenerateProps = () : BlogTopProps => {
    return {
        blogEntries: <EntryCardsContainer />,
        sidebar: <SidebarContainer />,
    }
}