import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { type EntryCardProps } from "../../../../../presentation/EntryCards/EntryCard";

type BlogResponse = {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};

export const useGenerateProps = (): EntryCardProps => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<EntryCardProps["posts"]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/blogs");
                if (!res.ok) throw new Error("Failed to fetch blogs");
                const data = (await res.json()) as { blogs: BlogResponse[] };
                setPosts(
                    data.blogs.map((blog) => ({
                        id: String(blog.id),
                        title: blog.title,
                        outline: blog.content,
                    }))
                );
            } catch (e) {
                Sentry.captureException(new Error("Failed to fetch blogs: " + (e instanceof Error ? e.message : String(e))));
                setPosts([]);
            }
        };
        fetchData();
    }, []);

    return {
        posts,
        onClick: (id: string) => {
            navigate(`/blogs/${id}`);
        },
    };
}