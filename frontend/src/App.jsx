import { useEffect, useState } from "react";
import EmailDisplay from "./components/EmailDisplay";

function App() {
  const [emails, setEmails] = useState([]);
  useEffect(() => {
    async function getEmails(quantity) {
      try {
        const res = await fetch("http://localhost:3000/api/getEmails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        });
        const content = await res.json();
        console.log(content);
        setEmails(content.message);
      } catch (err) {
        console.log(err);
      }
    }
    getEmails(20);
  }, []);
  return (
    <>
      <h2 className="text-center m-6 text-3xl">Email Inbox</h2>
      <div className="flex flex-col gap-10 items-center">
        {emails.map((email) => (
          <EmailDisplay emailDetails={email} key={email.id} />
        ))}
      </div>
    </>
  );
}

export default App;
