import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FilterTask,
  PageHeader,
  PageWrapper,
  PaginationContainer,
  TableLoader,
  TaskDeleteModal,
} from "../../components";
import { IoFolderOpen } from "react-icons/io5";
import { nanoid } from "nanoid";
import { priorityBadge, serialNo } from "../../../utils/functions";
import { MdOutlineModeEdit, MdOutlinePowerSettingsNew } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { splitErrors } from "../../../utils/showErrors";
import customFetch from "../../../utils/customFetch";
import { setListTask, setShowDelModal } from "../../features/task/taskSlice";
import { toast } from "react-toastify";

const TaskAdmin = () => {
  document.title = `List of Tasks | ${import.meta.env.VITE_COMMON_TITLE}`;

  const dispatch = useDispatch();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const { listTask } = useSelector((store) => store.tasks);

  const [isLoading, setIsLoading] = useState(false);
  const [metaData, setMetaData] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(`/tasks/admin`, {
        params: {
          page: queryParams.get("page") || "",
          projectId: queryParams.get("prj") || "",
          priority: queryParams.get("pr") || "",
          taskId: queryParams.get("tid") || "",
          userId: queryParams.get("uid") || "",
        },
      });

      dispatch(setListTask(response.data.data.rows));
      setMetaData(response.data.meta);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  const pageCount = metaData?.totalPages;
  const currentPage = metaData?.currentPage;
  const totalRecords = metaData?.totalRecords;

  useEffect(() => {
    fetchData();
  }, [
    queryParams.get("page"),
    queryParams.get("prj"),
    queryParams.get("pr"),
    queryParams.get("tid"),
    queryParams.get("uid"),
  ]);

  const handleDelete = (id) => {
    dispatch(setShowDelModal(id));
  };

  const activateTask = async (id) => {
    try {
      await customFetch.post(`/tasks/activate-task/${id}`);
      const response = await customFetch.get(`/tasks/admin`);

      dispatch(setListTask(response.data.data.rows));
      toast.success(`Task activated`);
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <PageHeader title={`List of Tasks`} />
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <span className="d-none d-sm-inline">
                  <Link to="/task">
                    <button
                      type="button"
                      className="btn btn-success d-none d-sm-inline-block me-2"
                    >
                      Add new
                    </button>
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageWrapper>
        <FilterTask />
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
                              <button
                                type="button"
                                className="btn btn-primary btn-sm me-2"
                                // onClick={() => handleView(u.uuid)}
                              >
                                <IoFolderOpen size={14} />
                              </button>
                              {u.is_active ? (
                                <>
                                  <Link to={`/task/${u.uuid}`}>
                                    <button
                                      type="button"
                                      className="btn btn-success btn-sm me-2"
                                      // onClick={() =>
                                      //   dispatch(setUserUuid(u.uuid))
                                      // }
                                    >
                                      <MdOutlineModeEdit />
                                    </button>
                                  </Link>
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm me-2"
                                    onClick={() => handleDelete(u.id)}
                                  >
                                    <FaRegTrashCan />
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-warning btn-sm me-2"
                                  onClick={() => activateTask(u.id)}
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
        <TaskDeleteModal />
      </PageWrapper>
    </>
  );
};

export default TaskAdmin;
