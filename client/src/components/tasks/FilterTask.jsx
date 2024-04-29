import React, { useState } from "react";
import SubmitBtn from "../SubmitBtn";

const FilterTask = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleReset = () => {};

  return (
    <div className="col-4">
      <div className="card">
        <div className="card-header pb-0">
          <h3 className="card title border-0">Filter</h3>
        </div>
        <form method="post" onSubmit={handleSubmit} autoComplete="off">
          <div className="card-body">
            {/* <div className="col-md-12 col-sm-12">
              <label htmlFor="name" className="form-label required">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                autoFocus={false}
              />
            </div>
            <div className="col-md-12 col-sm-12 mt-2">
              <label htmlFor="email" className="form-label required">
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                autoFocus={false}
              />
            </div>
            <div className="col-md-12 col-sm-12 mt-2">
              <label htmlFor="mobile" className="form-label required">
                Mobile
              </label>
              <input
                type="text"
                name="mobile"
                id="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="form-control"
                autoFocus={false}
              />
            </div>
            <div className="col-md-12 col-sm-12 mt-2">
              <label htmlFor="roleId" className="form-label required">
                Role
              </label>
              <select
                name="roleId"
                id="roleId"
                className="form-control"
                value={form.roleId}
                onChange={handleChange}
              >
                <option value="">- Select -</option>
                {roles.map((i) => {
                  return (
                    <option key={nanoid()} value={i.id}>
                      {i.name}
                    </option>
                  );
                })}
              </select>
            </div> */}
          </div>
          <div className="mt-2 card-footer text-end">
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
