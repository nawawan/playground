import type { ActivityResponse } from "../../shared/types/trajectory";

export const TrajectoryService = {
    async uploadActivity(apiUrl: string, jwt: string, file: ReadableStream<Uint8Array>): Promise<ActivityResponse> {
        const res = await fetch(`${apiUrl}/api/trajectory/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Cf-Access-Jwt-Assertion': jwt,
            },
            body: file,
        });

        return await res.json<ActivityResponse>();
    },
    async listActivities(apiUrl: string, jwt: string): Promise<ActivityResponse[]> {
        const res = await fetch(`${apiUrl}/api/trajectory`, {
            headers: {
                'Cf-Access-Jwt-Assertion': jwt,
            },
        });
        return await res.json<ActivityResponse[]>();
    },
};