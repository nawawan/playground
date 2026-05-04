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
            fetch("/api/blogs")
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch blogs");
                    return res.json() as Promise<BlogResponse[]>;
                })
                .then((data) => {
                    setPosts(
                        data.map((blog) => ({
                            id: String(blog.id),
                            title: blog.title,
                            outline: blog.content,
                        }))
                    );
                })
                .catch((e) => {
                    Sentry.captureException(new Error("Failed to fetch blogs: " + e.message));
                    setPosts([]);
                });
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