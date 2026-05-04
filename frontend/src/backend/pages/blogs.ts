import { Hono } from 'hono';
import { BlogService } from '../service/BlogService';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

import { type BlogDetails, type BlogResponse } from '../../shared/types/blog';

type Env = {
    API_URL: string;
    BLOG_BUCKET: R2Bucket;
};


const blogs = new Hono<{ Bindings: Env }>();

blogs.get('/', async (c) : Promise<Response> => {
    const apiUrl = c.env.API_URL;

    const resp: BlogResponse[] = await BlogService.getBlogs(apiUrl);
    return c.json(resp);
});

blogs.get('/:id',
    zValidator('param', z.object({ id: z.uuidv7() })),
    async (c) : Promise<Response> => {
    const apiUrl = c.env.API_URL;
    const { id } = c.req.valid('param');

    const blog: BlogResponse = await BlogService.getBlogById(apiUrl, id.toString());
    const content = await BlogService.getBlogContent(c.env.BLOG_BUCKET, blog.content_key);

    const blogWithContent: BlogDetails = {
        id: blog.id,
        title: blog.title,
        content_html: content,
    }
    return c.json(blogWithContent);
});

blogs.post('/', async (c) : Promise<Response> => {
    const apiUrl = c.env.API_URL;
    const { title, content } = await c.req.json();

    const resp: BlogResponse = await BlogService.createBlog(apiUrl, title, content);
    return c.json(resp);
});

export default blogs;