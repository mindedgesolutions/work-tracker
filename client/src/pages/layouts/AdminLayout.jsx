import React from "react";
import "../../assets/dist/css/tabler.min.css";
import "../../assets/dist/css/demo.min.css";

import "../../assets/dist/js/tabler.min.js";
import "../../assets/dist/js/demo.min.js";
import { TopNav, SideBar, Footer } from "../../components/index.js";
import { Outlet, redirect, useNavigate } from "react-router-dom";
import customFetch from "../../../utils/customFetch.js";
import { splitErrors } from "../../../utils/showErrors.jsx";
import { setRoles } from "../../features/masters/roleSlice.js";
import { setProjects } from "../../features/masters/projectSlice.js";
import { setPermissions } from "../../features/masters/permissionSlice.js";
import {
  setLoggedInUser,
  unsetLoggedInUser,
} from "../../features/auth/authSlice.js";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

export const loader = (store) => async () => {
  const { roles } = store.getState().roles;
  const { projects } = store.getState().projects;
  const { permissions } = store.getState().permissions;
  const { loggedInUser } = store.getState().auth;
  try {
    if (roles.length === 0) {
      const dbRole = await customFetch.get(`/masters/all-roles`);
      store.dispatch(setRoles(dbRole.data.data.rows));
    }
    if (projects.length === 0) {
      const dbProject = await customFetch.get(`/masters/all-projects`);
      store.dispatch(setProjects(dbProject.data.data.rows));
    }
    if (permissions.length === 0) {
      const dbPermissions = await customFetch.get(`/masters/all-permissions`);
      store.dispatch(setPermissions(dbPermissions.data.data.rows));
    }
    if (!loggedInUser.id) {
      const user = await customFetch.get(`/auth/user`);
      store.dispatch(setLoggedInUser(user.data.data.rows[0]));
    }
    return null;
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return redirect("/");
  }
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      await customFetch.get(`/auth/logout`);
      toast.success(`You're logged out`);
      dispatch(unsetLoggedInUser());
      navigate("/");
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  return (
    <>
      <TopNav logout={logout} />
      <SideBar />
      <div className="page-wrapper">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default AdminLayout;
