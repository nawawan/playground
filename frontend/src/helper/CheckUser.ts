// 認証済み(ログインユーザー)は管理者しかいない。
// そのため、JWTがないユーザだけ弾く
export  const checkAuthorizedUser = () => {
    try {
        const cfToken = document.cookie
            .split(';')
            .map(c => c.trim())
            .find(c => c.startsWith('CF_Authorization='))
            ?.split('=')[1];

       return !!cfToken;
    } catch {
        return false;
    }
}