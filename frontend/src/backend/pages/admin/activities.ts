import { Hono } from 'hono';
import { TrajectoryService } from '../../service/TrajectoryService';
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

export default activities;
