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

export const loader = (store) => async () => {
  const { roles } = store.getState().roles;
  try {
    if (roles.length === 0) {
      const response = await customFetch.get(`/masters/all-roles`);
      store.dispatch(setRoles(response.data.data.rows));
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
