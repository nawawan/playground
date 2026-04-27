
export const BlogService = {
    async getBlogs(apiUrl: string) {
        const response = await fetch(`${apiUrl}/api/blogs`);
        if (!response.ok) {
            throw new Error('Failed to fetch blogs');
        }
        return await response.json();
    },

    async createBlog(apiUrl: string, title: string, content: string) {
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
        return await response.json();
    },

    async getBlogById(apiUrl: string, id: number) {
        const response = await fetch(`${apiUrl}/api/blogs/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch blog');
        }
        return await response.json();
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