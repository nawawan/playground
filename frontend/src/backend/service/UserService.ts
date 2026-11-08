import type { UpdateUserProfileRequest, UserProfile } from "../../shared/types/user";

type UserApiResponse = {
    username: string;
    thumbnail: string | null;
    summary: string | null;
    place: string | null;
};

const toUserProfile = (user: UserApiResponse): UserProfile => ({
    username: user.username,
    thumbnail: user.thumbnail,
    summary: user.summary,
    place: user.place,
});

export const UserService = {
    async getUser(apiUrl: string, name: string): Promise<UserProfile> {
        const response = await fetch(`${apiUrl}/api/users/${encodeURIComponent(name)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch user: ${response.status}`);
        }
        return toUserProfile(await response.json<UserApiResponse>());
    },

    async updateUser(apiUrl: string, jwt: string, body: UpdateUserProfileRequest): Promise<UserProfile> {
        const response = await fetch(`${apiUrl}/api/users`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cf-Access-Jwt-Assertion': jwt,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`Failed to update user: ${response.status}`);
        }
        return toUserProfile(await response.json<UserApiResponse>());
    },
};
