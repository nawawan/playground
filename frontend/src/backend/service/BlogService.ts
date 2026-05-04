import { type BlogResponse } from "../../shared/types/blog";

export const BlogService = {
    async getBlogs(apiUrl: string) : Promise<BlogResponse[]> {
        const response = await fetch(`${apiUrl}/api/blogs`);
        if (!response.ok) {
            throw new Error('Failed to fetch blogs');
        }
        const json = await response.json<{ data: { blogs: BlogResponse[] } }>();
        return json.data.blogs;
    },

    async createBlog(apiUrl: string, title: string, content: string) : Promise<BlogResponse> {
        const response = await fetch(`${apiUrl}/api/blogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
        });
        if (!response.ok) {
            throw new Error('Failed to create blog');
        }
        const json = await response.json<{ data: { blog: BlogResponse } }>();
        return json.data.blog;
    },

    async getBlogById(apiUrl: string, id: number): Promise<BlogResponse> {
        const response = await fetch(`${apiUrl}/api/blogs/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch blog');
        }
        const json = await response.json<{ data: { blog: BlogResponse } }>();
        return json.data.blog;
    },

    async getBlogContent(bucket: R2Bucket, contentKey: string): Promise<string> {
        const object = await bucket.get(contentKey);
        if (!object) {
            throw new Error('Blog content not found');
        }
        return await object.text();
    },

    async updateBlogImage(apiUrl: string, imageFile: File) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`${apiUrl}/api/blogs/image`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new Error('Failed to update blog image');
        }
    }
}
