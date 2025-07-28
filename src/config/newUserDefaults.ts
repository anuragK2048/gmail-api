export const newUserDefaults = {
  defaultLabels: [
    {
      name: "Action Required",
      prompt:
        "Analyze if this email explicitly or implicitly requires a direct action or response from the recipient. Classify as 'Action Required' ONLY if it contains a direct question, a request to do something (e.g., 'please review', 'send me the file'), a task assignment, a clear deadline, or an urgent call to action. Do NOT classify simple status updates or FYI messages.",
      color: "#6366f1",
    },
    {
      name: "Meetings & Calendar",
      prompt:
        "Analyze if this email's primary purpose is scheduling. Classify as 'Meetings & Calendar' if it is a calendar invitation (.ics file), a meeting request or update, an agenda for a meeting, a scheduling link (e.g., from Calendly, Doodle), or a direct discussion about finding a time to meet.",
      color: "#3b82f6",
    },
    {
      name: "Shipment Tracking",
      prompt:
        "Analyze if this email is a notification about a physical shipment. Classify as 'Shipment Tracking' if its main content is a shipping confirmation, a tracking number, a delivery status update ('out for delivery', 'delivered'), or a pickup notification. Do NOT classify purchase receipts.",
      color: "#f97316",
    },
    {
      name: "Promotional",
      prompt:
        "Analyze if this email is unsolicited marketing, an advertisement, or a promotional offer. Classify as 'Promotions & Spam' if it is a sales announcement, a discount offer, a marketing campaign, an affiliate offer, or appears to be unsolicited commercial email (spam). Be aggressive in classifying marketing content here.",
      color: "#8b5cf6",
    },
  ],
};
