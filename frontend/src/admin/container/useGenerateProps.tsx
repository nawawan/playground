import { type AdminHomeProps } from "../presentation/AdminHome";
export const useGenerateProps = (): AdminHomeProps => {
    // 本来はAPIからpost一覧を取得するが、一旦ダミーデータを返す
    return {
        posts: [
            { id: '1', title: '初めてのブログ', date: '2024-01-01' },
            { id: '2', title: 'Reactの勉強', date: '2024-02-01' },
        ],
        onWriteClick: () => {
            alert('ブログ投稿機能はまだ実装されていません。');
        },
        onPostClick: (id: string) => {
            alert(`ブログID ${id} がクリックされましたが、詳細表示機能はまだ実装されていません。`);
        }
    }
};

export default useGenerateProps;