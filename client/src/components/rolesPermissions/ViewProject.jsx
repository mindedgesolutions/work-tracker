import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddModal,
  setProjectId,
  unsetProjectId,
  unsetViewModal,
} from "../../features/masters/projectSlice";
import { dateFormat } from "../../../utils/functions";
import { nanoid } from "nanoid";

const ViewProject = () => {
  const dispatch = useDispatch();
  const { projectId, viewModal, listProject, contacts } = useSelector(
    (store) => store.projects
  );

  const project = listProject?.find((i) => i.id === projectId);

  const handleClose = () => {
    dispatch(unsetViewModal());
    dispatch(unsetProjectId());
  };

  const openEditModal = () => {
    dispatch(unsetViewModal());
    dispatch(setAddModal());
    dispatch(setProjectId(projectId));
  };

  return (
    <Modal show={viewModal} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Details of {project?.name?.toUpperCase()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <label className="form-label">Project name : </label>
            <p>{project?.name?.toUpperCase()}</p>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-12 col-sm-12">
            <label className="form-label">Project description : </label>
            <p>{project?.description || `NA`}</p>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-6 col-sm-12">
            <label className="form-label">Department : </label>
            <p>{project?.dept_name?.toUpperCase()}</p>
          </div>
          <div className="col-md-6 col-sm-12">
            <label className="form-label">Project mode : </label>
            <p>{project?.mode_name?.toUpperCase()}</p>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-6 col-sm-12">
            <label className="form-label">Start date : </label>
            <p>{dateFormat(project?.start_date)}</p>
          </div>
          <div className="col-md-6 col-sm-12">
            <label className="form-label">End date : </label>
            <p>{project?.end_date ? dateFormat(project?.end_date) : `NA`}</p>
          </div>
        </div>
        <hr />
        <div className="row">
          <table className="table table-vcenter datatable table-hover table-bordered card-table fs-5">
            <thead>
              <tr>
                <th className="bg-dark text-white">Name</th>
                <th className="bg-dark text-white">Email</th>
                <th className="bg-dark text-white">Mobile</th>
              </tr>
            </thead>
            <tbody>
              {contacts?.map((i) => {
                return (
                  <tr key={nanoid()}>
                    <td>{i.name?.toUpperCase()}</td>
                    <td>{i.email}</td>
                    <td>{i.mobile}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-warning"
          onClick={openEditModal}
        >
          Edit details
        </button>
        <button type="button" className="btn btn-default" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewProject;
