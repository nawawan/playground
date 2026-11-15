import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { TrajectoryService, UpstreamError } from '../../service/TrajectoryService';
import * as Sentry from '@sentry/cloudflare';
import { accessAuth } from '../../middleware/auth';

const JWT_HEADER = "Cf-Access-Jwt-Assertion";

type Env = {
    API_URL: string;
    TEAM_DOMAIN: string;
    AUD: string;
    PUBLIC_URL: string;
};

const activities = new Hono<{ Bindings: Env }>();

activities.post("/", accessAuth, async(c) => {
    if (!c.req.raw.body) {
        return c.json({ error: 'No gpx file provided' }, 400);
    }
    const apiUrl = c.env.API_URL;
    const jwt = c.req.header(JWT_HEADER) ?? "";
    const file = c.req.raw.body;

    const activityResponse = await TrajectoryService.uploadActivity(apiUrl, jwt, file)
        .catch((e) => {
            Sentry.captureException("Failed to upload activity: " + (e instanceof Error ? e.message : String(e)));
            throw new Error("Failed to upload activity: " + (e instanceof Error ? e.message : String(e)));
        });

    return c.json(activityResponse);
});

// Attaches the activity to a travel, or detaches it with `travel_id: null`.
activities.patch("/:id",
    accessAuth,
    zValidator('param', z.object({ id: z.string().regex(/^\d+$/) })),
    zValidator('json', z.object({ travel_id: z.string().regex(/^\d+$/).nullable() })),
    async (c) => {
        const { id } = c.req.valid('param');
        const { travel_id } = c.req.valid('json');
        const jwt = c.req.header(JWT_HEADER) ?? "";
        try {
            return c.json(await TrajectoryService.setActivityTravel(c.env.API_URL, jwt, id, travel_id));
        } catch (e) {
            if (e instanceof UpstreamError && (e.status === 403 || e.status === 404)) {
                return c.json({ error: e.status === 404 ? 'Not Found' : 'Forbidden' }, e.status);
            }
            Sentry.captureException("Failed to update activity: " + (e instanceof Error ? e.message : String(e)));
            return c.json({ error: 'Failed to update activity' }, 502);
        }
    });

// One request per call: Cloud Run rejects requests over 32MB, so the client sends
// the photos one at a time. The multipart body is forwarded as it is.
activities.post("/:id/photos",
    accessAuth,
    zValidator('param', z.object({ id: z.string().regex(/^\d+$/) })),
    async (c) => {
        const contentType = c.req.header('Content-Type') ?? "";
        if (!contentType.startsWith('multipart/form-data') || !c.req.raw.body) {
            return c.json({ error: 'Expected multipart/form-data' }, 400);
        }
        const { id } = c.req.valid('param');
        const jwt = c.req.header(JWT_HEADER) ?? "";
        try {
            return c.json(await TrajectoryService.uploadPhotos(c.env.API_URL, jwt, id, contentType, c.req.raw.body));
        } catch (e) {
            if (e instanceof UpstreamError && [400, 403, 404, 413].includes(e.status)) {
                return c.json({ error: 'Upload rejected' }, e.status as 400 | 403 | 404 | 413);
            }
            Sentry.captureException("Failed to upload photos: " + (e instanceof Error ? e.message : String(e)));
            return c.json({ error: 'Failed to upload photos' }, 502);
        }
    });

export default activities;
