// 認証済みは管理者しかいない
export const checkAuthorizedUser = () => {
    try {
        const token = document.cookie;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return !!payload.email;
    } catch {
        return false;
    }
}