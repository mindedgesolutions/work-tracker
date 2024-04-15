import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editContact,
  enableEdit,
  removeContact,
  setContacts,
} from "../../features/masters/projectSlice";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import { MdModeEdit } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { LuTrash2 } from "react-icons/lu";

const ProjectContact = () => {
  const dispatch = useDispatch();
  const { contacts, disabled, editIndex } = useSelector(
    (store) => store.projects
  );
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddContact = () => {
    if (!form.name || !form.email || !form.mobile) {
      toast.error(`Name, email and mobile no. are required`);
      return;
    }
    dispatch(
      setContacts({ name: form.name, email: form.email, mobile: form.mobile })
    );
    setForm({ ...form, name: "", email: "", mobile: "" });
  };

  return (
    <>
      <div className="row mt-2">
        <div className="col-md-12 col-sm-12">
          <table className="table table-vcenter datatable table-hover table-bordered card-table fs-5">
            <thead>
              <tr>
                <th className="bg-dark text-white">Name</th>
                <th className="bg-dark text-white">Email</th>
                <th className="bg-dark text-white">Mobile</th>
                <th className="bg-dark text-white"></th>
              </tr>
            </thead>
            <tbody>
              {contacts?.map((i, index) => {
                return (
                  <tr key={nanoid()}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        id="name"
                        value={i?.name}
                        onChange={() => {}}
                        disabled={index === editIndex ? false : true}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        name="mobile"
                        id="mobile"
                        value={i?.mobile}
                        onChange={() => {}}
                        disabled={index === editIndex ? false : true}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        name="email"
                        id="email"
                        value={i?.email}
                        onChange={() => {}}
                        disabled={index === editIndex ? false : true}
                      />
                    </td>
                    <td className="text-nowrap">
                      {index === editIndex ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-success me-2"
                          onClick={() => dispatch(editContact(index))}
                        >
                          <IoMdCheckmark size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-sm btn-info me-2"
                          onClick={() => dispatch(enableEdit(index))}
                        >
                          <MdModeEdit size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => dispatch(removeContact(index))}
                      >
                        <LuTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="mobile"
                    id="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </td>
                <td className="text-nowrap">
                  <button
                    type="button"
                    className="btn btn-sm btn-warning"
                    onClick={handleAddContact}
                  >
                    Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProjectContact;
