import React from "react";
import { Footer, SideBar, TopNav } from "../../components";
import { Outlet, redirect, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setLoggedInUser,
  unsetLoggedInUser,
} from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import customFetch from "../../../utils/customFetch";
import { splitErrors } from "../../../utils/showErrors";
import { setPriorities } from "../../features/common/commonSlice";

// Loader starts ------
export const loader = (store) => async () => {
  const { loggedInUser } = store.getState().auth;
  const { priorities } = store.getState().common;
  try {
    if (!loggedInUser.id) {
      const user = await customFetch.get(`/auth/user`);
      store.dispatch(setLoggedInUser(user.data.data.rows[0]));
    }
    if (priorities.length === 0) {
      const priority = await customFetch.get(`/masters/priorities`);
      store.dispatch(setPriorities(priority.data.data.rows));
    }
    return null;
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return redirect("/");
  }
};

// Main component starts ------
const CommonLayout = () => {
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

export default CommonLayout;
