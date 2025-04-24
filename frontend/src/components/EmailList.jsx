function EmailList({ emails, setSelectedEmail }) {
  return (
    <div className="flex flex-col gap-5">
      {emails.map((emailDetail) => {
        return (
          <div
            key={emailDetail.id}
            className="flex flex-col gap-1 border-2 border-amber-300 p-2"
            onClick={() => setSelectedEmail(emailDetail)}
          >
            <div className="emailId">{emailDetail.id}</div>
            <div className="emailSnippet">{emailDetail.snippet}</div>
          </div>
        );
      })}
    </div>
  );
}

export default EmailList;
