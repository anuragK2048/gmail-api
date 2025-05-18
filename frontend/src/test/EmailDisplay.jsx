// EmailDisplay.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import analyzeEmailWithLLM from "./LLMApiCall";

// --- Icon SVGs (Heroicons - paste them back here) ---
const StarIcon = ({ filled, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className || "w-5 h-5"}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
  </svg>
);
const ReplyIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className || "w-5 h-5"}
  >
    <path
      fillRule="evenodd"
      d="M10.78 4.47a.75.75 0 0 0-1.06 0L3.97 10.22a.75.75 0 0 0 0 1.06l5.75 5.75a.75.75 0 1 0 1.06-1.06L6.56 11.5h10.94a.75.75 0 0 0 0-1.5H6.56l4.22-4.22a.75.75 0 0 0 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className || "w-5 h-5"}
  >
    <path
      fillRule="evenodd"
      d="M3.75 15a.75.75 0 0 0 .75.75h13.19l-4.22 4.22a.75.75 0 1 0 1.06 1.06l5.75-5.75a.75.75 0 0 0 0-1.06l-5.75-5.75a.75.75 0 1 0-1.06 1.06L17.69 14.25H4.5a.75.75 0 0 0-.75.75Z"
      clipRule="evenodd"
    />
  </svg>
);
const TrashIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || "w-5 h-5"}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.342.052.682.107 1.022.166m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);
const ArchiveIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || "w-5 h-5"}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
    />
  </svg>
);
const EllipsisVerticalIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className || "w-5 h-5"}
  >
    <path
      fillRule="evenodd"
      d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
      clipRule="evenodd"
    />
  </svg>
);
const ChevronDownIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className || "w-5 h-5"}
  >
    <path
      fillRule="evenodd"
      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);
const PaperClipIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || "w-5 h-5"}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3.375 3.375 0 0 1 19.5 7.372l-10.94 10.94a2.25 2.25 0 0 1-3.182-3.182m3.182 3.182L10.5 12.75m7.693 7.693-3.182-3.182m0 0A2.25 2.25 0 0 1 12.75 10.5m0 0L15 8.25m-2.25 2.25L12.75 10.5m0 0L10.5 12.75m2.25-2.25m0 0L15 8.25m-2.25 2.25L12.75 10.5"
    />
  </svg>
);

// --- Helper Functions (same as before) ---
const getHeaderValue = (headers, name) => {
  const header = headers.find(
    (h) => h.name.toLowerCase() === name.toLowerCase()
  );
  return header ? header.value : "";
};

const decodeBase64Url = (base64Url) => {
  if (!base64Url) return "";
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder("utf-8").decode(bytes);
  } catch (e) {
    console.error(
      "Failed to decode base64url string or interpret as UTF-8:",
      base64Url,
      e
    );
    try {
      return atob(base64);
    } catch (e2) {
      console.error("Fallback atob failed:", e2);
      return "";
    }
  }
};

const findPartByMimeType = (parts, mimeType) => {
  for (const part of parts) {
    if (part.mimeType === mimeType && part.body && part.body.data) {
      return decodeBase64Url(part.body.data);
    }
    if (part.parts) {
      const found = findPartByMimeType(part.parts, mimeType);
      if (found) return found;
    }
  }
  return null;
};

const getAttachments = (payload) => {
  const attachments = [];
  const findAttachmentsRecursive = (parts) => {
    if (!parts) return;
    for (const part of parts) {
      if (
        part.filename &&
        part.filename.length > 0 &&
        part.body?.attachmentId
      ) {
        attachments.push({
          filename: part.filename,
          mimeType: part.mimeType,
          size: part.body.size,
          attachmentId: part.body.attachmentId,
          partId: part.partId,
        });
      }
      if (part.parts) {
        findAttachmentsRecursive(part.parts);
      }
    }
  };
  if (payload.parts) {
    findAttachmentsRecursive(payload.parts);
  } else if (
    payload.filename &&
    payload.filename.length > 0 &&
    payload.body?.attachmentId
  ) {
    attachments.push({
      filename: payload.filename,
      mimeType: payload.mimeType,
      size: payload.body.size,
      attachmentId: payload.body.attachmentId,
      partId: payload.partId,
    });
  }
  return attachments;
};

// --- Configurable Constants for Iframe Height ---
const IFRAME_MIN_HEIGHT = 400; // Default minimum height. The original "good" one used 500.
const IFRAME_HEIGHT_BUFFER = 30; // Extra pixels to prevent scrollbars.
const IFRAME_LOAD_DELAY = 200; // Milliseconds to wait after 'load' before measuring height. (Original was 100ms)

const EmailDisplay = ({ email, setEmailData }) => {
  if (!email || !email.payload) {
    return (
      <div className="p-4 text-red-500">
        Error: Email data is not available or malformed.
      </div>
    );
  }

  const { id, threadId, labelIds, snippet, payload, internalDate } = email;
  const headers = payload.headers || [];

  const [showDetails, setShowDetails] = useState(false);
  const [isStarred, setIsStarred] = useState(
    labelIds?.includes("STARRED") || false
  );
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const iframeRef = useRef(null);

  const emailData = useMemo(() => {
    // ... (email data parsing logic - same as your last working version)
    const fromHeader = getHeaderValue(headers, "From");
    const toHeader = getHeaderValue(headers, "To");
    const ccHeader = getHeaderValue(headers, "Cc");
    const bccHeader = getHeaderValue(headers, "Bcc");
    const subject = getHeaderValue(headers, "Subject");
    const date = getHeaderValue(headers, "Date");
    const messageId = getHeaderValue(headers, "Message-ID");
    let fromName = fromHeader;
    let fromEmail = "";
    const fromMatch = fromHeader.match(/(.*)<(.*)>/);
    if (fromMatch) {
      fromName = fromMatch[1].trim();
      fromEmail = fromMatch[2].trim();
    } else {
      fromEmail = fromHeader.trim();
    }
    const avatarChar = fromName
      ? fromName.charAt(0).toUpperCase()
      : fromEmail
      ? fromEmail.charAt(0).toUpperCase()
      : "?";
    let htmlBody = "";
    let textBody = "";
    if (payload.mimeType === "text/html" && payload.body?.data) {
      htmlBody = decodeBase64Url(payload.body.data);
    } else if (payload.mimeType === "text/plain" && payload.body?.data) {
      textBody = decodeBase64Url(payload.body.data);
    } else if (payload.parts) {
      htmlBody = findPartByMimeType(payload.parts, "text/html") || "";
      if (!htmlBody) {
        textBody = findPartByMimeType(payload.parts, "text/plain") || "";
      }
    }
    const attachments = getAttachments(payload);
    return {
      from: { name: fromName, email: fromEmail, avatarChar },
      to: toHeader
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean),
      cc: ccHeader
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean),
      bcc: bccHeader
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean),
      subject,
      date: date
        ? new Date(date).toLocaleString()
        : new Date(parseInt(internalDate)).toLocaleString(),
      messageId,
      htmlBody,
      textBody,
      attachments,
    };
  }, [payload, headers, internalDate]);

  useEffect(() => {
    const currentIframe = iframeRef.current;
    if (!currentIframe || !emailData.htmlBody) {
      return;
    }

    const adjustIframeContentHeight = () => {
      if (
        currentIframe.contentWindow &&
        currentIframe.contentWindow.document.body
      ) {
        // 1. Reset height to 'auto' to let the browser calculate natural height
        currentIframe.style.height = "auto";

        const body = currentIframe.contentWindow.document.body;
        const html = currentIframe.contentWindow.document.documentElement;

        // 2. Get the scrollHeight (max of body/html scrollHeight and offsetHeight)
        const contentScrollHeight = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.scrollHeight,
          html.offsetHeight,
          html.clientHeight
        );

        // 3. Set the new height
        currentIframe.style.height = `${Math.max(
          IFRAME_MIN_HEIGHT,
          contentScrollHeight + IFRAME_HEIGHT_BUFFER
        )}px`;
      } else {
        // Fallback if iframe body is not accessible
        currentIframe.style.height = `${IFRAME_MIN_HEIGHT}px`;
      }
    };

    const handleLoad = () => {
      // Use setTimeout to allow content (like images) to load and affect scrollHeight
      const timerId = setTimeout(() => {
        if (iframeRef.current) {
          // Ensure iframe still exists
          adjustIframeContentHeight();
        }
      }, IFRAME_LOAD_DELAY);
      return () => clearTimeout(timerId); // Return a cleanup for this timeout
    };

    // Add event listener
    currentIframe.addEventListener("load", handleLoad);

    // Attempt an initial adjustment if already loaded (e.g. from cache or fast srcDoc render)
    if (
      currentIframe.contentWindow &&
      currentIframe.contentWindow.document.readyState === "complete"
    ) {
      handleLoad(); // This will also run its own setTimeout
    } else {
      // Set a sensible initial minimum height before load
      currentIframe.style.height = `${IFRAME_MIN_HEIGHT}px`;
    }

    // Cleanup function for the useEffect
    return () => {
      currentIframe.removeEventListener("load", handleLoad);
      // Any timeouts created directly in handleLoad will be cleaned by its own returned function
      // if handleLoad itself is structured to return a cleanup.
      // However, the way handleLoad is defined now, it's better to clear any *potential* pending timeout from its last call.
      // This part is tricky as timerId from handleLoad is scoped within it.
      // For this structure, the primary cleanup is removing the event listener.
    };
  }, [emailData.htmlBody]); // Re-run if HTML body content changes

  // Action Handlers (Placeholders - same as before)
  const handleReply = () => console.log("Reply to:", email.id);
  const handleReplyAll = () => console.log("Reply All to:", email.id);
  const handleForward = () => console.log("Forward:", email.id);
  const handleDelete = () => console.log("Delete:", email.id);
  const handleArchive = () => console.log("Archive:", email.id);
  const handleMarkAsUnread = () => console.log("Mark as Unread:", email.id);
  const handleReportSpam = () => console.log("Report Spam:", email.id);
  const handleSnooze = () => console.log("Snooze:", email.id);
  const handleAddToTasks = () => console.log("Add to Tasks:", email.id);
  const toggleStar = () => {
    setIsStarred(!isStarred);
    console.log("Toggle Star:", email.id, "New status:", !isStarred);
  };
  const handleDownloadAttachment = (attachment) => {
    console.log("Download att:", attachment.filename);
    alert(`Simulating download: ${attachment.filename}`);
  };

  async function aiGeneration(emailData, labels) {
    analyzeEmailWithLLM(emailData, labels)
      .then((analysis) => {
        console.log("LLM Analysis:", analysis);
        // Now you can use analysis.classification, analysis.summary, etc. in your UI
      })
      .catch((err) => {
        console.error("Failed to get LLM analysis:", err);
      });
  }

  return (
    <div className="bg-white shadow-lg rounded-lg mx-auto max-w-4xl my-8 p-0 overflow-hidden">
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h1
            className="text-2xl font-normal text-gray-800 mr-4 truncate"
            title={emailData.subject}
          >
            {emailData.subject || "(no subject)"}
          </h1>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleReply}
              title="Reply"
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <ReplyIcon />
            </button>
            <button
              onClick={handleDelete}
              title="Delete"
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <TrashIcon />
            </button>
            <button
              onClick={handleArchive}
              title="Archive"
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <ArchiveIcon />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMoreOptions((prev) => !prev)}
                title="More options"
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
              >
                <EllipsisVerticalIcon />
              </button>
              {showMoreOptions && (
                <div
                  onClick={() => setShowMoreOptions(false)}
                  onMouseLeave={() => setShowMoreOptions(false)}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-20 py-1"
                >
                  <a
                    onClick={handleMarkAsUnread}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mark as unread
                  </a>
                  <a
                    onClick={handleReportSpam}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Report spam
                  </a>
                  {/* ... other options ... */}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {labelIds &&
            labelIds
              .filter(
                (l) =>
                  !["UNREAD", "INBOX", "STARRED", "IMPORTANT"].includes(l) &&
                  !l.startsWith("CATEGORY_")
              )
              .map((label) => (
                <span
                  key={label}
                  className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-md"
                >
                  {label.replace(/_/g, " ").toLowerCase()}
                </span>
              ))}
        </div>
      </div>

      {/* Sender/Recipient Info */}
      <div className="px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div
              className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-semibold mr-3"
              title={emailData.from.email}
            >
              {emailData.from.avatarChar}
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-800">
                  {emailData.from.name || emailData.from.email}
                </span>
                {emailData.from.name && (
                  <span className="text-sm text-gray-500 ml-2">
                    {emailData.from.email}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                to{" "}
                {emailData.to.length > 1
                  ? `${emailData.to[0]} and ${emailData.to.length - 1} others`
                  : emailData.to.join(", ") || "me"}
                <button
                  onClick={() => setShowDetails((prev) => !prev)}
                  className="ml-2 text-blue-600 hover:underline focus:outline-none"
                >
                  <ChevronDownIcon
                    className={`inline-block w-4 h-4 transition-transform duration-200 ${
                      showDetails ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {emailData.date}
            </span>
            <button
              onClick={toggleStar}
              title={isStarred ? "Starred" : "Not starred"}
              className={`ml-2 p-1 rounded-full ${
                isStarred
                  ? "text-yellow-500"
                  : "text-gray-400 hover:text-yellow-400"
              }`}
            >
              <StarIcon filled={isStarred} />
            </button>
          </div>
        </div>
        {showDetails && (
          <div className="mt-3 pl-12 text-xs text-gray-600 bg-gray-50 p-3 rounded-md border">
            {" "}
            {/* ... details ... */}{" "}
          </div>
        )}
      </div>

      {/* Email Body */}
      <div className="px-6 pb-6 pt-2">
        {emailData.htmlBody ? (
          <iframe
            key={id || emailData.htmlBody.substring(0, 50)} // Use message ID or part of body for key
            ref={iframeRef}
            srcDoc={emailData.htmlBody}
            title="Email Content"
            className="w-full border-0"
            style={{
              minHeight: `${IFRAME_MIN_HEIGHT}px`,
              height: `${IFRAME_MIN_HEIGHT}px`,
            }} // Initial height
            sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            scrolling="no"
          />
        ) : (
          <pre className="whitespace-pre-wrap text-sm text-gray-700 p-4 bg-gray-50 rounded-md border">
            {emailData.textBody || snippet || "(No content to display)"}
          </pre>
        )}
      </div>

      {/* Attachments & Action Buttons (same as before) */}
      {emailData.attachments && emailData.attachments.length > 0 && (
        <div className="px-6 pb-6">
          Attachements
          {emailData.attachments.map((val, i) => (
            <div key={i}>{val.filename}</div>
          ))}{" "}
        </div>
      )}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center space-x-3">
        {" "}
        {/* ... action buttons JSX ... */}{" "}
      </div>
      <button
        className="p-2 text-lg border-2 border-orange-700 rounded-2xl"
        onClick={() =>
          aiGeneration(emailData, [
            "Urgent",
            "Support Request",
            "Invoice",
            "Meeting",
            "Project Update",
            "Spam",
            "CATEGORY_PROMOTIONS",
          ])
        }
      >
        AI
      </button>
    </div>
  );
};

export default EmailDisplay;
