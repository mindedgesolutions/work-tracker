import React, { useEffect } from "react";
import { lastSixMonths } from "../../../../utils/functions";

const AdminTaskBar = ({ taskBarData, isLoading }) => {
  useEffect(() => {}, [taskBarData]);

  return (
    <div className="col-lg-6">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Task summary</h3>
          {isLoading ? (
            <div>Loading ...</div>
          ) : (
            <div id="apexchartsq68n679s-1"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTaskBar;
