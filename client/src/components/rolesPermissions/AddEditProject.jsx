import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import SubmitBtn from "../SubmitBtn";
import { useDispatch, useSelector } from "react-redux";
import { unsetAddModal } from "../../features/masters/projectSlice";
import { IoAddOutline } from "react-icons/io5";
import { AiOutlineMinus } from "react-icons/ai";
import ProjectContact from "./ProjectContact";
import { nanoid } from "nanoid";

const AddEditProject = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [contact, setContact] = useState(1);
  const { addModal, projectId } = useSelector((store) => store.projects);

  const incContact = () => {
    const increased = contact + 1;
    setContact(increased);
  };

  const decContact = () => {
    let decreased = contact >= 2 ? contact - 1 : 1;
    setContact(decreased);
  };

  const handleClose = () => {
    dispatch(unsetAddModal());
  };

  const handleSubmit = async (e) => {};

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
              <input
                type="text"
                className="form-control"
                name="start"
                id="start"
              />
            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="end" className="form-label">
                End date :{" "}
              </label>
              <input type="text" className="form-control" name="end" id="end" />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-6">&nbsp;</div>
            <div className="col-auto ms-auto">
              <button
                type="button"
                className="btn btn-sm btn-warning me-2"
                onClick={incContact}
              >
                <IoAddOutline size={16} />
              </button>
              <button
                type="button"
                className="btn btn-sm btn-default"
                onClick={decContact}
              >
                <AiOutlineMinus size={16} />
              </button>
            </div>
          </div>
          {Array.from({ length: contact }, (_, index) => (
            <ProjectContact key={nanoid()} index={index + 1} />
          ))}
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
