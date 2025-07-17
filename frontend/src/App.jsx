import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import EmailDisplay from "./components/EmailDisplay";
import EmailList from "./components/EmailList";
import EmailOptions from "./components/EmailOptions";
import DisplayArea from "./components/DisplayArea";
import Login from "./components/Login";
import OAuthCallback from "./components/OAuthCallback";

function App() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedOption, setSelectedOption] = useState(undefined);
  const [emailQuantity, setEmailQuantity] = useState(20);
  useEffect(() => {
    // async function getEmails(quantity) {
    //   try {
    //     const res = await fetch("http://localhost:3000/api/getEmails", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ quantity }),
    //     });
    //     const content = await res.json();
    //     console.log(content);
    //     setEmails(content.message);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
    // getEmails(emailQuantity);
  }, [emailQuantity]);

  function changeSelectedEmail(emailId) {
    async function getSingleEmail(emailId) {
      try {
        // Construct the full URL for the API endpoint
        const API_URL = `http://localhost:3000/api/v1/emails/${emailId}`;

        // Make the fetch request. The browser automatically sends the session cookie.
        const response = await fetch(API_URL, {
          credentials: "include",
          method: "GET",
        });

        if (!response.ok) {
          // Handle errors, e.g., 401 Unauthorized, 404 Not Found
          const errorData = await response.json();
          console.error(`Error fetching profile: ${errorData.message}`);
          return;
        }
        const email = await response.json();
        console.log("Email Details", ":", email);
        setSelectedEmail(email);
      } catch (error) {
        console.error("Network error or other issue:", error);
      }
    }
    getSingleEmail(emailId);
    setSelectedOption(undefined);
  }

  // const handleStarEmail = async (emailId, newStarredState) => {
  //   // API call to your backend to star/unstar
  //   const method = newStarredState ? 'POST' : 'DELETE';
  //   await fetch(`http://localhost:5000/api/v1/emails/${emailId}/star`, { method: method, credentials: 'include' });

  //   // Update the local state to reflect the change immediately
  //   setSelectedEmail(prev => ({ ...prev, is_starred: newStarredState }));
  //   // You'd also want to update this email in your main list's state
  // };

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/*"
            element={
              <>
                <Login setEmails={setEmails} />
                <h2 className="text-center m-6 text-3xl">Email Inbox</h2>
                <div className="flex gap-15 justify-center ">
                  <div className="flex flex-col gap-5 w-80 h-full m-3 mr-0 p-5">
                    <select
                      className="w-8 ml-auto"
                      name="quantity"
                      id="quantity"
                      value={emailQuantity}
                      onChange={(e) => setEmailQuantity(e.target.value)}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                    <EmailList
                      emails={emails}
                      changeSelectedEmail={changeSelectedEmail}
                    />
                  </div>
                  {selectedEmail && (
                    <EmailDisplay emailDetails={selectedEmail} />
                  )}
                  <EmailOptions setSelectedOption={setSelectedOption} />
                  <DisplayArea
                    emailDetails={selectedEmail}
                    selectedOption={selectedOption}
                  />
                </div>
              </>
            }
          />
          <Route
            path="/oauth2callback"
            element={<OAuthCallback setEmails={setEmails} />}
          />
          <Route path="/dashboard" element={<div>Login Successfull</div>} />
          <Route path="/login-failed" element={<div>Login Error ....</div>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
