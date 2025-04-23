const express = require("express");
const cors = require("cors");

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
  console.log(req.body);
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
