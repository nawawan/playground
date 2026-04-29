// 認証済み(ログインユーザー)は管理者しかいない。
// そのため、JWTがないユーザだけ弾く
export const CheckAuthorizedUser = () => {
    try {

        console.log('document.cookie', document.cookie);
        const cfToken = document.cookie
            .split(';')
            .map(c => c.trim())
            .find(c => c.startsWith('CF_Authorization='))
            ?.split('=')[1];

        console.log('cfToken', cfToken);
        return !!cfToken;
    } catch {
        return false;
    }
}