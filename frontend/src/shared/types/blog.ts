export type BlogResponse = {
    id: string;
    title: string;
    content_key: string;
    slug: string;
    status: string;
};

export type BlogDetails = {
    id: string;
    title: string;
    slug?: string;
    content_html: string;
    status: string;
}