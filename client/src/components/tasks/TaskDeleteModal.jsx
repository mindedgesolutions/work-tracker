import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setListTask, unsetShowDelModal } from "../../features/task/taskSlice";
import customFetch from "../../../utils/customFetch";
import { splitErrors } from "../../../utils/showErrors";
import { toast } from "react-toastify";

const TaskDeleteModal = () => {
  const dispatch = useDispatch();
  const { showDelModal, taskId } = useSelector((store) => store.tasks);

  const handleClose = () => {
    dispatch(unsetShowDelModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customFetch.delete(`/tasks/tasks/${taskId}`);
      const response = await customFetch.get(`/tasks/admin`);
      dispatch(unsetShowDelModal());
      dispatch(setListTask(response.data.data.rows));
      toast.success(`Task deleted`);
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  return (
    <Modal show={showDelModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete task?</Modal.Title>
      </Modal.Header>
      <form method="post" onSubmit={handleSubmit}>
        <Modal.Body>
          <p>Sure you wish to delete this task?</p>
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

export default TaskDeleteModal;
