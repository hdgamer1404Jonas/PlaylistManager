import { settings } from "./settings"
import { userPlaylist } from "./playlist"
import { Permissions } from "../enums/permissions"

export type user = {
    id: string;
    spotifyId: string;
    spotifyName: string;
    userName: string;
    email: string;
    settings: settings;
    playlists: userPlaylist[];
}

export type playlistUser = {
    spotifyId: string;
    spotifyName: string;
    userName: string;
    permissions: Permissions[];
}