import { useEffect } from "react";
import * as Sentry from "@sentry/react";
import type { ActivityResponse } from "../../../../../shared/types/trajectory";
import { toTrajectoryActivity } from "../../../../domain/activityMapper";
import { useTrajectoryPageState } from "../../state/useTrajectoryPageState";


export const useGenerateProps = () => {
    const { addActivities, finishLoading } = useTrajectoryPageState();
    useEffect(() => {
        const initializeData = async() => {
        try {
                const res = await fetch('/api/admin/trajectory/trajectories');
                const activityTrajectries = (await res.json()) as ActivityResponse[];
                addActivities(activityTrajectries.map(toTrajectoryActivity))
            } catch (e) {
                Sentry.captureException(new Error("Failed to fetch activities :" + (e instanceof Error ? e.message : String(e))));
            } finally {
                finishLoading();
            }
        }
        initializeData();
        // 初回マウント時のみ取得する(addActivities は毎回再生成されるため依存に入れない)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};