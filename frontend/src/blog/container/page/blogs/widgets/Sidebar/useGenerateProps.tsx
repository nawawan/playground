import { GITHUB_URL, X_URL } from "../../../../../../shared/constants/links";
import { type SidebarProps } from "../../../../../presentation/Sidebar/Sidebar";

export const useGenerateProps = (): SidebarProps => {
    // 本当はDBからブログを取得する想定だが、一旦決め打ちで年月を返す
    return {
        years: ["2026", "2025", "2024"],
        additionalYears: ["2023", "2022", "2021"],
        onClickHome: () => {
            window.location.href = "/";
        },
        onClickGitHub: () => {
            window.open(GITHUB_URL, "_blank");
        },
        onClickX: () => {
            window.open(X_URL, "_blank");
        }
    }
}