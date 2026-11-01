import { useEffect, useState } from "react";
import * as Sentry from "@sentry/react";

import { type HomePageProps } from "../../presentation/page/HomePage";
import { GITHUB_URL, X_URL } from "../../../shared/constants/links";
import { type BlogResponse } from "../../../shared/types/blog";
import { formatPublishedDate } from "../../../helper/FormatPublishedDate";
import SiteFooterContainer from "../../../presentation/widgets/SiteFooter/Container";

// 最新の記事として表示する件数（2〜3件）
const LATEST_POSTS_COUNT = 3;

// TODO: 本人が記入
const AFFILIATION = "所属・拠点（仮）";
// TODO: 本人が記入
const BIO = "自己紹介文（仮）。ここに自己紹介を書きます。";
// TODO: 本人が記入
const AVATAR_URL: string | undefined = undefined;

type LatestPosts = NonNullable<HomePageProps["latestPosts"]>;

export const useGenerateProps = (): HomePageProps => {
    const [latestPosts, setLatestPosts] = useState<LatestPosts | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            try {
                const res = await fetch("/api/blogs?status=PUBLISHED");
                if (!res.ok) throw new Error("Failed to fetch blogs");
                const data = (await res.json()) as BlogResponse[];
                // API の並び順は保証されないため published_at の降順に並べ替える
                const sorted = data
                    .filter((blog) => blog.published_at)
                    .sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime())
                    .slice(0, LATEST_POSTS_COUNT)
                    .map((blog) => ({
                        id: blog.id,
                        title: blog.title,
                        publishedAtLabel: formatPublishedDate(blog.published_at!),
                        tag: blog.tag,
                    }));
                if (!cancelled) setLatestPosts(sorted);
            } catch (e) {
                Sentry.captureException(e);
                if (!cancelled) setLatestPosts(undefined);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        fetchData();
        return () => {
            cancelled = true;
        };
    }, []);

    return {
        profile: {
            name: "nawa",
            affiliation: AFFILIATION,
            bio: BIO,
            avatarUrl: AVATAR_URL,
            githubUrl: GITHUB_URL,
            xUrl: X_URL,
        },
        contents: [
            { id: "maze", title: "Maze Creator", description: "迷路作成するやつ", to: "/maze" },
            { id: "blogs", title: "ブログ", description: "日々の出来事をつらつらと", to: "/blogs" },
        ],
        latestPosts,
        isLatestPostsLoading: isLoading,
        footer: <SiteFooterContainer />,
    };
};

export default useGenerateProps;
