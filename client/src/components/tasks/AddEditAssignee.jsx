import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { MdModeEdit } from "react-icons/md";
import customFetch from "../../../utils/customFetch";
import { splitErrors } from "../../../utils/showErrors";
import AsyncSelect from "react-select/async";
import { useDispatch, useSelector } from "react-redux";
import { timeUnits } from "../../../utils/data";
import { setUserNameIds } from "../../features/common/commonSlice";
import {
  editTaskAssignee,
  removeTaskAssignee,
  saveChanges,
  setTaskAssignees,
  unsetEditId,
} from "../../features/task/taskSlice";

const AddEditAssignee = ({ props }) => {
  const dispatch = useDispatch();
  const [assigns, setAssigns] = useState({
    userId: "",
    userName: "",
    priority: "",
    time: "",
    timeUnit: "day",
    taskDesc: "",
  });

  const { priorities, userNameIds } = useSelector((store) => store.common);
  const { taskAssignees, editId } = useSelector((store) => store.tasks);

  const numbers = Array.from({ length: 7 }, (_, index) => index + 1);

  const handleChange = (e) => {
    setAssigns({ ...assigns, [e.target.name]: e.target.value });
  };

  const options = [];
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
    setAssigns({
      ...assigns,
      userId: selectedOption.value,
      userName: selectedOption.label,
    });
  };

  const user = taskAssignees?.find((i) => i.userId === editId);

  useEffect(() => {
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
    getUsers();

    setAssigns({
      ...assigns,
      userId: editId ? user?.userId : "",
      userName: editId ? user?.userName : "",
      priority: editId ? user?.priority : props.upriority,
      time: editId ? user?.time : props.utime,
      timeUnit: editId ? user?.timeUnit : props.utimeUnit || "day",
      taskDesc: editId ? user?.taskDesc : props.taskDesc || "",
    });
  }, [props]);

  const resetContactForm = () => {
    dispatch(unsetEditId());
    setAssigns({
      ...assigns,
      userId: "",
      userName: "",
      priority: "",
      time: "",
      timeUnit: "",
      taskDesc: "",
    });
  };

  const handleAddContact = async () => {
    try {
      await customFetch.post(`/tasks/validate-assignee`, assigns);
      if (!editId) {
        dispatch(setTaskAssignees(assigns));
      } else {
        dispatch(saveChanges(assigns));
        dispatch(unsetEditId());
      }
      setAssigns({ ...assigns, userId: "", userName: "", taskDesc: "" });
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  return (
    <>
      <div className="row mb-3">
        <div className="col-md-3 col-sm-12">
          <AsyncSelect
            loadOptions={loadOptions}
            onChange={handleUserChange}
            name="userId"
            value={{
              value: assigns.userId,
              label: assigns.userName,
            }}
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <select
            className="form-control"
            name="priority"
            id="priority"
            value={assigns.priority}
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
        <div className="col-md-2 col-sm-12">
          <select
            className="form-control"
            name="time"
            id="time"
            value={assigns.time}
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
          <select
            className="form-control"
            name="timeUnit"
            id="timeUnit"
            value={assigns.timeUnit}
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
        <div className="col-md-9 col-sm-12 mt-3">
          <input
            type="text"
            className="form-control"
            name="taskDesc"
            id="taskDesc"
            placeholder="Task description for this assignee (non-mandatory)"
            value={assigns.taskDesc}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3 col-sm-12 mt-3">
          <button
            type="button"
            className="btn btn-md btn-warning me-2"
            onClick={handleAddContact}
          >
            {editId ? `Save` : `Add`}
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
              <th className="bg-dark text-white">Sl. No.</th>
              <th className="bg-dark text-white">Name</th>
              <th className="bg-dark text-white">Priority</th>
              <th className="bg-dark text-white">Time allotted</th>
              <th className="bg-dark text-white">Task</th>
              <th className="bg-dark text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {taskAssignees?.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  NO DATA FOUND
                </td>
              </tr>
            ) : (
              taskAssignees?.map((i, index) => {
                const prio = priorities.find(
                  (p) => p.id === Number(i.priority)
                );
                return (
                  <tr key={nanoid()}>
                    <td>{index + 1}.</td>
                    <td>{i.userName?.toUpperCase()}</td>
                    <td>{prio?.name?.toUpperCase()}</td>
                    <td>
                      {i.time} {i.timeUnit}/s
                    </td>
                    <td>{i.taskDesc || `NA`}</td>
                    <td className="text-nowrap">
                      <button
                        type="button"
                        className="btn btn-sm btn-info me-2"
                        onClick={() => dispatch(editTaskAssignee(i.userId))}
                      >
                        <MdModeEdit size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => dispatch(removeTaskAssignee(i.userId))}
                      >
                        <LuTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AddEditAssignee;
