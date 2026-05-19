import { createMiddleware } from 'hono/factory';
import { verifyAuthn } from '../../helper/VerifyAuthentication';

export const accessAuth = createMiddleware<{ Bindings: Env }>(async (c, next) => {
    const isAuthorized = await verifyAuthn(c.req, c.env);
    if (!isAuthorized) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    return next();
});