import { useNavigate } from "react-router-dom";
import { type EntryCardProps } from "../../../../../presentation/EntryCards/EntryCard";

export const useGenerateProps = (): EntryCardProps => {
    const navigate  = useNavigate();

    // 一旦ダミーデータを返すが、将来的にはAPIからデータを取得する想定
    return {
        posts: [
            {
                id: "1",
                title: "ブログエントリー1",
                outline: "ブログエントリー1の概要"
            },
            {
                id: "2",
                title: "ブログエントリー2",
                outline: "ブログエントリー2の概要"
            },
            {
                id: "3",
                title: "ブログエントリー3",
                outline: "ブログエントリー3の概要"
            }
        ],
        onClick: (id: string) => {
            navigate(`/blogs/${id}`);
        }
    }
}