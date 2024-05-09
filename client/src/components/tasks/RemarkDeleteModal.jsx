import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { unsetShowDelModal } from "../../features/task/remarkSlice";
import { splitErrors } from "../../../utils/showErrors";
import customFetch from "../../../utils/customFetch";
import { toast } from "react-toastify";
import { updateChangeCount } from "../../features/common/commonSlice";

const RemarkDeleteModal = () => {
  const dispatch = useDispatch();
  const { remarkId, showDelModal } = useSelector((store) => store.remarks);

  const handleClose = () => {
    dispatch(unsetShowDelModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      customFetch.delete(`/remarks/remarks/${remarkId}`);
      toast.error(`Remark deleted`);

      dispatch(unsetShowDelModal());
      dispatch(updateChangeCount());
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  return (
    <Modal show={showDelModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete remark?</Modal.Title>
      </Modal.Header>
      <form method="post" onSubmit={handleSubmit}>
        <Modal.Body>
          <p>Sure you wish to delete this remark?</p>
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

export default RemarkDeleteModal;
