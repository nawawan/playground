import { useEffect, useState } from "react";
import * as Sentry from "@sentry/react";

import { type HomePageProps } from "../../presentation/page/HomePage";
import { GITHUB_URL, X_URL } from "../../../shared/constants/links";
import { type BlogResponse } from "../../../shared/types/blog";
import { type UserProfile } from "../../../shared/types/user";
import { PROFILE_USER_NAME } from "../../../shared/constants/user";
import { formatPublishedDate } from "../../../helper/FormatPublishedDate";
import SiteFooterContainer from "../../../presentation/widgets/SiteFooter/Container";

// 最新の記事として表示する件数（2〜3件）
const LATEST_POSTS_COUNT = 3;

type LatestPosts = NonNullable<HomePageProps["latestPosts"]>;

export const useGenerateProps = (): HomePageProps => {
    const [latestPosts, setLatestPosts] = useState<LatestPosts | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UserProfile | undefined>(undefined);
    const [isProfileLoading, setIsProfileLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/users/${encodeURIComponent(PROFILE_USER_NAME)}`);
                if (!res.ok) throw new Error("Failed to fetch user");
                const data = (await res.json()) as UserProfile;
                if (!cancelled) setUser(data);
            } catch (e) {
                // 取得に失敗してもプロフィール以外は表示する
                Sentry.captureException(e);
            } finally {
                if (!cancelled) setIsProfileLoading(false);
            }
        };
        fetchUser();
        return () => {
            cancelled = true;
        };
    }, []);

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
            name: PROFILE_USER_NAME,
            affiliation: user?.place ?? undefined,
            bio: user?.summary ?? undefined,
            avatarUrl: user?.thumbnail ?? undefined,
            githubUrl: GITHUB_URL,
            xUrl: X_URL,
        },
        isProfileLoading,
        contents: [
            { id: "maze", title: "Maze Creator", description: "迷路作成するやつ", to: "/maze" },
            { id: "blogs", title: "ブログ", description: "日々の出来事をつらつらと", to: "/blogs" },
            { id: "trajectory", title: "Trajectory", description: "走ったり漕いだりした記録", to: "/trajectory" },
        ],
        latestPosts,
        isLatestPostsLoading: isLoading,
        footer: <SiteFooterContainer />,
    };
};

export default useGenerateProps;
