import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import * as Sentry from '@sentry/cloudflare';
import { TrajectoryService, UpstreamError } from '../service/TrajectoryService';

type Env = {
    API_URL: string;
};

const activities = new Hono<{ Bindings: Env }>();

activities.get("/", async (c) => {
    const activityResponse = await TrajectoryService.listActivities(c.env.API_URL)
        .catch((e) => {
            Sentry.captureException("Failed to list activities: " + (e instanceof Error ? e.message : String(e)));
            throw new Error("Failed to list activities: " + (e instanceof Error ? e.message : String(e)));
        });

    return c.json(activityResponse);
});

activities.get("/:id/trajectory",
    zValidator('param', z.object({ id: z.string() })),
    zValidator('query', z.object({ lod: z.string().optional() })),
    async (c) => {
        const { id } = c.req.valid('param');
        const { lod } = c.req.valid('query');

        try {
            return c.json(await TrajectoryService.getActivityTrajectory(c.env.API_URL, id, lod));
        } catch (e) {
            if (e instanceof UpstreamError && (e.status === 400 || e.status === 404)) {
                return c.json({ error: e.status === 404 ? 'Not Found' : 'Bad Request' }, e.status);
            }
            Sentry.captureException("Failed to get activity trajectory: " + (e instanceof Error ? e.message : String(e)));
            throw e;
        }
    });

export default activities;
