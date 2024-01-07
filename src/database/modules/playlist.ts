import * as db from "../database";
import { Playlist } from "../../types/playlist";
import { playlistUser } from "../../types/user";


export async function getPlaylist(playlist_id: string): Promise<Playlist | null> {
    const connection = await db.getConnection();

    const [rows, fields] = await connection.query("SELECT * FROM `playlists` WHERE `playlist_uuid` = ?", [playlist_id]);

    // @ts-ignore
    if (rows.length == 0) {
        return null;
    }

    const playlistData: Playlist = {
        // @ts-ignore
        id: rows[0].id,
        // @ts-ignore
        name: rows[0].name,
        // @ts-ignore
        creator_id: rows[0].creator_id,
        // @ts-ignore
        playlist_uuid: rows[0].playlist_uuid,
        // @ts-ignore
        songs: JSON.parse(rows[0].songs),
        // @ts-ignore
        users: JSON.parse(rows[0].users),
        // @ts-ignore
        metadata: JSON.parse(rows[0].metadata)
    }

    return playlistData;
}

export async function addPlaylistUser(user: playlistUser, playlist: Playlist): Promise<boolean> {
    const connection = await db.getConnection();

    const [rows, fields] = await connection.query("SELECT * FROM `playlists` WHERE `playlist_uuid` = ?", [playlist.playlist_uuid]);

    // @ts-ignore
    if (rows.length == 0) {
        return false;
    }

    // @ts-ignore
    const playlistUsers: playlistUser[] = JSON.parse(rows[0].users);

    playlistUsers.push(user);

    await connection.query("UPDATE `playlists` SET `users` = ? WHERE `playlist_uuid` = ?", [JSON.stringify(playlistUsers), playlist.playlist_uuid]);

    return true;
}