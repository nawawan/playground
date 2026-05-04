import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as Sentry from "@sentry/react";

import type { BlogProps } from "../../../presentation/page/blog_id/Blog";
import SidebarContainer from "../blogs/widgets/Sidebar/Container";
import MarkdownHtml from "../../../presentation/MarkdownHtml/MarkdownHtml";
import { type BlogDetails } from "../../../../shared/types/blog";

const useGenerateProps = (): BlogProps => {
    const [blog, setBlog] = useState<BlogDetails>();
    const { blogId } = useParams<{ blogId: string }>();

    useEffect(() => {
        if (!blogId) {
            return;
        }

        const fetchBlog = async () => {
            try {
                const response = await fetch(`/api/blogs/${blogId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch blog");
                }
                const data = await response.json() as BlogDetails;
                setBlog(data);
            } catch (error) {
                Sentry.captureException(new Error("Failed to fetch blog: " + (error instanceof Error ? error.message : String(error))));
            }
        };
        fetchBlog();
    }, [blogId]);

    if (!blog || !blog.content_html) {
        return {
            title: "No Content",
            content: "No content available for this blog post.",
            sidebar: <SidebarContainer />,
        };
    }


    return {
        title: blog?.title || "No Title",
        content: <MarkdownHtml htmlBody={blog?.content_html} />,
        sidebar: <SidebarContainer />,
    }
}

export default useGenerateProps;
