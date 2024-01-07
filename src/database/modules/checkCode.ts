import { code } from "../../types/code";
import * as db from "../database";

export async function checkCode(codeString: string): Promise<code | null> {
    const connection = await db.getConnection();

    const [rows, fields] = await connection.query("SELECT * FROM `codes` WHERE `code` = ?", [codeString]);

    // @ts-ignore
    if (rows.length == 0) {
        return null;
    }

    const codeData: code = {
        // @ts-ignore
        id: rows[0].id,
        // @ts-ignore
        code: rows[0].code,
        // @ts-ignore
        playlist_id: rows[0].playlist_id,
        // @ts-ignore
        creator_id: rows[0].creator_id,
        // @ts-ignore
        permissions: JSON.parse(rows[0].permissions)
    }

    return codeData;
}