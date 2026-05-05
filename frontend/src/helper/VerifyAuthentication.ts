import type { HonoRequest } from 'hono';
import { createRemoteJWKSet, jwtVerify } from 'jose';

export const verifyAuthn = async (req: HonoRequest, env: { TEAM_DOMAIN: string; AUD: string }) : Promise<boolean> => {
    const jwt = req.header('CF_Authorization');
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