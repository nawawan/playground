import { Hono } from 'hono';
import * as Sentry from '@sentry/cloudflare';
import { TrajectoryService } from '../service/TrajectoryService';

type Env = {
    API_URL: string;
};

const travels = new Hono<{ Bindings: Env }>();

travels.get("/", async (c) => {
    try {
        return c.json(await TrajectoryService.listTravels(c.env.API_URL));
    } catch (e) {
        Sentry.captureException("Failed to list travels: " + (e instanceof Error ? e.message : String(e)));
        throw e;
    }
});

export default travels;
