import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import SubmitBtn from "../SubmitBtn";
import { useDispatch, useSelector } from "react-redux";
import { unsetAddModal } from "../../features/masters/projectSlice";
import ProjectContact from "./ProjectContact";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddEditProject = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState();

  const { addModal, projectId, contactCount } = useSelector(
    (store) => store.projects
  );

  const handleClose = () => {
    dispatch(unsetAddModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <Modal show={addModal} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {projectId
            ? `Update details of ${form.name.toUpperCase()}`
            : `Add project`}
        </Modal.Title>
      </Modal.Header>
      <form method="post" autoComplete="off" onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <label htmlFor="name" className="form-label required">
                Project name :{" "}
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                id="name"
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-12 col-sm-12">
              <label htmlFor="desc" className="form-label">
                Project description :{" "}
              </label>
              <textarea
                className="form-control"
                name="desc"
                id="desc"
                cols="30"
                rows="3"
              ></textarea>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="mode" className="form-label required">
                Project mode :{" "}
              </label>
              <select className="form-control" name="mode" id="mode">
                <option value="">- Select -</option>
              </select>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="start" className="form-label required">
                Start date :{" "}
              </label>
              <DatePicker
                className="form-control"
                name="start"
                dateFormat={import.meta.env.VITE_DATE_FORMAT}
                selected={startDate}
                minDate={new Date()}
                maxDate={endDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="end" className="form-label">
                End date :{" "}
              </label>
              <DatePicker
                className="form-control"
                name="end"
                dateFormat={import.meta.env.VITE_DATE_FORMAT}
                selected={endDate}
                minDate={startDate}
                maxDate={new Date()}
                onChange={(date) => setEndDate(date)}
              />
            </div>
          </div>
          <hr />
          <ProjectContact />
        </Modal.Body>
        <Modal.Footer>
          <SubmitBtn
            text={projectId ? `Update details` : `Add role`}
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

export default AddEditProject;
