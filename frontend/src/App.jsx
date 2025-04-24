import { useEffect, useState } from "react";
import EmailDisplay from "./components/EmailDisplay";
import EmailList from "./components/EmailList";
import EmailOptions from "./components/EmailOptions";
import DisplayArea from "./components/DisplayArea";

function App() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState({});
  const [selectedOption, setSelectedOption] = useState(undefined);
  const [emailQuantity, setEmailQuantity] = useState(4);
  useEffect(() => {
    async function getEmails(quantity) {
      try {
        const res = await fetch("http://localhost:3000/api/getEmails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        });
        const content = await res.json();
        // console.log(content);
        setEmails(content.message);
      } catch (err) {
        console.log(err);
      }
    }
    getEmails(emailQuantity);
  }, [emailQuantity]);
  return (
    <>
      <h2 className="text-center m-6 text-3xl">Email Inbox</h2>
      <div className="flex gap-3 justify-center">
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
          <EmailList emails={emails} setSelectedEmail={setSelectedEmail} />
        </div>
        {Object.keys(selectedEmail).length !== 0 && (
          <EmailDisplay emailDetails={selectedEmail} />
        )}
        <EmailOptions setSelectedOption={setSelectedOption} />
        <DisplayArea
          emailDetails={selectedEmail}
          selectedOption={selectedOption}
        />
      </div>
    </>
  );
}

export default App;
