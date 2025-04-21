// const { google } = require('googleapis');
// const { OAuth2Client } = require('google-auth-library');
// const readline = require('readline');

import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import readline from "readline";

// const CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com";
const CLIENT_ID = process.env.client_id;

// const CLIENT_SECRET = "YOUR_CLIENT_SECRET";
const CLIENT_SECRET = process.env.client_secret;

// const REDIRECT_URI = "http://localhost:3000/oauth2callback";
const REDIRECT_URI = "http://localhost:5173";

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

async function getRefreshToken() {
    const oAuth2Client = new OAuth2Client(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline", // Get a refresh token
        scope: SCOPES,
    });

    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question("Enter the code from that page here: ", async (code) => {
        rl.close();
        try {
            const { tokens } = await oAuth2Client.getToken(code);
            console.log("Refresh Token:", tokens.refresh_token);
            // Store this refresh token securely!
        } catch (error) {
            console.error("Error retrieving access token", error);
        }
    });
}

getRefreshToken();
