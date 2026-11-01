import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { type BlogTopProps } from "../../../presentation/page/blogs/BlogTop";
import EntryList from "../../../presentation/EntryList/EntryList";
import { type EntryListProps } from "../../../presentation/EntryList/EntryList";
import SiteFooterContainer from "../../../../presentation/widgets/SiteFooter/Container";
import { BLOG_TAGS, type BlogResponse } from "../../../../shared/types/blog";
import { GITHUB_URL, X_URL } from "../../../../shared/constants/links";

const NO_DATE_SECTION_ID = "ynodate";

const capitalize = (tag: string): string =>
    tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();

const toSections = (data: BlogResponse[]): { sections: EntryListProps["sections"]; years: string[] } => {
    const dated = data
        .filter((blog) => blog.published_at)
        .sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime());
    const undated = data.filter((blog) => !blog.published_at);

    const sections: EntryListProps["sections"] = [];
    for (const blog of dated) {
        const date = new Date(blog.published_at!);
        const year = String(date.getFullYear());
        const dateLabel = `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
        let section = sections.find((s) => s.heading === year);
        if (!section) {
            section = { id: `y${year}`, heading: year, entries: [] };
            sections.push(section);
        }
        section.entries.push({
            id: blog.id,
            dateLabel,
            title: blog.title,
            tagLabel: blog.tag ? capitalize(blog.tag) : undefined,
        });
    }
    if (undated.length > 0) {
        sections.push({
            id: NO_DATE_SECTION_ID,
            heading: "日付なし",
            entries: undated.map((blog) => ({
                id: blog.id,
                dateLabel: "--.--",
                title: blog.title,
                tagLabel: blog.tag ? capitalize(blog.tag) : undefined,
            })),
        });
    }
    return { sections, years: sections.filter((s) => s.id !== NO_DATE_SECTION_ID).map((s) => s.heading) };
};

export const useGenerateProps = (): BlogTopProps => {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedTag = searchParams.get("tag") ?? "";
    const [sections, setSections] = useState<EntryListProps["sections"]>([]);
    const [years, setYears] = useState<string[]>([]);
    const [isFetching, setIsFetching] = useState(false);

    // Keep the previously rendered posts on screen while a new tag is being
    // fetched, guarding against a superseded request resolving out of order.
    const requestIdRef = useRef(0);

    useEffect(() => {
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
                const result = toSections(data);

                // A newer tag switch superseded this request; ignore its result.
                if (requestId !== requestIdRef.current) return;

                setSections(result.sections);
                setYears(result.years);
            } catch (e) {
                Sentry.captureException(new Error("Failed to fetch blogs: " + (e instanceof Error ? e.message : String(e))));
                // Keep whatever was previously displayed rather than clearing it.
            } finally {
                if (requestId === requestIdRef.current) {
                    setIsFetching(false);
                }
            }
        };
        fetchData();
    }, [selectedTag]);

    const handleTagFilterChange = (tag: string) => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                if (tag) {
                    next.set("tag", tag);
                } else {
                    next.delete("tag");
                }
                return next;
            },
            { replace: true }
        );
    };

    return {
        tabs: [
            { value: "", label: "すべて" },
            ...BLOG_TAGS.map((tag) => ({ value: tag, label: capitalize(tag) })),
        ],
        selectedTag,
        onTagFilterChange: handleTagFilterChange,
        years: years.map((year) => ({ year, href: `#y${year}` })),
        isFetching,
        githubUrl: GITHUB_URL,
        xUrl: X_URL,
        entryList: <EntryList sections={sections} />,
        footer: <SiteFooterContainer />,
    };
};
