import React, { useState } from "react";
import { PageHeader, PageWrapper } from "../../components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { timeUnits } from "../../../utils/data";
import { nanoid } from "nanoid";

const AddEditTask = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    projectId: "",
    allottedTime: "",
    timeUnit: "",
    taskDescShort: "",
    taskDescLong: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { taskId } = useSelector((store) => store.tasks);
  const { priorities } = useSelector((store) => store.common);
  const { projects } = useSelector((store) => store.projects);
  const pageHeader = taskId ? `Update details` : `Add new task`;
  const numbers = Array.from({ length: 7 }, (_, index) => index + 1);

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <PageHeader title={pageHeader} />
          </div>
        </div>
      </div>
      <PageWrapper>
        <div className="card px-0 py-2">
          <div className="card-body">
            <div className="row row-cards mb-2">
              <div className="col-md-4 col-sm-12">
                <label htmlFor="taskDescShort" className="form-label required">
                  Select project
                </label>
                <select
                  className="form-control"
                  name="projectId"
                  id="projectId"
                >
                  <option value="">- Select -</option>
                  {projects.map((i) => {
                    return (
                      <option key={nanoid()} value={i.id}>
                        {i.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-4 col-sm-12">
                <label htmlFor="taskDescShort" className="form-label required">
                  Priority
                </label>
                <select
                  className="form-control"
                  name="projectId"
                  id="projectId"
                >
                  <option value="">- Select -</option>
                  {priorities.map((i) => {
                    return (
                      <option key={nanoid()} value={i.id}>
                        {i.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-3 col-sm-12">
                <label htmlFor="allottedTime" className="form-label required">
                  Allotted time
                </label>
                <select
                  className="form-control"
                  name="allottedTime"
                  id="allottedTime"
                >
                  <option value="">- Select -</option>
                  {numbers.map((i) => {
                    return (
                      <option key={nanoid()} value={i}>
                        {i}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-1 col-sm-12">
                <label className="form-label">&nbsp;</label>
                <select className="form-control" name="timeUnit" id="timeUnit">
                  {timeUnits.map((i) => {
                    return (
                      <option key={nanoid()} value={i.value}>
                        {i.text}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="row row-cards mb-2">
              <div className="col-md-4 col-sm-12">
                <label htmlFor="taskDescShort" className="form-label required">
                  Task description (short)
                </label>
                <textarea
                  name="taskDescShort"
                  id="taskDescShort"
                  className="form-control"
                  cols="30"
                  rows="3"
                  value={form.taskDescShort}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="col-md-4 col-sm-12">
                <label htmlFor="" className="form-label">
                  Task description (long)
                </label>
                <textarea
                  name="taskDescLong"
                  id="taskDescLong"
                  className="form-control"
                  cols="30"
                  rows="3"
                  value={form.taskDescLong}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div className="row row-cards"></div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default AddEditTask;
