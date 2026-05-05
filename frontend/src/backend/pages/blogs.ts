import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory'
import { BlogService } from '../service/BlogService';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

import { verifyAuthn } from '../../helper/VerifyAuthentication';

import { type BlogDetails, type BlogResponse } from '../../shared/types/blog';

type Env = {
    API_URL: string;
    BLOG_BUCKET: R2Bucket;
    TEAM_DOMAIN: string;
    AUD: string;
    PUBLIC_URL: string;
};

const accessAuth = createMiddleware<{ Bindings: Env }>(async (c, next) => {
    const isAuthorized = await verifyAuthn(c.req, c.env);
    if (!isAuthorized) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    return next();
});

const blogs = new Hono<{ Bindings: Env }>();

blogs.get('/', async (c) : Promise<Response> => {
    const apiUrl = c.env.API_URL;

    const resp: BlogResponse[] = await BlogService.getBlogs(apiUrl);
    return c.json(resp);
});

blogs.post('/', async (c) : Promise<Response> => {
    const apiUrl = c.env.API_URL;
    const { title, content } = await c.req.json();

    const resp: BlogResponse = await BlogService.createBlog(apiUrl, title, content);
    return c.json(resp);
});

blogs.post('/drafts', async (c) : Promise<Response> => {
    const apiUrl = c.env.API_URL;

    const resp: string = await BlogService.createBlogId(apiUrl);
    return c.json(resp);
});

blogs.get('/:id',
    zValidator('param', z.object({ id: z.string() })),
    async (c) : Promise<Response> => {
    const apiUrl = c.env.API_URL;
    const { id } = c.req.valid('param');

    const blog: BlogResponse = await BlogService.getBlogById(apiUrl, id)
        .catch((e) => {
            throw new Error("Failed to fetch blog by id: " + (e instanceof Error ? e.message : String(e)));
        });
    const content = await BlogService.getBlogContent(c.env.BLOG_BUCKET, blog.content_key)
        .catch((e) => {
            throw new Error("Failed to fetch blog content: " + (e instanceof Error ? e.message : String(e)));
        });

    const blogWithContent: BlogDetails = {
        id: blog.id,
        title: blog.title,
        content_html: content,
    }
    return c.json(blogWithContent);
});

blogs.get('/:id/md', 
    zValidator('param', z.object({ id: z.string() })),
    async (c): Promise<Response> => {

    const { id } = c.req.valid('param');
    const markdown = await BlogService.getBlogDraft(c.env.BLOG_BUCKET, id);

    return c.json(markdown);
});

blogs.post('/:id/md', 
    zValidator('param', z.object({id: z.string()})),
    accessAuth, 
    async(c): Promise<Response> => {

    if(!c.req.raw.body) {
        return c.json({ error: 'No draft file provided'}, 400);
    }
    const { id } = c.req.valid('param');
    await BlogService.uploadBlogDraft(c.env.BLOG_BUCKET, id, c.req.raw.body);

    return c.json({ status: 'successs' });
});

blogs.put('/images', accessAuth, async (c) : Promise<Response> => {
    if (!c.req.raw.body) {
        return c.json({ error: 'No image file provided' }, 400);
    }

    const uploadedImageKey = await BlogService.updateBlogImage(c.env.BLOG_BUCKET, c.req.raw.body)
        .catch((e) => {
            throw new Error("Failed to update blog image: " + (e instanceof Error ? e.message : String(e)));
        });

    return c.json(`${c.env.PUBLIC_URL}/${uploadedImageKey}`);
});

export default blogs;