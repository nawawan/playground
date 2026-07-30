import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { type EntryCardProps } from "../../../../../presentation/EntryCards/EntryCard";
import { type BlogResponse } from "../../../../../../shared/types/blog";

type Posts = EntryCardProps["posts"];

const toPosts = (data: BlogResponse[]): Posts =>
    data.map((blog) => ({
        id: blog.id,
        title: blog.title,
        outline: undefined,
        tag: blog.tag,
    }));

export const useGenerateProps = (): EntryCardProps & { isLoading: boolean } => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Posts>([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    // Cache fetched posts per tag so revisiting a tag is instant, and keep the
    // previously rendered posts on screen while a new tag is being fetched.
    const cacheRef = useRef<Record<string, Posts>>({});
    const requestIdRef = useRef(0);

    useEffect(() => {
        const cached = cacheRef.current[selectedTag];
        if (cached) {
            setPosts(cached);
            setIsLoading(false);
            return;
        }

        const requestId = ++requestIdRef.current;
        setIsFetching(true);

        const fetchData = async () => {
            try {
                const url = selectedTag
                    ? `/api/blogs?status=PUBLISHED&tag=${encodeURIComponent(selectedTag)}`
                    : "/api/blogs?status=PUBLISHED";
                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch blogs");
                const data = (await res.json()) as BlogResponse[];
                const fetchedPosts = toPosts(data);

                // A newer tag switch superseded this request; ignore its result.
                if (requestId !== requestIdRef.current) return;

                cacheRef.current[selectedTag] = fetchedPosts;
                setPosts(fetchedPosts);
            } catch (e) {
                Sentry.captureException(new Error("Failed to fetch blogs: " + (e instanceof Error ? e.message : String(e))));
                // Keep whatever was previously displayed rather than clearing it.
            } finally {
                if (requestId === requestIdRef.current) {
                    setIsLoading(false);
                    setIsFetching(false);
                }
            }
        };
        fetchData();
    }, [selectedTag]);

    return {
        posts,
        onClick: (id: string) => {
            navigate(`/blogs/${id}`);
        },
        selectedTag,
        onTagFilterChange: setSelectedTag,
        isLoading,
        isFetching,
    };
}
