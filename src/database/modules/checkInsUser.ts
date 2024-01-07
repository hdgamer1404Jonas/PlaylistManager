import { user } from "../../types/user";
import * as db from "../database";

export async function checkInsUser(user: user) {
    const connection = await db.getConnection();

    const [rows, fields] = await connection.query("SELECT * FROM `users` WHERE `spotify_id` = ?", [user.spotifyId]);

    // @ts-ignore
    if (rows.length > 0) {
        return true;
    } else {
        await insert(user);
        return false;
    }
}

async function insert(user: user) {
    const connection = await db.getConnection();

    await connection.query("INSERT INTO `users` (`spotify_id`, `spotify_name`, `user_name`, `email`, `settings`, `playlists`) VALUES (?, ?, ?, ?, ?, ?)", [user.spotifyId, user.spotifyName, user.spotifyName, user.email, JSON.stringify(user.settings), JSON.stringify(user.playlists)]);
}