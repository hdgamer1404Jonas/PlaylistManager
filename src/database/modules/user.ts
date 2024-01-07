import * as db from "../database";
import { user, playlistUser } from "../../types/user";
import { code } from "../../types/code";
import { Playlist, userPlaylist } from "../../types/playlist";
import { Permissions } from "../../enums/permissions";
import { addPlaylistUser, getPlaylist } from "./playlist";

export async function getUser(spotify_id: string): Promise<user | null> {
    const connection = await db.getConnection();

    const [rows, fields] = await connection.query("SELECT * FROM `users` WHERE `spotify_id` = ?", [spotify_id]);

    // @ts-ignore
    if (rows.length == 0) {
        return null;
    }

    const userData: user = {
        // @ts-ignore
        id: rows[0].id,
        // @ts-ignore
        spotifyId: rows[0].spotify_id,
        // @ts-ignore
        spotifyName: rows[0].spotify_name,
        // @ts-ignore
        userName: rows[0].user_name,
        // @ts-ignore
        email: rows[0].email,
        // @ts-ignore
        settings: JSON.parse(rows[0].settings),
        // @ts-ignore
        playlists: JSON.parse(rows[0].playlists)
    }

    return userData;
}

export async function addUserPlaylist(user: user, playlistCode: code): Promise<boolean> {
    const connection = await db.getConnection();


    // check if the user is already in the playlist
    if (user.playlists.some((playlist: userPlaylist) => playlist.uuid == playlistCode.playlist_id)) {
        return true;
    }


    const playlist: Playlist | null = await getPlaylist(playlistCode.playlist_id);

    if (playlist == null) {
        return false;
    }

    const playlistuser: playlistUser = {
        spotifyId: user.spotifyId,
        spotifyName: user.spotifyName,
        userName: user.userName,
        permissions: playlistCode.permissions
    }

    const result = await addPlaylistUser(playlistuser, playlist);

    if (!result) {
        return false;
    }

    const userPlaylist: userPlaylist = {
        uuid: playlist.playlist_uuid,
        name: playlist.name,
        owner: playlist.creator_id,
        permissions: playlistCode.permissions
    }

    user.playlists.push(userPlaylist);

    await connection.query("UPDATE `users` SET `playlists` = ? WHERE `spotify_id` = ?", [JSON.stringify(user.playlists), user.spotifyId]);

    return true;
}