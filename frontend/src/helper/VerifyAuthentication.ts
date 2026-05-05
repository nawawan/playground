import { createRemoteJWKSet, jwtVerify } from 'jose';

const verifyAuthn = async (req: Request, env: Env) : Promise<boolean> => {
    const jwt = req.headers.get('CF_Authorization');
    if (!jwt) {
        return false;
    }

    const JWKS = createRemoteJWKSet(new URL(`https://${env.TEAM_DOMAIN}/cdn-cgi/access/certs`));

    try {
        await jwtVerify(jwt, JWKS, {
            issuer: `https://${env.TEAM_DOMAIN}/`,
            audience: env.AUD,
        });
        return true;
    } catch (e) {
        console.error('Error verifying authentication:', e);
        return false;
    }
};