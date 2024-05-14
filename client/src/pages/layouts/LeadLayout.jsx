import React from "react";
import { splitErrors } from "../../../utils/showErrors";
import { Outlet, redirect, useNavigate } from "react-router-dom";
import customFetch from "../../../utils/customFetch";
import {
  setLoggedInUser,
  unsetLoggedInUser,
} from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Footer, SideBar, TopNav } from "../../components";
import { setTeamMembers } from "../../features/masters/teamSlice";

// Loader starts ------
export const loader = (store) => async () => {
  const { loggedInUser } = store.getState().auth;
  const { teamMembers } = store.getState().teams;
  try {
    if (!loggedInUser.id) {
      const user = await customFetch.get(`/auth/user`);
      store.dispatch(setLoggedInUser(user.data.data.rows[0]));
    }
    if (teamMembers.length === 0) {
      const members = await customFetch.get(`/masters/team-members`);
      store.dispatch(setTeamMembers(members.data.data.rows));
    }
    return null;
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return redirect("/");
  }
};

// Main component starts ------
const LeadLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await customFetch.get(`/auth/logout`);
      dispatch(unsetLoggedInUser());
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

export default LeadLayout;
