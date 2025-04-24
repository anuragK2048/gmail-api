function DisplayArea({ selectedOption = "Select an Option First" }) {
  return (
    <div className="w-96 flex flex-col bg-slate-400 p-3">
      <h3 className="text-center text-lg font-semibold">{selectedOption}</h3>
    </div>
  );
}

export default DisplayArea;
