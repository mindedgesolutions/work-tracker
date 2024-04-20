import React, { useEffect, useState } from "react";
import {
  AddEditUser,
  PageHeader,
  PageWrapper,
  PaginationContainer,
  TableLoader,
  UserDeleteModal,
  ViewUser,
} from "../../components";
import { IoIosSearch } from "react-icons/io";
import { IoReloadSharp } from "react-icons/io5";
import { Form, useLocation, useNavigate } from "react-router-dom";
import customFetch from "../../../utils/customFetch";
import { splitErrors } from "../../../utils/showErrors";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowModal,
  setUserUuid,
  setUsers,
} from "../../features/users/userSlice";
import { roleBadge, serialNo } from "../../../utils/functions";
import { nanoid } from "nanoid";
import { IoFolderOpen } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { updateChangeCount } from "../../features/common/commonSlice";

const UserList = () => {
  document.title = `List of Users | ${import.meta.env.VITE_ADMIN_TITLE}`;
  const postTitle = `Default password: welcome123 (small case)`;
  const textClass = `text-danger`;
  const returnUrl = `/admin/users`;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const { changeCount } = useSelector((store) => store.common);
  const { users } = useSelector((store) => store.users);
  const [isLoading, setIsLoading] = useState(false);
  const [metaData, setMetaData] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const resetSearch = () => {
    setSearchInput("");
    navigate(returnUrl);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(`/user/users`, {
        params: {
          name: queryParams.get("s") || "",
          page: queryParams.get("page") || "",
        },
      });

      setMetaData(response.data.meta);
      dispatch(setUsers(response.data.data.rows));

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
  }, [queryParams.get("s"), queryParams.get("page"), changeCount]);

  const handleView = (uuid) => {
    dispatch(setUserUuid(uuid));
    dispatch(setShowModal({ type: "view" }));
  };

  const activateUser = async (id) => {
    setIsLoading(true);
    try {
      await customFetch.patch(`/user/users/activate/${id}`);
      dispatch(updateChangeCount());
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  const handleDelete = (uuid) => {
    dispatch(setUserUuid(uuid));
    dispatch(setShowModal({ type: "delete" }));
  };

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <PageHeader
              title={`List of Users`}
              postTitle={postTitle}
              textClass={textClass}
            />
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
                                onClick={() => handleView(u.uuid)}
                              >
                                <IoFolderOpen size={14} />
                              </button>
                              {u.is_active ? (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-success btn-sm me-2"
                                    onClick={() =>
                                      dispatch(setUserUuid(u.uuid))
                                    }
                                  >
                                    <MdOutlineModeEdit />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm me-2"
                                    onClick={() => handleDelete(u.uuid)}
                                  >
                                    <FaRegTrashCan />
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-warning btn-sm me-2"
                                  onClick={() => activateUser(u.id)}
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
        <AddEditUser />
        <ViewUser />
        <UserDeleteModal />
      </PageWrapper>
    </>
  );
};

export default UserList;
