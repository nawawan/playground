// 認証済みは管理者しかいない
export const checkAuthorizedUser = () => {
    try {
        const cfToken = document.cookie
            .split(';')
            .map(c => c.trim())
            .find(c => c.startsWith('CF_Authorization='))
            ?.split('=')[1];

        if (!cfToken) return false;

        // JWT payload は base64url エンコードなので standard base64 に変換
        const base64 = cfToken.split('.')[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/')
            .padEnd(Math.ceil(cfToken.split('.')[1].length / 4) * 4, '=');

        const payload = JSON.parse(atob(base64));
        return !!payload.email;
    } catch {
        return false;
    }
}