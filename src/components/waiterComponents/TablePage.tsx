import React, { useState } from "react";
import Header from "./header";
import LeftPart from "./LeftPart";
import RightPart from "./RightPart";
const TablePage = () => {
  const [selectedTable, setSelectedTable] = useState(null);

  return (
    <div className="ml-10 mt-10 bg-[#FCF9F5]">
      <Header page="select-table" />
      <div className="flex mt-10 gap-10">
        {/* left part */}
        <LeftPart
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
        />

        {/* //right part */}
        <RightPart selectedTable={selectedTable} />
      </div>
    </div>
  );
};

export default TablePage;
