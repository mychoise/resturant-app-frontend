import React, { useState, useEffect } from "react";
import Header from "../../components/waiterComponents/header";
import LeftPart from "../../components/waiterComponents/LeftPart";
import RightPart from "../../components/waiterComponents/RightPart";
import { useWaiterStore } from "../../store/waiter.store";
const TablePage = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const { setTable } = useWaiterStore();

  useEffect(() => {
    setTable(selectedTable);
  }, [selectedTable, setTable]);

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
