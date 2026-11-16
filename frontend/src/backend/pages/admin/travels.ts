import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import * as Sentry from '@sentry/cloudflare';
import { accessAuth } from '../../middleware/auth';
import { TrajectoryService } from '../../service/TrajectoryService';

const JWT_HEADER = "Cf-Access-Jwt-Assertion";

type Env = {
    API_URL: string;
    TEAM_DOMAIN: string;
    AUD: string;
};

const travels = new Hono<{ Bindings: Env }>();

// Authorization (admin role) is checked by the backend.
travels.post("/",
    accessAuth,
    zValidator('json', z.object({ name: z.string().trim().min(1).max(100) })),
    async (c) => {
        const { name } = c.req.valid('json');
        const jwt = c.req.header(JWT_HEADER) ?? "";
        try {
            return c.json(await TrajectoryService.createTravel(c.env.API_URL, jwt, name));
        } catch (e) {
            Sentry.captureException("Failed to create travel: " + (e instanceof Error ? e.message : String(e)));
            return c.json({ error: 'Failed to create travel' }, 502);
        }
    });

export default travels;
