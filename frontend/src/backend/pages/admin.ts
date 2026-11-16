import { Hono } from 'hono';

import blogs from './admin/blogs';
import activities from './admin/activities';
import users from './admin/users';
import travels from './admin/travels';
import photos from './admin/photos';

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
admin.route('/users', users);
admin.route('/travels', travels);
admin.route('/photos', photos);

export default admin;