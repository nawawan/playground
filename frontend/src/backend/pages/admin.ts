import { Hono } from 'hono';

import blogs from './admin/blogs';
import activities from './admin/activities';

type Env = {
    API_URL: string;
    BLOG_BUCKET: R2Bucket;
    TEAM_DOMAIN: string;
    AUD: string;
    PUBLIC_URL: string;
};


const admin = new Hono<{ Bindings: Env }>();

admin.route('/blogs', blogs);
admin.route('/activities', activities);

export default admin;