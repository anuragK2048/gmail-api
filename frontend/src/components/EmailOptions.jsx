function EmailOptions({ setSelectedOption }) {
  return (
    <div className="flex flex-col gap-8 mt-10">
      <button
        className="p-1 text-md bg-amber-200 border-1 border-amber-800 rounded-2xl"
        value="Summarize"
        onClick={(e) => setSelectedOption(e.target.value)}
      >
        Summarize
      </button>
      <button
        className="p-1 text-md bg-amber-200 border-1 border-amber-800 rounded-2xl"
        value="Categorize"
        onClick={(e) => setSelectedOption(e.target.value)}
      >
        Categorize
      </button>
      <button
        className="p-1 text-md bg-amber-200 border-1 border-amber-800 rounded-2xl"
        value="Extract Action"
        onClick={(e) => setSelectedOption(e.target.value)}
      >
        Extract Action
      </button>
      <button
        className="p-1 text-md bg-amber-200 border-1 border-amber-800 rounded-2xl"
        value="Create draft"
        onClick={(e) => setSelectedOption(e.target.value)}
      >
        Create draft
      </button>
    </div>
  );
}

export default EmailOptions;
