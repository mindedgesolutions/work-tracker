import React from "react";
import {
  setLoggedInUser,
  unsetLoggedInUser,
} from "../../features/auth/authSlice";
import customFetch from "../../../utils/customFetch";
import { splitErrors } from "../../../utils/showErrors";
import { Outlet, redirect, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Footer, SideBar, TopNav } from "../../components";
import {
  setProjects,
  unsetProjects,
} from "../../features/masters/projectSlice";
import { setPriorities } from "../../features/common/commonSlice";

// Loader starts ------
export const loader = (store) => async () => {
  const { loggedInUser } = store.getState().auth;
  const { projects } = store.getState().projects;
  const { priorities } = store.getState().common;

  let userid = "";
  try {
    if (!loggedInUser.id) {
      const user = await customFetch.get(`/auth/user`);
      store.dispatch(setLoggedInUser(user.data.data.rows[0]));
      userid = user.data.data.rows[0].id;
    } else {
      userid = loggedInUser.id;
    }
    let allPr = [];
    if (projects.length === 0) {
      const pr = await customFetch.get(`/masters/projects/user/${userid}`);
      pr?.data?.data?.rows?.map((i) => {
        const element = { id: i.project_id, name: i.name };
        allPr.push(element);
      });
      store.dispatch(setProjects(allPr));
    }
    if (priorities.length === 0) {
      const dbPriorities = await customFetch.get(`/masters/priorities`);
      store.dispatch(setPriorities(dbPriorities.data.data.rows));
    }

    return null;
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return redirect("/");
  }
};

// Main component starts ------
const UserLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await customFetch.get(`/auth/logout`);
      dispatch(unsetLoggedInUser());
      dispatch(unsetProjects());
      toast.success(`You're logged out`);
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

export default UserLayout;
