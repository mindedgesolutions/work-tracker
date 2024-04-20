import React, { useEffect, useState } from "react";
import SubmitBtn from "../SubmitBtn";
import customFetch from "../../../utils/customFetch";
import { splitErrors } from "../../../utils/showErrors";
import { useDispatch, useSelector } from "react-redux";
import { updateChangeCount } from "../../features/common/commonSlice";
import { toast } from "react-toastify";
import { setRoles, unsetRoleId } from "../../features/masters/roleSlice";

const AddEditRole = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { roleId, roles } = useSelector((store) => store.roles);
  const role = roles.find((i) => i.id === roleId);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const process = roleId ? customFetch.patch : customFetch.post;
    const apiUrl = roleId ? `/masters/roles/${roleId}` : `/masters/roles`;
    try {
      const response = await process(apiUrl, data);
      const dbRoles = await customFetch.get(`/masters/all-roles`);

      dispatch(updateChangeCount());
      dispatch(unsetRoleId());
      dispatch(setRoles(dbRoles.data.data.rows));
      setForm({ ...form, name: "" });
      setIsLoading(false);
      toast.success(msg);
      return;
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  const handleReset = () => {
    dispatch(unsetRoleId());
    setForm({ ...form, name: "" });
  };

  useEffect(() => {
    setForm({ ...form, name: role?.name || "" });
  }, [role]);

  return (
    <div className="col-4">
      <div className="card">
        <div className="card-header pb-0">
          <h3 className="card title border-0">
            {roleId ? `Update details` : `Add new role`}
          </h3>
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
          </div>
          <div className="mt-2 card-footer text-end">
            <SubmitBtn
              isLoading={isLoading}
              text={roleId ? `Save changes` : `Add role`}
            />
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

export default AddEditRole;
