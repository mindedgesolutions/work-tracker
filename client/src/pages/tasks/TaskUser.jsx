import React, { useState } from "react";
import {
  PageHeader,
  PageWrapper,
  PaginationContainer,
  TableLoader,
} from "../../components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { serialNo } from "../../../utils/functions";
import { useDispatch } from "react-redux";
import { IoFolderOpen } from "react-icons/io5";
import { MdOutlineModeEdit, MdOutlinePowerSettingsNew } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";

const TaskUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const [isLoading, setIsLoading] = useState(false);

  const totalRecords = 10;
  const pageCount = 0;
  const currentPage = 0;

  const listTask = [];

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <PageHeader title={`List of Tasks`} />
          </div>
        </div>
      </div>
      <PageWrapper>
        <div className="col-12">
          <div className="card">
            <div className="card-header">Total {totalRecords} users found</div>

            <div className="card-body p-2">
              <div className="table-responsive">
                <table className="table table-vcenter datatable table-hover table-bordered card-table fs-5">
                  <thead>
                    <tr>
                      <th className="bg-dark text-white">Sl. No.</th>
                      <th className="bg-dark text-white">Task ID</th>
                      <th className="bg-dark text-white">Project</th>
                      <th className="bg-dark text-white">Task</th>
                      <th className="bg-dark text-white">Assignee/s</th>
                      <th className="bg-dark text-white">Priority</th>
                      <th className="bg-dark text-white">Active</th>
                      <th className="bg-dark text-white"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7}>
                          <TableLoader />
                        </td>
                      </tr>
                    ) : listTask?.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center">
                          NO DATA FOUND
                        </td>
                      </tr>
                    ) : (
                      listTask?.map((u, index) => {
                        return (
                          <tr key={nanoid()}>
                            <td>
                              {serialNo(queryParams.get("page")) + index}.
                            </td>
                            <td>{u?.task_id?.toUpperCase()}</td>
                            <td>
                              {u?.prname?.length > 20
                                ? u?.prname?.toUpperCase().slice(0, 20) + ` ...`
                                : u?.prname?.toUpperCase()}
                            </td>
                            <td>
                              {u?.short_desc?.length > 20
                                ? u?.short_desc?.toUpperCase()?.slice(0, 20)
                                : u?.short_desc?.toUpperCase()}
                            </td>
                            <td>
                              {u?.details?.map((i) => {
                                return (
                                  <span
                                    key={nanoid()}
                                    className={`badge bg-success-lt me-1 my-1 fs-6`}
                                  >
                                    {i?.assign_name?.toUpperCase()}
                                  </span>
                                );
                              })}
                            </td>
                            <td>
                              <span
                                className={`badge bg-${priorityBadge(
                                  u?.priority
                                )}-lt me-1 my-1 fs-6`}
                              >
                                {u?.priorityname?.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              {u?.is_active ? (
                                <span
                                  key={nanoid()}
                                  className={`badge bg-success-lt me-1 my-1 fs-6`}
                                >
                                  Active
                                </span>
                              ) : (
                                <span
                                  key={nanoid()}
                                  className={`badge bg-danger-lt me-1 my-1 fs-6`}
                                >
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td className="text-nowrap">
                              <Link to={`/task/view/${u.uuid}`}>
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm me-2"
                                >
                                  <IoFolderOpen size={14} />
                                </button>
                              </Link>
                              {u.is_active ? (
                                <>
                                  <Link to={`/task/${u.uuid}`}>
                                    <button
                                      type="button"
                                      className="btn btn-success btn-sm me-2"
                                    >
                                      <MdOutlineModeEdit />
                                    </button>
                                  </Link>
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm me-2"
                                  >
                                    <FaRegTrashCan />
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-warning btn-sm me-2"
                                >
                                  <MdOutlinePowerSettingsNew />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <PaginationContainer
              pageCount={pageCount}
              currentPage={currentPage}
            />
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default TaskUser;
