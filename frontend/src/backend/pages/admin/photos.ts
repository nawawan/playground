import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import * as Sentry from '@sentry/cloudflare';
import { accessAuth } from '../../middleware/auth';
import { TrajectoryService, UpstreamError } from '../../service/TrajectoryService';

const JWT_HEADER = "Cf-Access-Jwt-Assertion";

type Env = {
    API_URL: string;
    TEAM_DOMAIN: string;
    AUD: string;
};

const idParam = z.object({ id: z.string().regex(/^\d+$/) });

const photos = new Hono<{ Bindings: Env }>();

// Authorization (admin role) is checked by the backend.
photos.patch("/:id",
    accessAuth,
    zValidator('param', idParam),
    zValidator('json', z.object({ distance_m: z.number().finite().min(0) })),
    async (c) => {
        const { id } = c.req.valid('param');
        const { distance_m } = c.req.valid('json');
        const jwt = c.req.header(JWT_HEADER) ?? "";
        try {
            return c.json(await TrajectoryService.placePhoto(c.env.API_URL, jwt, id, distance_m));
        } catch (e) {
            if (e instanceof UpstreamError && (e.status === 403 || e.status === 404)) {
                return c.json({ error: e.status === 404 ? 'Not Found' : 'Forbidden' }, e.status);
            }
            Sentry.captureException("Failed to place photo: " + (e instanceof Error ? e.message : String(e)));
            return c.json({ error: 'Failed to place photo' }, 502);
        }
    });

photos.delete("/:id",
    accessAuth,
    zValidator('param', idParam),
    async (c) => {
        const { id } = c.req.valid('param');
        const jwt = c.req.header(JWT_HEADER) ?? "";
        try {
            await TrajectoryService.deletePhoto(c.env.API_URL, jwt, id);
            return c.body(null, 204);
        } catch (e) {
            if (e instanceof UpstreamError && (e.status === 403 || e.status === 404)) {
                return c.json({ error: e.status === 404 ? 'Not Found' : 'Forbidden' }, e.status);
            }
            Sentry.captureException("Failed to delete photo: " + (e instanceof Error ? e.message : String(e)));
            return c.json({ error: 'Failed to delete photo' }, 502);
        }
    });

export default photos;
