import type {
    ActivityResponse,
    LodTrajectoryResponse,
    PhotoResponse,
    PhotoUploadItemResponse,
    TravelResponse,
} from "../../shared/types/trajectory";

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
    async listTravels(apiUrl: string): Promise<TravelResponse[]> {
        const res = await fetch(`${apiUrl}/api/travels`);
        return await parseJson<TravelResponse[]>(res);
    },
    async listPhotos(apiUrl: string, activityId?: string): Promise<PhotoResponse[]> {
        const query = new URLSearchParams();
        if (activityId) query.set('activity_id', activityId);
        const res = await fetch(`${apiUrl}/api/photos?${query}`);
        return await parseJson<PhotoResponse[]>(res);
    },
    async createTravel(apiUrl: string, jwt: string, name: string): Promise<TravelResponse> {
        const res = await fetch(`${apiUrl}/api/travels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Cf-Access-Jwt-Assertion': jwt },
            body: JSON.stringify({ name }),
        });
        return await parseJson<TravelResponse>(res);
    },
    // travelId null makes the activity standalone.
    async setActivityTravel(apiUrl: string, jwt: string, activityId: string, travelId: string | null): Promise<ActivityResponse> {
        const res = await fetch(`${apiUrl}/api/activities/${encodeURIComponent(activityId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Cf-Access-Jwt-Assertion': jwt },
            body: JSON.stringify({ travel_id: travelId }),
        });
        return await parseJson<ActivityResponse>(res);
    },
    // Forwards the multipart body as it is (the content type carries the boundary).
    async uploadPhotos(
        apiUrl: string,
        jwt: string,
        activityId: string,
        contentType: string,
        body: ReadableStream<Uint8Array>,
    ): Promise<PhotoUploadItemResponse[]> {
        const res = await fetch(`${apiUrl}/api/activities/${encodeURIComponent(activityId)}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': contentType, 'Cf-Access-Jwt-Assertion': jwt },
            body,
        });
        return await parseJson<PhotoUploadItemResponse[]>(res);
    },
    async placePhoto(apiUrl: string, jwt: string, photoId: string, distanceM: number): Promise<PhotoResponse> {
        const res = await fetch(`${apiUrl}/api/photos/${encodeURIComponent(photoId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Cf-Access-Jwt-Assertion': jwt },
            body: JSON.stringify({ distance_m: distanceM }),
        });
        return await parseJson<PhotoResponse>(res);
    },
    async deletePhoto(apiUrl: string, jwt: string, photoId: string): Promise<void> {
        const res = await fetch(`${apiUrl}/api/photos/${encodeURIComponent(photoId)}`, {
            method: 'DELETE',
            headers: { 'Cf-Access-Jwt-Assertion': jwt },
        });
        if (!res.ok) {
            throw new UpstreamError(res.status, `Upstream responded with ${res.status}`);
        }
    },
};
