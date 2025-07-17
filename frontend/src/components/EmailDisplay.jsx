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
import DOMPurify from "dompurify"; // Import for security

// Helper to format dates, kept from your original code
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

// The component now receives the full email object from your DB
function EmailDisplay({ emailDetails, onStar, onArchive, onTrash }) {
  const [expanded, setExpanded] = useState(true);

  if (!emailDetails) {
    // Can show a placeholder or skeleton loader here
    return <div>Select an email to view its details.</div>;
  }

  // --- Data from your database schema ---
  const {
    id,
    subject,
    from_name,
    from_address,
    to_addresses,
    sent_date,
    body_html,
    is_starred,
  } = emailDetails;

  // Create sanitized markup from the HTML content stored in your DB
  const createSanitizedMarkup = () => {
    // **SECURITY**: Sanitize HTML from email to prevent XSS attacks
    const sanitizedHtml = DOMPurify.sanitize(body_html || "");
    return { __html: sanitizedHtml };
  };

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <div className="flex-grow bg-white rounded-lg shadow-md max-h-[85vh] flex flex-col">
      {/* Email Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-normal text-gray-800 truncate pr-4">
            {subject}
          </h2>
          <div className="flex items-center space-x-1 text-gray-500">
            {/* These buttons would call functions passed as props */}
            <button
              onClick={() => onArchive(id)}
              className="hover:bg-gray-100 p-2 rounded-full"
              title="Archive"
            >
              <Archive size={18} />
            </button>
            <button
              onClick={() => onTrash(id)}
              className="hover:bg-gray-100 p-2 rounded-full"
              title="Delete"
            >
              <Trash size={18} />
            </button>
            <button className="hover:bg-gray-100 p-2 rounded-full" title="More">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Email Body & Details */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3 text-lg">
              {from_name ? from_name.charAt(0).toUpperCase() : "?"}
            </div>
            {/* Sender/Recipient Info */}
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-semibold text-gray-800">
                  {from_name || "Unknown Sender"}
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  {from_address}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                to {to_addresses?.join(", ") || "undisclosed-recipients"}
                <button
                  onClick={toggleExpand}
                  className="ml-2 text-gray-500 inline-block align-middle"
                >
                  {expanded ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 flex items-center whitespace-nowrap pl-2">
            {formatDate(sent_date)}
            <button
              onClick={() => onStar(id, !is_starred)}
              className="ml-3 text-gray-400 hover:text-yellow-500"
              title={is_starred ? "Unstar" : "Star"}
            >
              <Star
                size={16}
                className={is_starred ? "fill-current text-yellow-400" : ""}
              />
            </button>
          </div>
        </div>

        {/* Collapsible Email Content */}
        {expanded && (
          <div className="prose prose-sm max-w-none text-gray-800">
            {/* This renders the actual email HTML content safely */}
            <div dangerouslySetInnerHTML={createSanitizedMarkup()} />
          </div>
        )}
      </div>

      {/* Action Buttons Footer */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium text-sm rounded-full hover:bg-gray-100 hover:shadow-sm">
            <Reply size={16} className="mr-2" />
            Reply
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium text-sm rounded-full hover:bg-gray-100 hover:shadow-sm">
            <ReplyAll size={16} className="mr-2" />
            Reply all
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium text-sm rounded-full hover:bg-gray-100 hover:shadow-sm">
            <Forward size={16} className="mr-2" />
            Forward
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailDisplay;
