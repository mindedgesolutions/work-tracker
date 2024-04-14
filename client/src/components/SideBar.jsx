import React from "react";
import Logo from "../assets/dist/images/logo.png";
import Avatar from "../assets/dist/images/000m.jpg";
import { Link } from "react-router-dom";
import { AiOutlineHome, AiOutlineFile } from "react-icons/ai";
import { BsFillMoonFill, BsSunFill, BsGraphUpArrow } from "react-icons/bs";
import { GrUserSettings } from "react-icons/gr";
import { FiUsers } from "react-icons/fi";

const SideBar = () => {
  return (
    <aside
      className="navbar navbar-vertical navbar-expand-lg"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebar-menu"
          aria-controls="sidebar-menu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <h1 className="navbar-brand navbar-brand-autodark mb-3">
          <Link to="/admin/dashboard">
            <img
              src={Logo}
              style={{ height: "40px" }}
              alt={import.meta.env.VITE_ADMIN_TITLE}
            />
          </Link>
        </h1>
        <div className="navbar-nav flex-row d-lg-none">
          <div className="nav-item d-none d-lg-flex me-3">
            <div className="btn-list"></div>
          </div>

          <div className="d-none d-lg-flex">
            <BsFillMoonFill className="nav-link px-0 hide-theme-dark cursor-pointer" />
            <BsSunFill className="nav-link px-0 hide-theme-light cursor-pointer" />
          </div>
          <div className="nav-item dropdown">
            <a
              href="#"
              className="nav-link d-flex lh-1 text-reset p-0"
              data-bs-toggle="dropdown"
              aria-label="Open user menu"
            >
              <img
                src={Avatar}
                className="avatar avatar-sm cursor-pointer"
                alt="karmasathi"
              />
            </a>
            <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <a href="./sign-in.html" className="dropdown-item">
                Logout
              </a>
            </div>
          </div>
        </div>
        <div className="collapse navbar-collapse" id="sidebar-menu">
          <ul className="navbar-nav pt-lg-3">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/dashboard">
                <span className="nav-link-icon d-md-none d-lg-inline-block">
                  <AiOutlineHome size={18} />
                </span>
                <span className="nav-link-title">Home</span>
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#navbar-extra"
                data-bs-toggle="dropdown"
                data-bs-auto-close="false"
                role="button"
                aria-expanded="false"
              >
                <span className="nav-link-icon d-md-none d-lg-inline-block">
                  <GrUserSettings size={14} />
                </span>
                <span className="nav-link-title">Roles & Permissions</span>
              </a>
              <div className="dropdown-menu">
                <div className="dropdown-menu-columns">
                  <div className="dropdown-menu-column">
                    <Link to="/admin/roles" className="dropdown-item">
                      Roles
                    </Link>
                    <Link to="/admin/permissions" className="dropdown-item">
                      Permissions
                    </Link>
                    <Link to="/admin/projects" className="dropdown-item">
                      Projects
                    </Link>
                    <Link
                      to="/admin/role-permissions"
                      className="dropdown-item"
                    >
                      Permissions (Role-wise)
                    </Link>
                    <Link
                      to="/admin/user-permissions"
                      className="dropdown-item"
                    >
                      Permissions (User-wise)
                    </Link>
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/users">
                <span className="nav-link-icon d-md-none d-lg-inline-block">
                  <FiUsers size={18} />
                </span>
                <span className="nav-link-title">Users</span>
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#navbar-extra"
                data-bs-toggle="dropdown"
                data-bs-auto-close="false"
                role="button"
                aria-expanded="false"
              >
                <span className="nav-link-icon d-md-none d-lg-inline-block">
                  <AiOutlineFile size={18} />
                </span>
                <span className="nav-link-title">Applications</span>
              </a>
              <div className="dropdown-menu">
                <div className="dropdown-menu-columns">
                  <div className="dropdown-menu-column">
                    <Link to="/admin/applications" className="dropdown-item">
                      All applications
                    </Link>
                    <Link
                      to="/admin/search-application"
                      className="dropdown-item"
                    >
                      Search application
                    </Link>
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/reports">
                <span className="nav-link-icon d-md-none d-lg-inline-block">
                  <BsGraphUpArrow size={16} />
                </span>
                <span className="nav-link-title">Reports</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
