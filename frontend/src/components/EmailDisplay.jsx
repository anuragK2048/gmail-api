import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Reply,
  ReplyAll,
  Forward,
  MoreHorizontal,
  Star,
  Trash,
  Archive,
} from "lucide-react";

// Function to decode base64 data
const decodeBase64 = (data) => {
  try {
    return atob(data.replace(/-/g, "+").replace(/_/g, "/"));
  } catch (error) {
    console.error("Error decoding base64:", error);
    return "";
  }
};

// Helper function to parse Gmail date format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

// Get sender name from formatted "Name <email>" string
const getSenderName = (from) => {
  const match = from.match(/(.*?)\s*<.*>/);
  return match ? match[1].trim() : from;
};

// Get email address from formatted "Name <email>" string
const getEmailAddress = (from) => {
  const match = from.match(/<(.+?)>/);
  return match ? match[1] : from;
};

function EmailDisplay({ emailDetails }) {
  const [expanded, setExpanded] = useState(true);

  // Extract header information
  const getHeaderValue = (name) => {
    const header = emailDetails.payload.headers.find(
      (h) => h.name.toLowerCase() === name.toLowerCase()
    );
    return header ? header.value : "";
  };

  const subject = getHeaderValue("Subject");
  const from = getHeaderValue("From");
  const to = getHeaderValue("To");
  const date = getHeaderValue("Date");

  // Extract email content (preferring HTML over plain text)
  const htmlContent = emailDetails.payload.parts?.find(
    (part) => part.mimeType === "text/html"
  )?.body?.data;
  const textContent = emailDetails.payload.parts?.find(
    (part) => part.mimeType === "text/plain"
  )?.body?.data;
  const reactionData = emailDetails.payload.parts?.find(
    (part) => part.mimeType === "text/vnd.google.email-reaction+json"
  )?.body?.data;

  // Decode reaction JSON
  let reaction = null;
  if (reactionData) {
    try {
      const decodedReaction = JSON.parse(decodeBase64(reactionData));
      reaction = decodedReaction.emoji;
    } catch (error) {
      console.error("Error parsing reaction:", error);
    }
  }

  // Create markup from HTML content
  const createMarkupFromHtml = () => {
    if (!htmlContent) return { __html: "" };
    const decodedHtml = decodeBase64(htmlContent);
    return { __html: decodedHtml };
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow">
      {/* Email header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl font-medium text-gray-800">{subject}</h2>
          <div className="flex space-x-2">
            <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
              <Archive size={20} />
            </button>
            <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
              <Trash size={20} />
            </button>
            <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
              {getSenderName(from).charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-medium">{getSenderName(from)}</span>
                <span className="text-gray-500 text-sm ml-2">
                  &lt;{getEmailAddress(from)}&gt;
                </span>
                <button className="ml-2 text-gray-400">
                  <Star size={16} />
                </button>
              </div>
              <div className="text-sm text-gray-500">
                to {getEmailAddress(to)}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            {formatDate(date)}
            <button onClick={toggleExpand} className="ml-2 text-gray-500">
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Email body */}
      {expanded && (
        <div className="p-4">
          {/* Email content */}
          <div className="mb-4">
            <div dangerouslySetInnerHTML={createMarkupFromHtml()} />
          </div>

          {/* Email actions */}
          <div className="pt-3 border-t border-gray-200 flex space-x-4">
            <button className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
              <Reply size={18} className="mr-2" />
              Reply
            </button>
            <button className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
              <ReplyAll size={18} className="mr-2" />
              Reply all
            </button>
            <button className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
              <Forward size={18} className="mr-2" />
              Forward
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailDisplay;
