import { useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";

function OAuthCallback({ setEmails }) {
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    console.log(code);

    if (code) {
      fetch("http://localhost:3000/api/oauth2callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("User data from backend:", data);
          setEmails(data.message);
          navigate("/");
        })
        .catch((err) => console.error("OAuth error:", err));
    }
  }, []);
  return <div>...Logging In</div>;
}

export default OAuthCallback;
