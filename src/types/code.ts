import { Permissions } from "../enums/permissions";

export type code = {
    id: string;
    code: string;
    playlist_id: string;
    creator_id: string;
    permissions: Permissions[];
}