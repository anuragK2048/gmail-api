const express = require("express");
const cors = require("cors");
require("dotenv").config();

const getSummary = require("./llm-ops/summary");

const getGmailApi = require("./services/googleApiAuthService");
const {
  getListOfLabels,
  getEmailList,
  getEmailDetails,
} = require("./services/gmailApiServices");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

//-------

const { google } = require("googleapis");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
console.log(CLIENT_ID);

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

app.post("/api/oauth2callback", async (req, res) => {
  const { code } = req.body;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // You can now access Gmail API on behalf of the user
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Example: get user's Gmail profile
    const profile = await gmail.users.getProfile({ userId: "me" });

    if (gmail) {
      try {
        const messages = await getEmailList(gmail, 10);
        const messagesContent = messages.map(async (message) => {
          const details = await getEmailDetails(gmail, message.id);
          return details;
        });
        const results = await Promise.all(messagesContent);
        res.json({ message: results });
      } catch (error) {
        console.error("Error fetching email list:", error);
      }
    }

    // res.json({
    //   email: profile.data.emailAddress,
    //   messageIds: messages,
    //   tokens,
    // });
  } catch (error) {
    console.error("Error exchanging code:", error);
    res.status(500).json({ error: "Failed to authenticate with Google" });
  }
});

//-------

app.get("/api/getLabels", async (req, res) => {
  const gmail = await getGmailApi();
  if (gmail) {
    const labels = await getListOfLabels(gmail);
    res.json({ message: labels });
  } else {
    console.error("Failed to get Gmail API");
  }
});

app.post("/api/getEmails", async (req, res) => {
  const quantity = req.body.quantity;
  const gmail = await getGmailApi();
  if (gmail) {
    try {
      const messages = await getEmailList(gmail, quantity);
      const messagesContent = messages.map(async (message) => {
        const details = await getEmailDetails(gmail, message.id);
        return details;
      });
      const results = await Promise.all(messagesContent);
      res.json({ message: results });
    } catch (error) {
      console.error("Error fetching email list:", error);
    }
  }
});

app.post("/api/ai/summarize", async (req, res) => {
  const result = await getSummary(req.body.emailDetails);
  res.json({ summary: result });
});

app.post("/api/ai/categorize", async (req, res) => {
  res.json({ category: req.body.emailDetails });
});

app.post("/api/ai/extractAction", async (req, res) => {
  res.json({ action: req.body.emailDetails });
});

app.post("/api/ai/createDraft", async (req, res) => {
  res.json({ draft: req.body.emailDetails });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
