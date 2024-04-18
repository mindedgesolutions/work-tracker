import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import SubmitBtn from "../SubmitBtn";
import { useDispatch, useSelector } from "react-redux";
import { unsetAddModal } from "../../features/masters/projectSlice";
import ProjectContact from "./ProjectContact";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { projectModes, projectDepartments } from "../../../utils/data";
import { nanoid } from "nanoid";
import { splitErrors } from "../../../utils/showErrors";
import customFetch from "../../../utils/customFetch";
import { toast } from "react-toastify";
import { updateChangeCount } from "../../features/common/commonSlice";

const AddEditProject = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const maxEndDate = dayjs(startDate).add(5, "years").format(`YYYY-MM-DD`);
  const [endDate, setEndDate] = useState("");
  const { addModal, projectId, contactCount, contacts } = useSelector(
    (store) => store.projects
  );
  const [form, setForm] = useState({
    pname: "",
    desc: "",
    pmode: "",
    pdept: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    dispatch(unsetAddModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    let data = Object.fromEntries(formData);
    data = { ...data, contacts };
    try {
      const response = await customFetch.post(`/masters/projects`, data);

      dispatch(updateChangeCount());
      dispatch(unsetAddModal());
      toast.success(`Added successfully`);
      // setIsLoading(false);
    } catch (error) {
      console.log(error);
      // setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
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
              <label htmlFor="pname" className="form-label required">
                Project name :{" "}
              </label>
              <input
                type="text"
                className="form-control"
                name="pname"
                id="pname"
                value={form.pname}
                onChange={handleChange}
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
                value={form.desc}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="pdept" className="form-label required">
                Department :{" "}
              </label>
              <select
                className="form-control"
                name="pdept"
                id="pdept"
                value={form.pdept}
                onChange={handleChange}
              >
                <option value="">- Select -</option>
                {projectDepartments.map((i) => {
                  return (
                    <option key={nanoid()} value={i.value}>
                      {i.text}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="pmode" className="form-label required">
                Project mode :{" "}
              </label>
              <select
                className="form-control"
                name="pmode"
                id="pmode"
                value={form.pmode}
                onChange={handleChange}
              >
                <option value="">- Select -</option>
                {projectModes.map((i) => {
                  return (
                    <option key={nanoid()} value={i.value}>
                      {i.text}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="row mt-2 px-2">
            <div className="row col-md-6 col-sm-12 me-3">
              <label htmlFor="startDate" className="form-label required">
                Start date :{" "}
              </label>
              <DatePicker
                className="form-control"
                name="startDate"
                id="startDate"
                dateFormat={import.meta.env.VITE_DATE_FORMAT}
                selected={startDate}
                maxDate={endDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
            <div className="row col-md-6 col-sm-12">
              <label htmlFor="endDate" className="form-label">
                End date :{" "}
              </label>
              <DatePicker
                className="form-control"
                name="endDate"
                id="endDate"
                dateFormat={import.meta.env.VITE_DATE_FORMAT}
                selected={endDate}
                minDate={startDate}
                maxDate={maxEndDate}
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
