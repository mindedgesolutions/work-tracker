import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { unsetRolePermissionModal } from "../../features/masters/permissionSlice";
import SubmitBtn from "../SubmitBtn";
import { nanoid } from "nanoid";
import Select from "react-select";
import { splitErrors } from "../../../utils/showErrors";
import customFetch from "../../../utils/customFetch";
import { updateChangeCount } from "../../features/common/commonSlice";
import { toast } from "react-toastify";
import { setListRole, setRoles } from "../../features/masters/roleSlice";

const AssignPermissionToRole = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { permissions, rolePermissionModal, roleId } = useSelector(
    (store) => store.permissions
  );
  const { roles } = useSelector((store) => store.roles);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const role = roles.find((i) => i.id === Number(selectedRole));

  const handleClose = () => {
    dispatch(unsetRolePermissionModal());
  };

  // ------
  const dbPer = [];
  role?.permissions?.map((p) => {
    const element = { value: p.id, label: p.name };
    dbPer.push(element);
  });

  let pers = [];
  permissions?.map((perm) => {
    const element = { value: perm.id, label: perm.name };
    pers.push(element);
  });

  const options = pers;

  const handleChange = async (selected) => {
    setSelectedPermissions(selected);
  };

  useEffect(() => {
    setSelectedRole(roleId);
    setSelectedPermissions(dbPer || []);
  }, [roleId, role]);
  // ------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    let data = Object.fromEntries(formData);
    data = { ...data, permissions: selectedPermissions };
    try {
      await customFetch.post(`/masters/role-permissions`, data);
      const response = await customFetch.get(`/masters/roles`);

      dispatch(updateChangeCount());
      dispatch(unsetRolePermissionModal());
      dispatch(setRoles(response.data.data.rows));
      dispatch(setListRole(response.data.data.rows));

      setIsLoading(false);
      setSelectedPermissions([]);
      setSelectedRole("");

      toast.success(`Permissions updated`);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  return (
    <Modal show={rolePermissionModal} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update details of {role?.name?.toUpperCase()}</Modal.Title>
      </Modal.Header>
      <form method="post" autoComplete="off" onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <label htmlFor="role" className="form-label required">
                Role :{" "}
              </label>
              <select
                className="form-control"
                name="role"
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
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
          <div className="row mt-2">
            <div className="col-md-12 col-sm-12">
              <label htmlFor="permissions" className="form-label required">
                Permissions :{" "}
              </label>
              <Select
                id="permissions"
                name="permissions"
                options={options}
                onChange={handleChange}
                value={selectedPermissions[0]?.value ? selectedPermissions : ""}
                isMulti
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <SubmitBtn
            text={roleId ? `Update details` : `Assign permission/s`}
            isLoading={isLoading}
          />
          <button
            type="button"
            className="btn btn-default"
            onClick={handleClose}
          >
            Close
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AssignPermissionToRole;
