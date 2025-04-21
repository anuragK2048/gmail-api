// frontend: EmailList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function EmailList() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedEmail, setExpandedEmail] = useState(null);

    useEffect(() => {
        async function fetchEmails() {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/emails"
                );
                setEmails(
                    Array.isArray(response.data)
                        ? response.data
                        : [response.data]
                );
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchEmails();
    }, []);

    const toggleEmailExpansion = (index) => {
        if (expandedEmail === index) {
            setExpandedEmail(null);
        } else {
            setExpandedEmail(index);
        }
    };

    // Helper function to convert Gmail system labels to more readable format
    const formatLabel = (label) => {
        // Remove CATEGORY_ prefix
        if (label.startsWith("CATEGORY_")) {
            return label.replace("CATEGORY_", "").toLowerCase();
        }

        // Make other system labels more readable
        return label
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    if (loading) {
        return <p>Loading emails...</p>;
    }

    if (error) {
        console.error("Error fetching emails:", error);
        return <p>Error fetching emails: {error.message}</p>;
    }

    if (emails.length === 0) {
        return <p>No emails found.</p>;
    }

    return (
        <div>
            <h2>Recent Emails</h2>
            {emails.map((email, index) => (
                <div
                    key={index}
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "15px",
                        marginBottom: "15px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    <h3 style={{ margin: "0 0 10px 0" }}>
                        Subject: {email.subject}
                    </h3>
                    <p style={{ margin: "5px 0" }}>From: {email.from}</p>
                    <p style={{ margin: "5px 0" }}>Date: {email.date}</p>

                    {/* Display labels */}
                    {email.labels && email.labels.length > 0 && (
                        <div style={{ margin: "10px 0" }}>
                            <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                                Labels:
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "5px",
                                }}
                            >
                                {email.labels.map((label, labelIndex) => (
                                    <span
                                        key={labelIndex}
                                        style={{
                                            backgroundColor: "#f0f0f0",
                                            border: "1px solid #ddd",
                                            borderRadius: "16px",
                                            padding: "3px 10px",
                                            fontSize: "12px",
                                        }}
                                    >
                                        {formatLabel(label)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: "10px" }}>
                        <button
                            onClick={() => toggleEmailExpansion(index)}
                            style={{
                                background: "#f0f0f0",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                padding: "5px 10px",
                                cursor: "pointer",
                            }}
                        >
                            {expandedEmail === index
                                ? "Hide Content"
                                : "Show Content"}
                        </button>
                    </div>
                    {expandedEmail === index && (
                        <div
                        //     style={{
                        //         marginTop: "15px",
                        //         padding: "10px",
                        //         border: "1px solid #eee",
                        //         borderRadius: "4px",
                        //         backgroundColor: "#fafafa",
                        //         maxHeight: "400px",
                        //         overflow: "auto",
                        //     }}
                        >
                            <div
                                dangerouslySetInnerHTML={{ __html: email.body }}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default EmailList;
