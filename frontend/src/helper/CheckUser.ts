// 認証済みは管理者しかいない
export const checkAuthorizedUser = () => {
    const token = document.cookie;
    const payload = JSON.parse(token.split('.')[1]);

    if (payload.email) {
        return true;
    }
    return false;
}