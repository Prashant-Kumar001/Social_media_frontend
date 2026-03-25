export interface UpdateUserFormData {
    full_name: string;
    username: string;
    location: string;
    bio: string;
    profile_picture?: File | null;
    cover_photo?: File | null;
}