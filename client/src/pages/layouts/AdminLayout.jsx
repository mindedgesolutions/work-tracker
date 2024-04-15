import React from "react";
import "../../assets/dist/css/tabler.min.css";
import "../../assets/dist/css/demo.min.css";

import "../../assets/dist/js/tabler.min.js";
import "../../assets/dist/js/demo.min.js";
import { TopNav, SideBar, Footer } from "../../components/index.js";
import { Outlet } from "react-router-dom";
import customFetch from "../../../utils/customFetch.js";
import { splitErrors } from "../../../utils/showErrors.jsx";
import { setRoles } from "../../features/masters/roleSlice.js";
import { setProjects } from "../../features/masters/projectSlice.js";

export const loader = (store) => async () => {
  const { roles } = store.getState().roles;
  const { projects } = store.getState().projects;
  try {
    if (roles.length === 0) {
      const dbRole = await customFetch.get(`/masters/all-roles`);
      store.dispatch(setRoles(dbRole.data.data.rows));
    }
    if (projects.length === 0) {
      const dbProject = await customFetch.get(`/masters/all-projects`);
      store.dispatch(setProjects(dbProject.data.data.rows));
    }
    return null;
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return error;
  }
};

const AdminLayout = () => {
  return (
    <>
      <TopNav />
      <SideBar />
      <div className="page-wrapper">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default AdminLayout;
