import { Request, Response } from "express";

const config = require('../../config.json');

export async function enp_login(req: Request, res: Response) {
    const scopes = config.spotify.scopes.join(" ");
    const client_id = config.spotify.clientId;
    const redirect_uri = config.spotify.redirectUri;

    res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scopes}&redirect_uri=${redirect_uri}`);
}