import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editContact,
  enableEdit,
  removeContact,
  setContacts,
  unsetEditId,
} from "../../features/masters/projectSlice";
import { nanoid } from "nanoid";
import { MdModeEdit } from "react-icons/md";
import { LuTrash2 } from "react-icons/lu";
import customFetch from "../../../utils/customFetch";
import { splitErrors } from "../../../utils/showErrors";

const ProjectContact = () => {
  const dispatch = useDispatch();
  const { contacts, editIndex } = useSelector((store) => store.projects);
  const contact = editIndex && contacts?.find((i) => i.id === editIndex);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddContact = async (e) => {
    try {
      const response = await customFetch.post(
        `/masters/validate-contact`,
        formData
      );
      if (!editIndex) {
        dispatch(
          setContacts({
            id: nanoid(),
            name: response.data.data.name,
            email: response.data.data.email,
            mobile: response.data.data.mobile,
          })
        );
      } else {
        dispatch(
          editContact({
            id: editIndex,
            name: response.data.data.name,
            email: response.data.data.email,
            mobile: response.data.data.mobile,
          })
        );
      }
      setFormData({ ...formData, name: "", email: "", mobile: "" });
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  const resetContactForm = () => {
    setFormData({ ...formData, name: "", email: "", mobile: "" });
    dispatch(unsetEditId());
  };

  useEffect(() => {
    setFormData({
      ...formData,
      name: editIndex ? contact?.name : "",
      email: editIndex ? contact?.email : "",
      mobile: editIndex ? contact?.mobile : "",
    });
  }, [editIndex]);

  return (
    <>
      <div className="row mb-3">
        <div className="col-md-3 col-sm-12">
          <input
            type="text"
            className="form-control"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <input
            type="text"
            className="form-control"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <input
            type="text"
            className="form-control"
            name="mobile"
            id="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <button
            type="button"
            className="btn btn-md btn-warning me-2"
            onClick={handleAddContact}
          >
            {editIndex ? `Save` : `Add`}
          </button>
          <button
            type="button"
            className="btn btn-md btn-default"
            onClick={resetContactForm}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="row">
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
                  <td>{i.name?.toUpperCase()}</td>
                  <td>{i.email}</td>
                  <td>{i.mobile}</td>
                  <td className="text-nowrap">
                    <button
                      type="button"
                      className="btn btn-sm btn-info me-2"
                      onClick={() => dispatch(enableEdit(i.id))}
                    >
                      <MdModeEdit size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => dispatch(removeContact(i.id))}
                    >
                      <LuTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProjectContact;
