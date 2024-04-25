import React, { useState } from "react";
import { AddEditAssigns, PageHeader, PageWrapper } from "../../components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { timeUnits } from "../../../utils/data";
import { nanoid } from "nanoid";
import SubmitBtn from "../../components/SubmitBtn";
import { splitErrors } from "../../../utils/showErrors";
import customFetch from "../../../utils/customFetch";

const AddEditTask = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    projectId: "",
    priority: "",
    allottedTime: "",
    timeUnit: "",
    taskDescShort: "",
    taskDescLong: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { taskId, taskAssigns } = useSelector((store) => store.tasks);
  const { priorities } = useSelector((store) => store.common);
  const { projects } = useSelector((store) => store.projects);

  const pageHeader = taskId ? `Update details` : `Add new task`;
  document.title = taskId
    ? `Update Details of | ${import.meta.env.VITE_COMMON_TITLE}`
    : `Add New Task | ${import.meta.env.VITE_COMMON_TITLE}`;

  const numbers = Array.from({ length: 7 }, (_, index) => index + 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    let data = Object.fromEntries(formData);
    data = { ...data, assigns: taskAssigns };
    try {
      const response = await customFetch.post(`/tasks/tasks`, data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  const props = {
    upriority: form.priority,
    utime: form.allottedTime,
    utimeUnit: form.timeUnit,
  };

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
          <form method="post" autoComplete="off" onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row row-cards mb-2">
                <div className="col-md-4 col-sm-12">
                  <label htmlFor="projectId" className="form-label required">
                    Select project
                  </label>
                  <select
                    className="form-control"
                    name="projectId"
                    id="projectId"
                    value={form.projectId}
                    onChange={handleChange}
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
                  <label htmlFor="priority" className="form-label required">
                    Priority
                  </label>
                  <select
                    className="form-control"
                    name="priority"
                    id="priority"
                    value={form.priority}
                    onChange={handleChange}
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
                    value={form.allottedTime}
                    onChange={handleChange}
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
                  <select
                    className="form-control"
                    name="timeUnit"
                    id="timeUnit"
                    value={form.timeUnit}
                    onChange={handleChange}
                  >
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
                  <label
                    htmlFor="taskDescShort"
                    className="form-label required"
                  >
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
              <hr />
              <AddEditAssigns props={props} />
              <hr />
              <div className="row row-cards">
                <div className="col"></div>
                <div className="col-auto">
                  <SubmitBtn
                    text={taskId ? `Update details` : `Add task`}
                    isLoading={isLoading}
                  />
                  <button className="btn btn-md btn-default ms-3">
                    Reset form
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </PageWrapper>
    </>
  );
};

export default AddEditTask;
