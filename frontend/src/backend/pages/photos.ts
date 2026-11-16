import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import * as Sentry from '@sentry/cloudflare';
import { TrajectoryService } from '../service/TrajectoryService';

type Env = {
    API_URL: string;
};

const photos = new Hono<{ Bindings: Env }>();

photos.get("/",
    zValidator('query', z.object({ activity_id: z.string().regex(/^\d+$/).optional() })),
    async (c) => {
        const { activity_id } = c.req.valid('query');
        try {
            return c.json(await TrajectoryService.listPhotos(c.env.API_URL, activity_id));
        } catch (e) {
            Sentry.captureException("Failed to list photos: " + (e instanceof Error ? e.message : String(e)));
            throw e;
        }
    });

export default photos;
