export const newUserDefaults = {
  defaultLabels: [
    {
      name: "Receipts & Invoices",
      prompt:
        "Classify this email if it is a receipt, invoice, billing statement, confirmation of purchase, or any financial transaction summary. Do not classify shipping notifications unless they contain pricing.",
    },
    {
      name: "Travel",
      prompt:
        "Classify this email if it relates to travel, such as flight confirmations, hotel bookings, rental car reservations, travel itineraries, or visa information.",
    },
    {
      name: "Action Required",
      prompt:
        "Classify this email if it contains a direct question, a request for a specific action, a task assignment, or a clear deadline that the recipient needs to act upon.",
    },
    {
      name: "Shipment Tracking",
      prompt:
        "Classify this email if its primary purpose is to provide a shipping confirmation, a tracking number, or an update on the delivery status of a physical item.",
    },
    {
      name: "Newsletters",
      prompt:
        "Classify this email if it is a regularly scheduled update, newsletter, promotional bulletin, or informational digest from a company, organization, or publication that the user subscribed to.",
    },
    {
      name: "Meeting & Calendar",
      prompt:
        "Classify this email if it is a calendar invitation, a meeting request, an agenda for a meeting, a scheduling confirmation (like from Calendly), or a discussion about setting up a meeting.",
    },
  ],
};
