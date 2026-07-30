import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { type EntryCardProps } from "../../../../../presentation/EntryCards/EntryCard";
import { type BlogResponse } from "../../../../../../shared/types/blog";
import { formatElapsedTime } from "../../../../../../helper/FormatElapsedTime";

export const useGenerateProps = (): EntryCardProps & { isLoading: boolean } => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<EntryCardProps["posts"]>([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const url = selectedTag
                    ? `/api/blogs?status=PUBLISHED&tag=${encodeURIComponent(selectedTag)}`
                    : "/api/blogs?status=PUBLISHED";
                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch blogs");
                const data = (await res.json()) as BlogResponse[];
                setPosts(
                    data.map((blog) => ({
                        id: blog.id,
                        title: blog.title,
                        outline: undefined,
                        elapsedTimeLabel: blog.published_at
                            ? formatElapsedTime(blog.published_at)
                            : undefined,
                        tag: blog.tag,
                    }))
                );
            } catch (e) {
                Sentry.captureException(new Error("Failed to fetch blogs: " + (e instanceof Error ? e.message : String(e))));
                setPosts([]);
            } finally {
                setIsLoading(false);
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
    };
}
