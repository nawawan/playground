import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";

import type { BlogProps } from "../../../presentation/page/blog_id/Blog";
import SidebarContainer from "../blogs/widgets/Sidebar/Container";
import MarkdownHtml from "../../../presentation/MarkdownHtml/MarkdownHtml";

type Blog = {
    title: string;
    content: string;
};

const useGenerateProps = (): BlogProps => {
    const [blog, setBlog] = useState<Blog>();
    const blogId = useParams();

    useEffect(() => {
        fetch(`/api/blogs/${blogId}`)
            .then((response) => response.json())
            .then((data) => setBlog(data));
    }, [blogId]);

    if (!blog || !blog.content) {
        return {
            title: "No Content",
            content: "No content available for this blog post.",
            sidebar: <SidebarContainer />,
        };
    }


    return {
        title: blog?.title || "No Title",
        content: <MarkdownHtml htmlBody={blog?.content} />,
        sidebar: <SidebarContainer />,
    }
}

export default useGenerateProps;