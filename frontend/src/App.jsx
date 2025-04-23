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
    getEmails(2);
  }, []);
  return (
    <>
      {emails.map((email) => (
        <EmailDisplay emailDetails={email} key={email.id} />
      ))}
    </>
  );
}

export default App;
