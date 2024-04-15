import React, { useState } from "react";

const ProjectContact = () => {
  const [form, setForm] = useState({ name: "", mobile: "", email: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="row mt-2">
        <div className="col-md-6 col-sm-12">
          <label htmlFor="name" className="form-label required">
            Contact person :{" "}
          </label>
          <input
            type="text"
            className="form-control"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-md-6 col-sm-12">
          <label htmlFor="mobile" className="form-label required">
            Contact no. :{" "}
          </label>
          <input
            type="text"
            className="form-control"
            name="mobile"
            id="mobile"
            value={form.mobile}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <label htmlFor="email" className="form-label">
            Contact email :{" "}
          </label>
          <input
            type="text"
            className="form-control"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
};

export default ProjectContact;
