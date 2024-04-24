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

// Loader starts ------
export const loader = (store) => async () => {
  const { loggedInUser } = store.getState().auth;
  try {
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

// Main component starts ------
const UserLayout = () => {
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

export default UserLayout;
