import { useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import { useNavigate } from "react-router-dom";

import type { AdminProfileProps } from "../../../presentation/page/AdminProfile";
import type { UserProfile } from "../../../../shared/types/user";
import { PROFILE_USER_NAME } from "../../../../shared/constants/user";

type Notice = AdminProfileProps["notice"];

export const useGenerateProps = (): AdminProfileProps & { isLoading: boolean } => {
    const navigate = useNavigate();
    const [thumbnail, setThumbnail] = useState("");
    const [summary, setSummary] = useState("");
    const [place, setPlace] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [notice, setNotice] = useState<Notice>(undefined);

    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/users/${encodeURIComponent(PROFILE_USER_NAME)}`);
                if (!res.ok) throw new Error("Failed to fetch user");
                const user = (await res.json()) as UserProfile;
                if (cancelled) return;
                setThumbnail(user.thumbnail ?? "");
                setSummary(user.summary ?? "");
                setPlace(user.place ?? "");
            } catch (e) {
                Sentry.captureException(e);
                if (!cancelled) setNotice({ type: "error", message: "プロフィールの取得に失敗しました" });
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        fetchData();
        return () => {
            cancelled = true;
        };
    }, []);

    const onThumbnailSelect = async (file: File) => {
        setIsUploading(true);
        setNotice(undefined);
        try {
            // ブログ画像と同じアップロード先を再利用する
            const res = await fetch("/api/admin/blogs/images", {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type },
            });
            if (!res.ok) throw new Error("Failed to upload image");
            setThumbnail((await res.json()) as string);
        } catch (e) {
            Sentry.captureException(e);
            setNotice({ type: "error", message: "画像のアップロードに失敗しました" });
        } finally {
            setIsUploading(false);
        }
    };

    const onSave = async () => {
        setIsSaving(true);
        setNotice(undefined);
        try {
            const res = await fetch("/api/admin/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    thumbnail: thumbnail || null,
                    summary: summary || null,
                    place: place || null,
                }),
            });
            if (!res.ok) throw new Error("Failed to update user");
            setNotice({ type: "success", message: "保存しました" });
        } catch (e) {
            Sentry.captureException(e);
            setNotice({ type: "error", message: "保存に失敗しました" });
        } finally {
            setIsSaving(false);
        }
    };

    return {
        values: { thumbnail, summary, place },
        isLoading,
        isSaving,
        isUploading,
        notice,
        onThumbnailSelect,
        onThumbnailClear: () => setThumbnail(""),
        onPlaceChange: setPlace,
        onSummaryChange: setSummary,
        onSave,
        onBlogsClick: () => navigate("/admin/blogs"),
    };
};

export default useGenerateProps;
