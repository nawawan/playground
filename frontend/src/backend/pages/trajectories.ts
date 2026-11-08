import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import * as Sentry from '@sentry/cloudflare';
import { TrajectoryService, UpstreamError } from '../service/TrajectoryService';

type Env = {
    API_URL: string;
};

const trajectories = new Hono<{ Bindings: Env }>();

trajectories.get("/",
    zValidator('query', z.object({ lod: z.string().optional(), bbox: z.string().optional() })),
    async (c) => {
        const { lod, bbox } = c.req.valid('query');

        try {
            return c.json(await TrajectoryService.listTrajectories(c.env.API_URL, lod, bbox));
        } catch (e) {
            if (e instanceof UpstreamError && e.status === 400) {
                return c.json({ error: 'Bad Request' }, 400);
            }
            Sentry.captureException("Failed to list trajectories: " + (e instanceof Error ? e.message : String(e)));
            throw e;
        }
    });

export default trajectories;
