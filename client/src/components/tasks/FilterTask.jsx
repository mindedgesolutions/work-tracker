import React, { useEffect, useState } from "react";
import SubmitBtn from "../SubmitBtn";
import { useSelector } from "react-redux";
import { nanoid } from "nanoid";
import { Form, useLocation, useNavigate } from "react-router-dom";
import UserNameIdFilter from "../UserNameIdFilter";

const FilterTask = ({ type }) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const { returnPath } = useSelector((store) => store.auth);
  const returnUrl = `${returnPath}/tasks`;

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    prj: "",
    pr: "",
    tid: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { projects } = useSelector((store) => store.projects);
  const { priorities } = useSelector((store) => store.common);

  const handleReset = () => {
    setForm({
      ...form,
      prj: "",
      pr: "",
      tid: "",
    });
    navigate(returnUrl);
  };

  useEffect(() => {
    setForm({
      ...form,
      prj: queryParams.get("prj") || "",
      pr: queryParams.get("pr") || "",
      tid: queryParams.get("tid") || "",
    });
  }, [queryParams.get("prj"), queryParams.get("pr"), queryParams.get("tid")]);

  return (
    <div className="col-12">
      <div className="card">
        <Form method="get" autoComplete="off">
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 col-sm-12">
                <label className="form-label">Project</label>
                <select
                  className="form-control"
                  name="prj"
                  id="prj"
                  value={form.prj}
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
                  name="pr"
                  id="pr"
                  value={form.pr}
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
                  name="tid"
                  id="tid"
                  value={form.tid}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              {type === "admin" && (
                <div className="col-md-3 col-sm-12">
                  <label className="form-label">Assignee</label>
                  <UserNameIdFilter />
                </div>
              )}
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
        </Form>
      </div>
    </div>
  );
};

export default FilterTask;
