import React, { useEffect, useState } from "react";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import Avatar from "../assets/dist/images/000m.jpg";
import { Link } from "react-router-dom";
import { FaRegBell } from "react-icons/fa";
import { useSelector } from "react-redux";

const TopNav = ({ logout }) => {
  const { loggedInUser } = useSelector((store) => store.auth);
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("theme") === "dark" ? true : false
  );

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    const theme = newTheme === true ? "dark" : "";
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-bs-theme", theme);
  };

  useEffect(() => {
    document.body.setAttribute("data-bs-theme", localStorage.getItem("theme"));
  }, [isDarkTheme]);

  return (
    <header className="navbar navbar-expand-md d-none d-lg-flex d-print-none">
      <div className="container-xl">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar-menu"
          aria-controls="navbar-menu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-nav flex-row order-md-last">
          <div className="d-none d-md-flex">
            {!isDarkTheme ? (
              <BsMoonFill
                className="nav-link px-0 me-2 mt-2 cursor-pointer"
                onClick={toggleTheme}
              />
            ) : (
              <BsSunFill
                className="nav-link px-0 me-2 mt-2 cursor-pointer"
                onClick={toggleTheme}
              />
            )}
          </div>
          <div className="nav-item dropdown d-none d-md-flex me-4">
            <a href="#" className="nav-link px-0" data-bs-toggle="dropdown">
              <FaRegBell size={18} />
              <span className="badge bg-red">1</span>
            </a>

            <div className="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Last updates</h3>
                </div>
                <div className="list-group list-group-flush list-group-hoverable">
                  <div className="list-group-item">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <span className="status-dot status-dot-animated bg-red d-block"></span>
                      </div>
                      <div className="col text-truncate">
                        <a href="#" className="text-body d-block">
                          Example 1
                        </a>
                        <div className="d-block text-muted text-truncate mt-n1">
                          Change deprecated html tags to text decoration classes
                          (#29604)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="nav-item dropdown">
            <a
              href="#"
              className="nav-link d-flex lh-1 text-reset p-0"
              data-bs-toggle="dropdown"
              aria-label="Open user menu"
            >
              <img src={Avatar} className="avatar avatar-sm" alt="" />
              <div className="d-none d-xl-block ps-2">
                <div className="fw-bold">
                  {loggedInUser?.name?.toUpperCase()}
                </div>
                <div className="mt-1 small text-muted">
                  {loggedInUser?.email}
                </div>
              </div>
            </a>
            <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <Link to="/profile" className="dropdown-item">
                Profile
              </Link>
              <Link to="/change-password" className="dropdown-item">
                Change Password
              </Link>
              <button type="button" className="dropdown-item" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div></div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
