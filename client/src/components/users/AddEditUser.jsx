import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";
import SubmitBtn from "../SubmitBtn";
import customFetch from "../../../utils/customFetch";
import { splitErrors } from "../../../utils/showErrors";
import { updateChangeCount } from "../../features/common/commonSlice";
import { toast } from "react-toastify";
import { unsetUserUuid } from "../../features/users/userSlice";

const AddEditUser = () => {
  const dispatch = useDispatch();

  const { roles } = useSelector((store) => store.roles);
  const { users, userUuid } = useSelector((store) => store.users);
  const uuid = userUuid ? userUuid : localStorage.getItem("uid");
  const user = users.find((i) => i.uuid === uuid);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    roleId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const process = user ? customFetch.patch : customFetch.post;
    const apiUrl = user ? `/user/users/${user.id}` : `/user/users`;
    const msg = user ? `Details updated` : `User added`;
    try {
      await process(apiUrl, data);

      dispatch(updateChangeCount());
      dispatch(unsetUserUuid());
      setForm({ ...form, name: "", email: "", mobile: "", roleId: "" });

      setIsLoading(false);
      toast.success(msg);
      return;
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  useEffect(() => {
    setForm({
      ...form,
      name: user ? user?.name : "",
      email: user ? user?.email : "",
      mobile: user ? user?.mobile : "",
      roleId: user ? user?.role_id : "",
    });
  }, [user]);

  const handleReset = () => {
    dispatch(unsetUserUuid());
    setForm({ ...form, name: "", email: "", mobile: "", roleId: "" });
  };

  return (
    <div className="col-4">
      <div className="card">
        <div className="card-header pb-0">
          <h3 className="card title border-0">Add new employee</h3>
        </div>
        <form method="post" onSubmit={handleSubmit} autoComplete="off">
          <div className="card-body">
            <div className="col-md-12 col-sm-12">
              <label htmlFor="name" className="form-label required">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                autoFocus={false}
              />
            </div>
            <div className="col-md-12 col-sm-12 mt-2">
              <label htmlFor="email" className="form-label required">
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                autoFocus={false}
              />
            </div>
            <div className="col-md-12 col-sm-12 mt-2">
              <label htmlFor="mobile" className="form-label required">
                Mobile
              </label>
              <input
                type="text"
                name="mobile"
                id="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="form-control"
                autoFocus={false}
              />
            </div>
            <div className="col-md-12 col-sm-12 mt-2">
              <label htmlFor="roleId" className="form-label required">
                Role
              </label>
              <select
                name="roleId"
                id="roleId"
                className="form-control"
                value={form.roleId}
                onChange={handleChange}
              >
                <option value="">- Select -</option>
                {roles.map((i) => {
                  return (
                    <option key={nanoid()} value={i.id}>
                      {i.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="mt-2 card-footer text-end">
            <SubmitBtn isLoading={isLoading} text={`Add user`} />
            <button
              type="button"
              className="btn btn-md btn-default ms-3"
              onClick={handleReset}
            >
              Reset form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditUser;
