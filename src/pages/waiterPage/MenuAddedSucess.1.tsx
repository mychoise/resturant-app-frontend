import type React from "react";

export const MenuAddedSucess = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-green-400 w-150 h-150">
        <div>
          <div>
            <Tick size={50} color="white" />
          </div>
        </div>
      </div>
    </div>
  );
};
