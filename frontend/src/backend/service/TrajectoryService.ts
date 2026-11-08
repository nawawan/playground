import type { ActivityResponse, LodTrajectoryResponse } from "../../shared/types/trajectory";

export class UpstreamError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

const parseJson = async <T>(res: Response): Promise<T> => {
    if (!res.ok) {
        throw new UpstreamError(res.status, `Upstream responded with ${res.status}`);
    }
    return await res.json<T>();
};

export const TrajectoryService = {
    async uploadActivity(apiUrl: string, jwt: string, file: ReadableStream<Uint8Array>): Promise<ActivityResponse> {
        const res = await fetch(`${apiUrl}/api/activities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Cf-Access-Jwt-Assertion': jwt,
            },
            body: file,
        });

        return await parseJson<ActivityResponse>(res);
    },
    async listActivities(apiUrl: string): Promise<ActivityResponse[]> {
        const res = await fetch(`${apiUrl}/api/activities`);
        return await parseJson<ActivityResponse[]>(res);
    },
    async getActivityTrajectory(apiUrl: string, activityId: string, lod?: string): Promise<LodTrajectoryResponse> {
        const query = new URLSearchParams();
        if (lod) query.set('lod', lod);
        const res = await fetch(`${apiUrl}/api/activities/${encodeURIComponent(activityId)}/trajectory?${query}`);
        return await parseJson<LodTrajectoryResponse>(res);
    },
    async listTrajectories(apiUrl: string, lod?: string, bbox?: string): Promise<LodTrajectoryResponse[]> {
        const query = new URLSearchParams();
        if (lod) query.set('lod', lod);
        if (bbox) query.set('bbox', bbox);
        const res = await fetch(`${apiUrl}/api/trajectories?${query}`);
        return await parseJson<LodTrajectoryResponse[]>(res);
    },
};
