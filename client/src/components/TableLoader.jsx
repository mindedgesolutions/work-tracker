import React from "react";
import Logo from "../assets/dist/images/logo.png";

const TableLoader = () => {
  return (
    <div className="page page-center bg-secondary vh-80">
      <div className="container container-slim py-4">
        <div className="text-center">
          <div className="mb-3">
            <a href="." className="navbar-brand navbar-brand-autodark">
              {/* <img src={Logo} alt={import.meta.env.VITE_ADMIN_TITLE} /> */}
              Loading data ...
            </a>
          </div>
          <h3 className="text-muted mb-3">Loading data ...</h3>
          <div className="progress progress-sm">
            <div className="progress-bar progress-bar-indeterminate"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableLoader;
