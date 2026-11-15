import { useEffect } from "react";
import * as Sentry from "@sentry/react";
import { toTrajectoryActivity, type ActivityResponse } from "../../../../../shared/types/trajectory";
import { fetchPhotos, fetchTravels } from "../../helper/trajectoryApi";
import { useTrajectoryPageState } from "../../state/useTrajectoryPageState";

const report = (what: string, e: unknown) =>
    Sentry.captureException(new Error(`Failed to fetch ${what} :` + (e instanceof Error ? e.message : String(e))));

export const useGenerateProps = () => {
    const { addActivities, finishLoading, loadPhotos, loadTravels } = useTrajectoryPageState();
    useEffect(() => {
        const initializeData = async() => {
        try {
                const res = await fetch('/api/activities');
                if (!res.ok) throw new Error(`status ${res.status}`);
                const activityTrajectries = (await res.json()) as ActivityResponse[];
                addActivities(activityTrajectries.map(toTrajectoryActivity))
            } catch (e) {
                report("activities", e);
            } finally {
                finishLoading();
            }
        }
        // Travels and photos only decorate the activities: when they fail the
        // activities are still listed (as standalone, without photos).
        const initializeTravels = async () => {
            try {
                loadTravels(await fetchTravels());
            } catch (e) {
                report("travels", e);
            }
        };
        const initializePhotos = async () => {
            try {
                loadPhotos(await fetchPhotos());
            } catch (e) {
                report("photos", e);
            }
        };
        initializeData();
        initializeTravels();
        initializePhotos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
