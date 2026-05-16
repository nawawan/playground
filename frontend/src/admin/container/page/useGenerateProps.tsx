import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { type Blog, type AdminHomeProps } from "../../presentation/page/AdminHome";
import { useNavigate } from "react-router-dom";
import type { BlogResponse } from '../../../shared/types/blog';


export const useGenerateProps = (): AdminHomeProps & { isLoading: boolean } => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/blogs");
                if (!res.ok) throw new Error("Failed to fetch blogs");
                const data = (await res.json()) as BlogResponse[];
                setBlogs(
                    data.map((blog) => ({
                        id: blog.id,
                        title: blog.title,
                        date: '2024-01-01',
                    }))
                );
            } catch (e) {
                Sentry.captureException(new Error("Failed to fetch blogs: " + (e instanceof Error ? e.message : String(e))));
                setBlogs([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const onWriteClick = async () => {
        const res = await fetch("/api/blogs/drafts", {
            method: 'POST',
        });
        const id: string = await res.json();
        navigate(`/admin/blogs/${id}/edit`);
    };

    return {
        posts: blogs,
        onWriteClick: onWriteClick,
        onPostClick: (id: string) => {
            navigate(`/admin/blogs/${id}/edit`);
        },
        isLoading,
    }
};

export default useGenerateProps;