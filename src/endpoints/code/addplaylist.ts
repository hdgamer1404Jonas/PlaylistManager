import { Request, Response } from "express";
import axios from "axios";
import { user } from "../../types/user";
import * as db from "../../database/database";
import { checkCode } from "../../database/modules/checkCode";
const config = require('../../../config.json');
import { getUser, addUserPlaylist } from "../../database/modules/user";

export async function enp_code_addplaylist(req: Request, res: Response) {
    if (!req.query || !req.query.code) {
        res.status(400).send("Bad Request");
    }

    const auth = await isAuthenticated(req, res);

    if (!auth) {
        return;
    }

    // check if the code is valid
    const code = req.query.code;

    // @ts-ignore
    const codeData = await checkCode(code);

    if (!codeData) {
        res.redirect("/error/code_invalid.html");
        return;
    }
    
    // @ts-ignore
    const user = await getUser(req.session.user.id);

    if(!user) {
        // redirect to login
        res.redirect("/login");
    }

    // @ts-ignore
    const result = await addUserPlaylist(user, codeData);

    if (!result) {
        res.redirect("/error/code_invalid.html");
        return;
    }

    // @ts-ignore
    res.redirect(`/m/playlist/${codeData.playlist_id}`);
}

const isAuthenticated = async (req: Request, res: Response) => {
    // @ts-ignore
    if (!req.session.access_token) {
        // @ts-ignore
        req.session!.code = req.query.code;
        res.redirect('/login');
        return;
    }
    
    // @ts-ignore
    let access_token = req.session.access_token;
    // @ts-ignore
    let refresh_token = req.session.refresh_token;

    // check if the access token is still valid, if not, refresh it
    await axios.get("https://api.spotify.com/v1/me", {
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    }).catch(async (err) => {
        if (err.response.status === 401) {
            // refresh token
            // @ts-ignore
            const data = {
                grant_type: "refresh_token",
                // @ts-ignore
                refresh_token: refresh_token,
                client_id: config.spotify.clientId,
                client_secret: config.spotify.clientSecret
            }
        
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded"
            }
            
            // @ts-ignore
            const response = await axios.post("https://accounts.spotify.com/api/token", data, { headers: headers });
        
            const access_token = response.data.access_token;
            // @ts-ignore
            const refresh_token = response.data.refresh_token;
        
            // @ts-ignore
            req.session!.access_token = access_token;
            // @ts-ignore
            req.session!.refresh_token = refresh_token;
        }
    });

    return true;
};