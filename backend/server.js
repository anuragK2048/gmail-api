// backend: server.js
import express from 'express';
import cors from 'cors';
import getRecentEmails from './get-emails.js';

const app = express();
const port = 3000;

// Check environment variables
console.log("Checking environment variables:");
console.log("VITE_GCLIENT_ID exists:", !!process.env.VITE_GCLIENT_ID);
console.log("VITE_GCLIENT_SECRET exists:", !!process.env.VITE_GCLIENT_SECRET);
console.log("VITE_GREFRESH_TOKEN exists:", !!process.env.VITE_GREFRESH_TOKEN);

app.use(cors()); // Enable CORS for all routes

// Test route to make sure basic server functionality works
app.get('/', (req, res) => {
    res.send('Server is running correctly!');
});

app.get('/api/emails', async (req, res) => {
    try {
        console.log("Fetching emails...");
        const emails = await getRecentEmails();
        console.log("Emails fetched successfully:", emails.length);
        res.json(emails);
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).json({ error: 'Failed to fetch emails: ' + error.message });
    }
});

// Global error handler
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Keep the server running despite the error
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Keep the server running despite the rejection
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});