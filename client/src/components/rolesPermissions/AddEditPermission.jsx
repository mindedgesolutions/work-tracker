import React, { useEffect, useState } from "react";
import SubmitBtn from "../SubmitBtn";
import { useDispatch, useSelector } from "react-redux";
import {
  setPermissions,
  unsetPermissionId,
} from "../../features/masters/permissionSlice";
import { splitErrors } from "../../../utils/showErrors";
import customFetch from "../../../utils/customFetch";
import { toast } from "react-toastify";
import { updateChangeCount } from "../../features/common/commonSlice";

const AddEditPermission = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: "" });
  const [isLoading, setIsLoading] = useState(false);

  const { permissionId, permissions } = useSelector(
    (store) => store.permissions
  );
  const permission = permissions.find((i) => i.id === permissionId);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const process = permissionId ? customFetch.patch : customFetch.post;
    const apiUrl = permissionId
      ? `/masters/permissions/${permissionId}`
      : `/masters/permissions`;
    const msg = permissionId ? `Details updated` : `Permission added`;
    try {
      const response = await process(apiUrl, data);
      const dbPermissions = await customFetch.get(`/masters/all-permissions`);

      dispatch(updateChangeCount());
      dispatch(unsetPermissionId());
      dispatch(setPermissions(dbPermissions.data.data.rows));
      setForm({ ...form, name: "" });

      setIsLoading(false);
      toast.success(msg);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  const handleReset = () => {
    dispatch(unsetPermissionId());
    setForm({ ...form, name: "" });
  };

  useEffect(() => {
    setForm({ ...form, name: permission?.name || "" });
  }, [permission]);

  return (
    <div className="col-4">
      <div className="card">
        <div className="card-header pb-0">
          <h3 className="card title border-0">
            {permissionId ? `Update details` : `Add new permission`}
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
              text={permissionId ? `Save changes` : `Add permission`}
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

export default AddEditPermission;
