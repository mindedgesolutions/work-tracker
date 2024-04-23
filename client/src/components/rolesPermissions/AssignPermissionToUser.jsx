import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unsetUserPermissionModal } from "../../features/masters/permissionSlice";
import { splitErrors } from "../../../utils/showErrors";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import SubmitBtn from "../SubmitBtn";
import customFetch from "../../../utils/customFetch";
import { setUsers } from "../../features/users/userSlice";
import { updateChangeCount } from "../../features/common/commonSlice";
import { toast } from "react-toastify";

const AssignPermissionToUser = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const { userPermissionModal, userId, permissions } = useSelector(
    (store) => store.permissions
  );
  const { users } = useSelector((store) => store.users);
  const user = users?.find((i) => i.id === userId);

  const handleClose = () => {
    dispatch(unsetUserPermissionModal());
  };

  // ------
  const dbPer = [];
  user?.permissions?.map((p) => {
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
    setSelectedPermissions(dbPer || []);
  }, [user]);
  // ------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    let data = Object.fromEntries(formData);
    data = { ...data, permissions: selectedPermissions };
    try {
      await customFetch.post(`/masters/user-permissions`, data, {
        params: { id: userId },
      });
      const response = await customFetch.get(`/user/users`);

      dispatch(unsetUserPermissionModal());
      dispatch(setUsers(response.data.data.rows));
      dispatch(updateChangeCount());

      setSelectedPermissions([]);
      setIsLoading(false);
      toast.success(`Permissions updated`);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  return (
    <Modal show={userPermissionModal} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update details of {user?.name?.toUpperCase()}</Modal.Title>
      </Modal.Header>
      <form method="post" autoComplete="off" onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <label className="form-label">
                User : {user?.name?.toUpperCase()}
              </label>
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
            text={userId ? `Update details` : `Assign permission/s`}
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

export default AssignPermissionToUser;
