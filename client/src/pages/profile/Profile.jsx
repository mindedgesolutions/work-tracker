import React, { useState } from "react";
import { PageWrapper, ProfileSidebar } from "../../components";
import avatar from "../../assets/dist/images/000m.jpg";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../../../utils/customFetch";
import { splitErrors } from "../../../utils/showErrors";
import { toast } from "react-toastify";
import { setLoggedInUser } from "../../features/auth/authSlice";

const Profile = () => {
  const { loggedInUser } = useSelector((store) => store.auth);
  const [form, setForm] = useState({
    name: loggedInUser.name || "",
    email: loggedInUser.email || "",
    mobile: loggedInUser.mobile,
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    let data = Object.fromEntries(formData);
    try {
      await customFetch.post(`/user/update-profile`, data);

      const user = await customFetch.get(`/auth/user`);
      dispatch(setLoggedInUser(user.data.data.rows[0]));

      setIsLoading(false);
      toast.success(`Data updated`);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">Account Settings</h2>
            </div>
          </div>
        </div>
      </div>

      <PageWrapper>
        <div className="page-body">
          <div className="container-xl">
            <div className="card">
              <div className="row g-0">
                <ProfileSidebar />

                <div className="col-12 col-md-9 d-flex flex-column">
                  <form
                    method="post"
                    autoComplete="off"
                    onSubmit={handleSubmit}
                  >
                    <div className="card-body">
                      <h2 className="mb-4">My Account</h2>
                      <h3 className="card-title">Profile Details</h3>
                      <div className="row align-items-center">
                        <div className="col-auto">
                          <img
                            src={avatar}
                            alt={import.meta.env.VITE_SITE_TITLE}
                            className="avatar avatar-xl"
                          />
                        </div>
                        <div className="col-auto">
                          <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            className="btn"
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="button"
                            className="btn btn-ghost-danger"
                          >
                            Delete avatar
                          </button>
                        </div>
                      </div>
                      <h3 className="card-title mt-4">Personal Information</h3>
                      <div className="row g-3">
                        <div className="col-md">
                          <div className="form-label">Name</div>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            id="name"
                            value={form.name}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md">
                          <div className="form-label">Email</div>
                          <input
                            type="text"
                            className="form-control"
                            name="email"
                            id="email"
                            value={form.email}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md">
                          <div className="form-label">Mobile</div>
                          <input
                            type="text"
                            className="form-control"
                            name="mobile"
                            id="mobile"
                            value={form.mobile}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-transparent mt-auto">
                      <div className="btn-list justify-content-start">
                        <button type="submit" className="btn btn-success">
                          Submit
                        </button>
                        <button type="button" className="btn">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default Profile;
