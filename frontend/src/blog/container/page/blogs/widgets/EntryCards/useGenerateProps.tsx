import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
            .catch(() => {
                setPosts([]);
            });
    }, []);

    return {
        posts,
        onClick: (id: string) => {
            navigate(`/blogs/${id}`);
        },
    };
}