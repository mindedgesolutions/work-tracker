import React, { useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import {
  FilterTask,
  PageHeader,
  PageWrapper,
  PaginationContainer,
  TableLoader,
  TaskDeleteModal,
  UserDeleteModal,
} from "../../components";
import { IoIosSearch } from "react-icons/io";
import { IoFolderOpen, IoReloadSharp } from "react-icons/io5";
import { nanoid } from "nanoid";
import { serialNo } from "../../../utils/functions";
import { MdOutlineModeEdit, MdOutlinePowerSettingsNew } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { useDispatch } from "react-redux";

const TaskAdmin = () => {
  document.title = `List of Tasks | ${import.meta.env.APP_COMMON_TITLE}`;
  const returnUrl = `/admin/tasks`;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const users = [];
  const totalRecords = 12;
  const pageCount = 0;
  const currentPage = 0;

  const resetSearch = () => {};

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
        <div className="col-8">
          <div className="card">
            <div className="card-header">
              Total {totalRecords} users found
              <div className="col-auto ms-auto d-print-none">
                <Form method="GET">
                  <div className="btn-list">
                    <span className="d-none d-sm-inline">
                      <div className="input-icon">
                        <input
                          type="text"
                          name="s"
                          value={searchInput}
                          className="form-control"
                          placeholder="Search by name..."
                          onChange={(e) => setSearchInput(e.target.value)}
                        />
                      </div>
                    </span>
                    <span className="d-none d-sm-inline">
                      <button
                        type="submit"
                        className="btn btn-primary d-none d-sm-inline-block me-2"
                      >
                        <IoIosSearch className="fs-3" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-default d-none d-sm-inline-block"
                        onClick={resetSearch}
                      >
                        <IoReloadSharp className="fs-3" />
                      </button>
                    </span>
                  </div>
                </Form>
              </div>
            </div>

            <div className="card-body p-2">
              <div className="table-responsive">
                <table className="table table-vcenter datatable table-hover table-bordered card-table fs-5">
                  <thead>
                    <tr>
                      <th className="bg-dark text-white">Sl. No.</th>
                      <th className="bg-dark text-white">Name</th>
                      <th className="bg-dark text-white">Role</th>
                      <th className="bg-dark text-white">Status</th>
                      <th className="bg-dark text-white"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5}>
                          <TableLoader />
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center">
                          NO DATA FOUND
                        </td>
                      </tr>
                    ) : (
                      users?.map((u, index) => {
                        return (
                          <tr key={nanoid()}>
                            <td>
                              {serialNo(queryParams.get("page")) + index}.
                            </td>
                            <td>{u.name.toUpperCase()}</td>
                            <td>
                              <span
                                className={`badge bg-${roleBadge(
                                  u.role
                                )}-lt me-1 my-1 fs-6`}
                              >
                                {u.role.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              {u.is_active ? (
                                <span
                                  className={`badge bg-success-lt me-1 my-1 fs-6`}
                                >
                                  {`ACTIVE`}
                                </span>
                              ) : (
                                <span
                                  className={`badge bg-danger-lt me-1 my-1 fs-6`}
                                >
                                  {`INACTIVE`}
                                </span>
                              )}
                            </td>
                            <td className="text-nowrap">
                              <button
                                type="button"
                                className="btn btn-primary btn-sm me-2"
                                // onClick={() => handleView(u.uuid)}
                              >
                                <IoFolderOpen size={14} />
                              </button>
                              {u.is_active ? (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-success btn-sm me-2"
                                    // onClick={() =>
                                    //   dispatch(setUserUuid(u.uuid))
                                    // }
                                  >
                                    <MdOutlineModeEdit />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm me-2"
                                    // onClick={() => handleDelete(u.uuid)}
                                  >
                                    <FaRegTrashCan />
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-warning btn-sm me-2"
                                  // onClick={() => activateUser(u.id)}
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
        <FilterTask />
        <TaskDeleteModal />
      </PageWrapper>
    </>
  );
};

export default TaskAdmin;
