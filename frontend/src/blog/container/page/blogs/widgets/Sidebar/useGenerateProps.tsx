import { useNavigate } from "react-router-dom";
import { type SidebarProps } from "../../../../../presentation/Sidebar/Sidebar";



export const useGenerateProps = (): SidebarProps => {
    const navigate = useNavigate();
    // 本当はDBからブログを取得する想定だが、一旦決め打ちで年月を返す
    return {
        years: ["2026", "2025", "2024"],
        additionalYears: ["2023", "2022", "2021"],
        onClickHome: () => {
            navigate("/");
        },
        onClickGitHub: () => {
            window.open("https://github.com/nawawan", "_blank");
        },
        onClickX: () => {
            window.open("https://x.com/nawawan_kpr", "_blank");
        }
    }
}