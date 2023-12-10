import { settings } from "./settings"
import { playlist } from "./playlist"

export type user = {
    id: string;
    spotifyId: string;
    spotifyName: string;
    email: string;
    settings: settings;
    playlists: playlist[];
}