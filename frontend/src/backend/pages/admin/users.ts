import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import * as Sentry from '@sentry/cloudflare';
import { accessAuth } from '../../middleware/auth';
import { UserService } from '../../service/UserService';

const JWT_HEADER = "Cf-Access-Jwt-Assertion";

type Env = {
    API_URL: string;
    TEAM_DOMAIN: string;
    AUD: string;
};

const users = new Hono<{ Bindings: Env }>();

const updateUserSchema = z.object({
    thumbnail: z.string().max(2048).nullable(),
    summary: z.string().max(10000).nullable(),
    place: z.string().max(100).nullable(),
});

// 更新対象は JWT のユーザー自身。実際の権限チェックは backend (update_user) で行う
users.put('/', accessAuth, zValidator('json', updateUserSchema), async (c) => {
    const jwt = c.req.header(JWT_HEADER) ?? "";
    const body = c.req.valid('json');

    try {
        const user = await UserService.updateUser(c.env.API_URL, jwt, body);
        return c.json(user);
    } catch (e) {
        Sentry.captureException(e);
        return c.json({ error: 'Failed to update user' }, 502);
    }
});

export default users;
