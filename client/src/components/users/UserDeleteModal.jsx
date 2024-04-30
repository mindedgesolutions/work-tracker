import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { unsetShowModal, unsetUserUuid } from "../../features/users/userSlice";
import customFetch from "../../../utils/customFetch";
import { splitErrors } from "../../../utils/showErrors";
import { updateChangeCount } from "../../features/common/commonSlice";

const UserDeleteModal = () => {
  const dispatch = useDispatch();
  const { users, userUuid, showDelModal } = useSelector((store) => store.users);
  const user = users.find((i) => i.uuid === userUuid);

  const handleClose = () => {
    dispatch(unsetUserUuid());
    dispatch(unsetShowModal({ type: "delete" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customFetch.delete(`/user/users/${user.id}`);

      dispatch(unsetUserUuid());
      dispatch(unsetShowModal({ type: "delete" }));
      dispatch(updateChangeCount());

      toast.success(`User deleted`);
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  return (
    <Modal show={showDelModal} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete {user?.name}</Modal.Title>
      </Modal.Header>
      <form method="post" onSubmit={handleSubmit}>
        <Modal.Body>
          <p>Sure you wish to delete {user?.name}?</p>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn btn-danger me-2">
            Delete
          </button>
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

export default UserDeleteModal;
