import { type AdminHomeProps } from "../../presentation/page/AdminHome";
import { useNavigate } from "react-router-dom";
export const useGenerateProps = (): AdminHomeProps => {
    const navigate = useNavigate();
    // 本来はAPIからpost一覧を取得するが、一旦ダミーデータを返す
    return {
        posts: [
            { id: '1', title: '初めてのブログ', date: '2024-01-01' },
            { id: '2', title: 'Reactの勉強', date: '2024-02-01' },
        ],
        onWriteClick: () => {
            navigate('/admin/edit');
        },
        onPostClick: (id: string) => {
            navigate(`/admin/edit/${id}`);
        }
    }
};

export default useGenerateProps;