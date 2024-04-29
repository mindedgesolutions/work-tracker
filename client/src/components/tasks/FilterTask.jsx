import React, { useEffect, useState } from "react";
import SubmitBtn from "../SubmitBtn";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid";
import { splitErrors } from "../../../utils/showErrors";
import customFetch from "../../../utils/customFetch";
import { setUserNameIds } from "../../features/common/commonSlice";
import AsyncSelect from "react-select/async";

const FilterTask = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    projectId: "",
    priorityId: "",
    taskId: "",
    userId: "",
    userName: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { projects } = useSelector((store) => store.projects);
  const { priorities, userNameIds } = useSelector((store) => store.common);

  const getUsers = async () => {
    try {
      if (userNameIds.length === 0) {
        const response = await customFetch.get(`/user/user-id`);
        dispatch(setUserNameIds(response.data.data.rows));
      }
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };
  let options = [];
  userNameIds.map((user) => {
    const userElement = { value: user.id, label: user.name };
    options.push(userElement);
  });

  const loadOptions = (searchValue, callback) => {
    setTimeout(() => {
      const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      );
      callback(filteredOptions);
    }, 1000);
  };

  const handleUserChange = (selectedOption) => {
    setForm({
      ...form,
      userId: selectedOption.value,
      userName: selectedOption.label,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleReset = () => {};

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="col-12">
      <div className="card">
        <form method="post" onSubmit={handleSubmit} autoComplete="off">
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 col-sm-12">
                <label className="form-label">Project</label>
                <select
                  className="form-control"
                  name="projectId"
                  id="projectId"
                  value={form.projectId}
                  onChange={handleChange}
                >
                  <option value="">- Select project -</option>
                  {projects.map((i) => {
                    return (
                      <option key={nanoid()} value={i.id}>
                        {i.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-3 col-sm-12">
                <label className="form-label">Priorities</label>
                <select
                  className="form-control"
                  name="priorityId"
                  id="priorityId"
                  value={form.priorityId}
                  onChange={handleChange}
                >
                  <option value="">- Select priority -</option>
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
                <label className="form-label">Task ID</label>
                <input
                  type="text"
                  name="taskId"
                  id="taskId"
                  value={form.taskId}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-3 col-sm-12">
                <label className="form-label">Assignee</label>
                <AsyncSelect
                  loadOptions={loadOptions}
                  onChange={handleUserChange}
                  name="userId"
                  value={{
                    value: form.userId,
                    label: form.userName,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-2 card-footer text-center">
            <SubmitBtn isLoading={isLoading} text={`Filter data`} />
            <button
              type="button"
              className="btn btn-md btn-default ms-3"
              onClick={handleReset}
            >
              Reset filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterTask;
