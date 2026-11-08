export type UserProfile = {
    username: string;
    thumbnail: string | null;
    summary: string | null;
    place: string | null;
};

export type UpdateUserProfileRequest = {
    thumbnail: string | null;
    summary: string | null;
    place: string | null;
};
