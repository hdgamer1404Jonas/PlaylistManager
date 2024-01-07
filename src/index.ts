import express from 'express';
import * as endpoints from './endpoints/endpoints';
import session from 'express-session';
import path from 'path';
import * as db from './database/database';
import axios from 'axios';

const config = require('../config.json');

const app = express();

export const isAuthenticated = async (req: express.Request, res: express.Response, next: () => void) => {
    // @ts-ignore
    if (!req.session.access_token) {
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
};

app.use(
    session({
        secret: config.sessionsecret,
        resave: false,
        saveUninitialized: false,
    })
);


app.get('/callback', endpoints.enp_callback);

app.get('/login', endpoints.enp_login);

app.get('/m/add', endpoints.enp_code_addplaylist);

app.use('/', express.static(path.join(__dirname, '../web/root')));

app.use('/error/', express.static(path.join(__dirname, '../web/errors')));

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
    db.connect();
});
