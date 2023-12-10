import express from 'express';
import * as endpoints from './endpoints/endpoints';
import session from 'express-session';
import path from 'path';
import * as db from './database/database';

const config = require('../config.json');

const app = express();

app.use(
    session({
        secret: config.sessionsecret,
        resave: false,
        saveUninitialized: false,
    })
);


app.get('/callback', endpoints.enp_callback);

app.get('/login', endpoints.enp_login);

app.use('/', express.static(path.join(__dirname, '../web/root')));

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
    db.connect();
});


export const isAuthenticated = (req: express.Request, res: express.Response, next: () => void) => {
    // @ts-ignore
    if (req.session!.access_token) {
        return next();
    }
    res.redirect('/login');
};