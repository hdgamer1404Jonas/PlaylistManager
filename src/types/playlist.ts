import { Permissions } from "../enums/permissions";
import { playlistUser } from "./user";
import { PlaylistMetadata } from "./playlist_metadata";

export type userPlaylist = {
    uuid: string;
    name: string;
    owner: string;
    permissions: Permissions[];
}

export type Playlist = {
    id: string;
    name: string;
    creator_id: string;
    playlist_uuid: string;
    songs: []
    users: playlistUser[];
    metadata: PlaylistMetadata;
}