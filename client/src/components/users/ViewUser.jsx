import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { unsetShowModal, unsetUserUuid } from "../../features/users/userSlice";
import { dateFormatFancy } from "../../../utils/functions";

const ViewUser = () => {
  const dispatch = useDispatch();
  const { users, userUuid, showViewModal } = useSelector(
    (store) => store.users
  );
  const user = users.find((i) => i.uuid === userUuid);

  const handleClose = () => {
    dispatch(unsetUserUuid());
    dispatch(unsetShowModal({ type: "view" }));
  };

  return (
    <Modal show={showViewModal} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>{user?.name.toUpperCase()}</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row mb-3">
          <div className="col-md-6 col-sm-12">
            <label className="form-label m-0 p-0">Role : </label>
            <label className="datagrid-title m-0 p-0 fs-5">
              {user?.role?.toUpperCase()}
            </label>
          </div>
          <div className="col-md-6 col-sm-12">
            <label className="form-label m-0 p-0">Status : </label>
            <label className="datagrid-title m-0 p-0 fs-5">
              {user?.is_active ? (
                <span className={`badge bg-success-lt me-1 my-1 fs-6`}>
                  {`ACTIVE`}
                </span>
              ) : (
                <span className={`badge bg-danger-lt me-1 my-1 fs-6`}>
                  {`INACTIVE`}
                </span>
              )}
            </label>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6 col-sm-12">
            <label className="form-label m-0 p-0">Email : </label>
            <label className="datagrid-title m-0 p-0 fs-5">{user?.email}</label>
          </div>
          <div className="col-md-6 col-sm-12">
            <label className="form-label m-0 p-0">Mobile : </label>
            <label className="datagrid-title m-0 p-0 fs-5">
              {user?.mobile}
            </label>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6 col-sm-12">
            <label className="form-label m-0 p-0">Username : </label>
            <label className="datagrid-title m-0 p-0 fs-5">{user?.email}</label>
          </div>
          <div className="col-md-6 col-sm-12">
            <label className="form-label m-0 p-0">Last login : </label>
            <label className="datagrid-title m-0 p-0 fs-5">
              {user?.last_login ? dateFormatFancy(user?.last_login) : `--`}
            </label>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <label className="form-label m-0 p-0">Create date : </label>
            <label className="datagrid-title m-0 p-0 fs-5">
              {dateFormatFancy(user?.created_at)}
            </label>
          </div>
          <div className="col-md-6 col-sm-12">
            <label className="form-label m-0 p-0">Last updated : </label>
            <label className="datagrid-title m-0 p-0 fs-5">
              {dateFormatFancy(user?.updated_at)}
            </label>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-default" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewUser;
