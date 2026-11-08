import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import * as Sentry from '@sentry/cloudflare';
import { UserService } from '../service/UserService';

type Env = {
    API_URL: string;
};

const users = new Hono<{ Bindings: Env }>();

users.get('/:name',
    zValidator('param', z.object({ name: z.string() })),
    async (c) => {
    const { name } = c.req.valid('param');

    const user = await UserService.getUser(c.env.API_URL, name).catch((e) => {
        Sentry.captureException(e);
        return null;
    });
    if (!user) {
        return c.json({ error: 'Not Found' }, 404);
    }
    return c.json(user);
});

export default users;
