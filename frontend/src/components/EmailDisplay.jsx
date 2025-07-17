import React, { useEffect, useRef, useState } from "react";
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

const sampleEmail = `<!DOCTYPE html><html lang="en"><head><meta name="format-detection" content="email=no"/><meta name="format-detection" content="date=no"/><style nonce="QmEg6FxV_YYAUbuIQ9niCQ">.awl a {color: #FFFFFF; text-decoration: none;} .abml a {color: #000000; font-family: Roboto-Medium,Helvetica,Arial,sans-serif; font-weight: bold; text-decoration: none;} .adgl a {color: rgba(0, 0, 0, 0.87); text-decoration: none;} .afal a {color: #b0b0b0; text-decoration: none;} @media screen and (min-width: 600px) {.v2sp {padding: 6px 30px 0px;} .v2rsp {padding: 0px 10px;}} @media screen and (min-width: 600px) {.mdv2rw {padding: 40px 40px;}} </style><link href="//fonts.googleapis.com/css?family=Google+Sans" rel="stylesheet" type="text/css" nonce="QmEg6FxV_YYAUbuIQ9niCQ"/></head><body style="margin: 0; padding: 0;" bgcolor="#FFFFFF"><table width="100%" height="100%" style="min-width: 348px;" border="0" cellspacing="0" cellpadding="0" lang="en"><tr height="32" style="height: 32px;"><td></td></tr><tr align="center"><td><div itemscope itemtype="//schema.org/EmailMessage"><div itemprop="action" itemscope itemtype="//schema.org/ViewAction"><link itemprop="url" href="https://accounts.google.com/AccountChooser?Email=southindiatrip09@gmail.com&amp;continue=https://myaccount.google.com/alert/nt/1752703332000?rfn%3D127%26rfnc%3D1%26eid%3D8219960705920040816%26et%3D1"/><meta itemprop="name" content="Review Activity"/></div></div><table border="0" cellspacing="0" cellpadding="0" style="padding-bottom: 20px; max-width: 516px; min-width: 220px;"><tr><td width="8" style="width: 8px;"></td><td><div style="background-color: #F5F5F5; direction: ltr; padding: 16px;margin-bottom: 6px;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td style="vertical-align: top;"><img height="20" src="https://www.gstatic.com/accountalerts/email/Icon_recovery_x2_20_20.png"></td><td width="13" style="width: 13px;"></td><td style="direction: ltr;"><span style="font-family: Roboto-Regular,Helvetica,Arial,sans-serif; font-size: 13px; color: rgba(0,0,0,0.87); line-height: 1.6; color: rgba(0,0,0,0.54);">This is a copy of a security alert sent to <a style="text-decoration: none; color: rgba(0,0,0,0.87);">southindiatrip09@gmail.com</a>. <a style="text-decoration: none; color: rgba(0,0,0,0.87);">winzoneg3@gmail.com</a> is the recovery email for this account.</span> <span><span style="font-family: Roboto-Regular,Helvetica,Arial,sans-serif; font-size: 13px; color: rgba(0,0,0,0.87); line-height: 1.6; color: rgba(0,0,0,0.54);">If you don't recognise this account, <a href="https://accounts.google.com/AccountDisavow?adt=AOX8kip5WzV-YJIwKkiFzM4OkvK9rF93SvTeW1NP1nG3_fCIguaBpZ3SjtmqOMg&amp;rfn=127" data-meta-key="disavow" style="text-decoration: none; color: #4285F4;" target="_blank">remove</a> it.</span></span></td></tr></tbody></table></div><div style="border-style: solid; border-width: thin; border-color:#dadce0; border-radius: 8px; padding: 40px 20px;" align="center" class="mdv2rw"><img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_74x24dp.png" width="74" height="24" aria-hidden="true" style="margin-bottom: 16px;" alt="Google"><div style="font-family: &#39;Google Sans&#39;,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;border-bottom: thin solid #dadce0; color: rgba(0,0,0,0.87); line-height: 32px; padding-bottom: 24px;text-align: center; word-break: break-word;"><div style="font-size: 24px;"><a>gmailapitesting</a> was granted access to your linked Google&nbsp;account </div><table align="center" style="margin-top:8px;"><tr style="line-height: normal;"><td align="right" style="padding-right:8px;"><img width="20" height="20" style="width: 20px; height: 20px; vertical-align: sub; border-radius: 50%;;" src="https://lh3.googleusercontent.com/a/ACg8ocKhmBHtzf4sqNbGMHhGICddl8W6zLpVx5VfMh8GvPYSZRBo=s96-c" alt=""></td><td><a style="font-family: &#39;Google Sans&#39;,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color: rgba(0,0,0,0.87); font-size: 14px; line-height: 20px;">southindiatrip09@gmail.com</a></td></tr></table> </div><div style="font-family: Roboto-Regular,Helvetica,Arial,sans-serif; font-size: 14px; color: rgba(0,0,0,0.87); line-height: 20px;padding-top: 20px; text-align: left;"><br>If you did not grant access, you should check this activity and secure your account.<div style="padding-top: 32px; text-align: center;"><a href="https://accounts.google.com/AccountChooser?Email=southindiatrip09@gmail.com&amp;continue=https://myaccount.google.com/alert/nt/1752703332000?rfn%3D127%26rfnc%3D1%26eid%3D8219960705920040816%26et%3D1" target="_blank" link-id="main-button-link" style="font-family: &#39;Google Sans&#39;,Roboto,RobotoDraft,Helvetica,Arial,sans-serif; line-height: 16px; color: #ffffff; font-weight: 400; text-decoration: none;font-size: 14px;display:inline-block;padding: 10px 24px;background-color: #4184F3; border-radius: 5px; min-width: 90px;">Check activity</a></div></div><div style="padding-top: 20px; font-size: 12px; line-height: 16px; color: #5f6368; letter-spacing: 0.3px; text-align: center">You can also see security activity at<br><a style="color: rgba(0, 0, 0, 0.87);text-decoration: inherit;">https://myaccount.google.com/notifications</a></div></div><div style="text-align: left;"><div style="font-family: Roboto-Regular,Helvetica,Arial,sans-serif;color: rgba(0,0,0,0.54); font-size: 11px; line-height: 18px; padding-top: 12px; text-align: center;"><div>You received this email to let you know about important changes to your Google Account and services.</div><div style="direction: ltr;">&copy; 2025 Google LLC, <a class="afal" style="font-family: Roboto-Regular,Helvetica,Arial,sans-serif;color: rgba(0,0,0,0.54); font-size: 11px; line-height: 18px; padding-top: 12px; text-align: center;">1600 Amphitheatre Parkway, Mountain View, CA 94043, USA</a></div></div></div></td><td width="8" style="width: 8px;"></td></tr></table></td></tr><tr height="32" style="height: 32px;"><td></td></tr></table></body></html>`;

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
  const [htmlContent, setHtmlContent] = useState("");
  const [iframeHeight, setIframeHeight] = useState(400);
  const iframeRef = useRef(null);
  const [expanded, setExpanded] = useState(true);

  const updateIframeContent = (content) => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const sanitizedContent = content;

    // Create blob URL for iframe content
    const blob = new Blob([sanitizedContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    iframe.src = url;

    // Clean up blob URL after iframe loads
    iframe.onload = () => {
      URL.revokeObjectURL(url);

      // Auto-resize iframe based on content
      try {
        const iframeDocument =
          iframe.contentDocument || iframe.contentWindow.document;
        // Use body scrollHeight instead of documentElement, and add small delay for accurate measurement
        setTimeout(() => {
          const bodyHeight = iframeDocument.body.scrollHeight;
          const documentHeight = iframeDocument.documentElement.scrollHeight;
          // Use the smaller of the two heights to avoid double sizing
          const actualHeight = Math.min(bodyHeight, documentHeight);
          setIframeHeight(actualHeight + 10); // Reduced padding
        }, 100);
      } catch (e) {
        console.log("Cannot access iframe content for resize:", e);
      }
    };
  };

  // Update iframe when content changes
  useEffect(() => {
    updateIframeContent(emailDetails.body_html);
  }, [emailDetails, expanded]);

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
          <h2 className="text-lg font-normal text-gray-800 truncate pr-4">
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
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white pb-0 p-8">
            <iframe
              ref={iframeRef}
              className="w-full border-none"
              style={{ height: `${iframeHeight}px` }}
              sandbox="allow-same-origin"
              title="Email Content"
            />
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
