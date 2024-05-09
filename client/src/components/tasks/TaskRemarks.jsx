import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  compareFormatDate,
  currentDate,
  dateFormatFancy,
  initials,
  timeDifference,
} from "../../../utils/functions";
import { nanoid } from "nanoid";
import { setRemarkId, setShowDelModal } from "../../features/task/remarkSlice";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";

const TaskRemarks = () => {
  const dispatch = useDispatch();
  const { taskRemarks } = useSelector((store) => store.remarks);
  const { loggedInUser } = useSelector((store) => store.auth);
  const [toggleDesc, setToggleDesc] = useState(false);

  return (
    <div className="card-body">
      <div className="divide-y">
        {taskRemarks?.map((i) => {
          const initialLetters = initials(i.details[0].assign_name);
          const today = currentDate();
          const created = compareFormatDate(i.created_at);

          return (
            <div key={nanoid()} className="list-group-item">
              <div className="row">
                <div className="col-auto">
                  <span className="avatar">{initialLetters}</span>
                </div>
                <div className="col">
                  <div className="">
                    {i.remark.length > 150 ? (
                      <>
                        <span className="me-1">
                          {toggleDesc
                            ? i.remark
                            : i.remark.substr(0, 150) + `...`}
                        </span>
                        <span
                          className="badge bg-purple-lt cursor-pointer"
                          onClick={() => setToggleDesc(!toggleDesc)}
                        >
                          {toggleDesc ? `show less` : `show more`}
                        </span>
                      </>
                    ) : (
                      i.remark
                    )}
                  </div>
                  <div className="row mt-3">
                    <div className="col">
                      <div className="text-secondary fs-6">
                        TIME TAKEN: {timeDifference(i.start_time, i.end_time)}
                      </div>
                    </div>
                    <div className="col-auto ms-auto">
                      <div className="text-secondary fs-6">
                        <span className="me-1">
                          {i.details[0].assign_name.toUpperCase()}
                        </span>
                        |
                        <span className="ms-1">
                          {dateFormatFancy(i.created_at)?.toUpperCase()}
                        </span>
                        {i.remark_by === loggedInUser.id &&
                          today === created && (
                            <>
                              <button
                                type="button"
                                className="btn btn-success btn-sm ms-2 me-1"
                                onClick={() => dispatch(setRemarkId(i.id))}
                              >
                                <MdOutlineModeEdit />
                              </button>

                              <button
                                type="button"
                                className="btn btn-danger btn-sm ms-1 me-1"
                                onClick={() => dispatch(setShowDelModal(i.id))}
                              >
                                <FaRegTrashCan />
                              </button>
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskRemarks;
