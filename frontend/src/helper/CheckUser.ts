// 認証済み(ログインユーザー)は管理者しかいない。
// CF_Authorization は HttpOnly のため JS から読めないので /cdn-cgi/access/get-identity で検証する
let _cached: boolean | null = null;

export const CheckAuthorizedUser = async (): Promise<boolean> => {
    if (_cached !== null) return _cached;
    try {
        const res = await fetch('/cdn-cgi/access/get-identity');
        _cached = res.ok;
    } catch {
        _cached = false;
    }
    return _cached;
};
