function EmailList({ emails, changeSelectedEmail }) {
  return (
    <div className="flex flex-col gap-5 max-h-[60svh] overflow-scroll">
      {emails?.map((emailDetails) => {
        return (
          <div
            key={emailDetails.id}
            className="flex flex-col gap-1 border-2 border-amber-300 p-2"
            onClick={() => changeSelectedEmail(emailDetails.id)}
          >
            <div className="emailId">{emailDetails.id}</div>
            <div className="emailSnippet">{emailDetails.snippet}</div>
          </div>
        );
      })}
    </div>
  );
}

export default EmailList;
