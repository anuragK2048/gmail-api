import { useEffect, useState } from "react";

function DisplayArea({
  emailDetails,
  selectedOption = "Select an Option First",
}) {
  const [output, setOutput] = useState("");
  useEffect(() => {
    setOutput("");
  }, [selectedOption]);
  useEffect(() => {
    if (selectedOption === "Summarize") {
      (async function getSummary(emailDetails) {
        const res = await fetch("http://localhost:3000/api/ai/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailDetails }),
        });
        const result = await res.json();
        console.log(result.summary);
        setOutput(result.summary.summary);
      })(emailDetails);
    }

    if (selectedOption === "Categorize") {
      (async function getCategory(emailDetails) {
        const res = await fetch("http://localhost:3000/api/ai/categorize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailDetails }),
        });
        const result = await res.json();
        console.log(result);
      })(emailDetails);
    }

    if (selectedOption === "Extract Action") {
      (async function getAction(emailDetails) {
        const res = await fetch("http://localhost:3000/api/ai/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailDetails }),
        });
        const result = await res.json();
        console.log(result);
        setOutput(result.summary.actionItems[0]);
      })(emailDetails);
    }

    if (selectedOption === "Create draft") {
      (async function getDraft(emailDetails) {
        const res = await fetch("http://localhost:3000/api/ai/createDraft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailDetails }),
        });
        const result = await res.json();
        console.log(result);
      })(emailDetails);
    }
  }, [selectedOption]);

  return (
    <div className="w-96 flex flex-col bg-slate-400 p-3 gap-3">
      <h3 className="text-center text-lg font-semibold">{selectedOption}</h3>
      <p className="italic">{output}</p>
      {console.log(selectedOption)}
    </div>
  );
}

export default DisplayArea;
