import React from "react";
import { Link } from "react-router-dom";

const ProfileSidebar = () => {
  return (
    <div className="col-12 col-md-3 border-end">
      <div className="card-body">
        <h4 className="subheader">Business settings</h4>
        <div className="list-group list-group-transparent">
          <Link
            to="/profile"
            className="list-group-item list-group-item-action d-flex align-items-center active"
          >
            My Account
          </Link>
          <Link
            to="/change-password"
            className="list-group-item list-group-item-action d-flex align-items-center"
          >
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
