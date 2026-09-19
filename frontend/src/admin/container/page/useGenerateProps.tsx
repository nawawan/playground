import { useState, useEffect, useRef } from 'react';
import * as Sentry from '@sentry/react';
import { type Blog, type AdminHomeProps } from "../../presentation/page/AdminHome";
import { useNavigate } from "react-router-dom";
import type { BlogResponse } from '../../../shared/types/blog';

const toBlog = (blog: BlogResponse): Blog => ({
    id: blog.id,
    title: blog.title,
    date: '2024-01-01',
    tag: blog.tag,
});

export const useGenerateProps = (): AdminHomeProps & { isLoading: boolean } => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [selectedTag, setSelectedTag] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const blogsCacheRef = useRef(new Map<string, Blog[]>());
    const requestIdRef = useRef(0);
    const navigate = useNavigate();

    useEffect(() => {
        const requestId = ++requestIdRef.current;
        const cacheKey = selectedTag;
        const cachedBlogs = blogsCacheRef.current.get(cacheKey);
        if (cachedBlogs) {
            setBlogs(cachedBlogs);
            setIsLoading(false);
            setIsFetching(false);
            return;
        }

        setIsFetching(true);

        const fetchData = async () => {
            try {
                const url = selectedTag ? `/api/blogs?tag=${encodeURIComponent(selectedTag)}` : "/api/blogs";
                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch blogs");
                const data = (await res.json()) as BlogResponse[];
                const fetchedBlogs = data.map(toBlog);

                if (requestId !== requestIdRef.current) return;

                blogsCacheRef.current.set(cacheKey, fetchedBlogs);
                setBlogs(fetchedBlogs);
            } catch (e) {
                Sentry.captureException(new Error("Failed to fetch blogs: " + (e instanceof Error ? e.message : String(e))));
                // Keep the previous list on screen when a tag fetch fails.
            } finally {
                if (requestId === requestIdRef.current) {
                    setIsLoading(false);
                    setIsFetching(false);
                }
            }
        };
        fetchData();
    }, [selectedTag]);

    const onWriteClick = async () => {
        const res = await fetch("/api/admin/blogs/drafts", {
            method: 'POST',
        });
        const id: string = await res.json();
        navigate(`/admin/blogs/${id}/edit`);
    };

    return {
        posts: blogs,
        selectedTag,
        onWriteClick: onWriteClick,
        onPostClick: (id: string, title: string) => {
            navigate(`/admin/blogs/${id}/edit?title=${title}`);
        },
        onTagFilterChange: setSelectedTag,
        isFetching,
        isLoading,
    }
};

export default useGenerateProps;
