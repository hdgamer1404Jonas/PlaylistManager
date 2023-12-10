import { Request, Response } from "express";
import axios from "axios";

export async function enp_callback(req: Request, res: Response) {
    const code = req.query.code;
    const config = require('../../config.json');

    const data = {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: config.spotify.redirectUri,
        client_id: config.spotify.clientId,
        client_secret: config.spotify.clientSecret
    }

    const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    const response = await axios.post("https://accounts.spotify.com/api/token", data, { headers: headers });

    const access_token = response.data.access_token;
    const refresh_token = response.data.refresh_token;

    // @ts-ignore
    req.session!.access_token = access_token;
    // @ts-ignore
    req.session!.refresh_token = refresh_token;

    res.redirect("/");
}