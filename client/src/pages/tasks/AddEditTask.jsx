import React, { useEffect, useState } from "react";
import { AddEditAssignee, PageHeader, PageWrapper } from "../../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { timeUnits } from "../../../utils/data";
import { nanoid } from "nanoid";
import SubmitBtn from "../../components/SubmitBtn";
import { splitErrors } from "../../../utils/showErrors";
import customFetch from "../../../utils/customFetch";
import { toast } from "react-toastify";
import {
  setTask,
  setTaskAssignees,
  unsetTaskAssigneee,
} from "../../features/task/taskSlice";
import { titleExtension } from "../../../utils/functions";

const AddEditTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const [form, setForm] = useState({
    taskId: "",
    projectId: "",
    priority: "",
    allottedTime: "",
    timeUnit: "",
    taskDescShort: "",
    taskDescLong: "",
    editId: params.id || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { taskId, taskAssignees } = useSelector((store) => store.tasks);
  const { priorities } = useSelector((store) => store.common);
  const { projects } = useSelector((store) => store.projects);
  const { returnPath } = useSelector((store) => store.auth);

  const returnUrl = <Link to={`${returnPath}/tasks`}>Back to Task List</Link>;

  // Fetch initial data starts ------
  useEffect(() => {
    dispatch(unsetTaskAssigneee());
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (params.id) {
          const response = await customFetch.get(`/tasks/tasks/${form.editId}`);
          dispatch(setTask(response.data.data.rows));
          setForm({
            ...form,
            taskId: response.data.data.rows[0].task_id || "",
            projectId: response.data.data.rows[0].project_id || "",
            priority: response.data.data.rows[0].priority || "",
            allottedTime: response.data.data.rows[0].time_allotted || "",
            timeUnit: response.data.data.rows[0].time_unit || "",
            taskDescShort: response.data.data.rows[0].short_desc || "",
            taskDescLong: response.data.data.rows[0].long_desc || "",
          });

          let arr = [];
          response.data.data.rows[0].details.map((i) => {
            const element = {
              userId: i.assigned_to || "",
              userName: i.assignee_name || "",
              priority: i.priority || "",
              time: i.time_allotted || "",
              timeUnit: i.time_unit || "day",
              taskDesc: i.task_desc || "",
            };
            arr.push(element);
          });
          dispatch(setTaskAssignees(arr));
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        splitErrors(error?.response?.data?.msg);
        return error;
      }
    };

    fetchData();
  }, [params.id]);
  // Fetch initial data ends ------

  const pageHeader = form.editId
    ? `Update details : ${form.taskId}`
    : `Add new task`;

  const title = titleExtension(returnPath);

  document.title = form.editId
    ? `Update Details of ${form.taskId} | ${title}`
    : `Add New Task | ${title}`;

  const numbers = Array.from({ length: 7 }, (_, index) => index + 1);

  // Handle form submit starts ------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    let data = Object.fromEntries(formData);
    data = { ...data, assigns: taskAssignees };

    const apiUrl = form.editId ? `/tasks/tasks/${form.editId}` : `/tasks/tasks`;
    const process = form.editId ? customFetch.patch : customFetch.post;
    const msg = form.editId ? `Task updated` : `Task added`;

    try {
      await process(apiUrl, data);

      dispatch(unsetTaskAssigneee());
      resetForm();

      toast.success(msg);
      setIsLoading(false);

      form.editId && navigate(`${returnPath}/tasks`);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };
  // Handle form submit ends ------

  const props = {
    upriority: form.priority,
    utime: form.allottedTime,
    utimeUnit: form.timeUnit,
  };

  const resetForm = () => {
    dispatch(unsetTaskAssigneee());
    setForm({
      ...form,
      projectId: "",
      priority: "",
      allottedTime: "",
      timeUnit: "",
      taskDescShort: "",
      taskDescLong: "",
    });
  };

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <PageHeader title={pageHeader} breadCrumb={returnUrl} />
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
              <AddEditAssignee props={props} />
              <hr />
              <div className="row row-cards">
                <div className="col"></div>
                <div className="col-auto">
                  <SubmitBtn
                    text={form.editId ? `Update details` : `Add task`}
                    // isLoading={isLoading}
                  />
                  <button
                    type="button"
                    className="btn btn-md btn-default ms-3"
                    onClick={resetForm}
                  >
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
