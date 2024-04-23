import React, { useEffect, useState } from "react";
import {
  AssignPermissionToUser,
  PageHeader,
  PageWrapper,
  PaginationContainer,
  TableLoader,
} from "../../components";
import { Form, useLocation, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { IoReloadSharp } from "react-icons/io5";
import { nanoid } from "nanoid";
import { roleBadge, serialNo } from "../../../utils/functions";
import { MdOutlineModeEdit } from "react-icons/md";
import { setUserPermissionModal } from "../../features/masters/permissionSlice";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../../../utils/customFetch";
import { splitErrors } from "../../../utils/showErrors";
import { setUsers } from "../../features/users/userSlice";

const UserPermission = () => {
  document.title = `User-wise Permissions | ${
    import.meta.env.VITE_ADMIN_TITLE
  }`;
  const returnUrl = `/admin/user-permissions`;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [metaData, setMetaData] = useState([]);

  const { users } = useSelector((store) => store.users);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(`/user/users`, {
        params: {
          name: queryParams.get("s") || "",
          page: queryParams.get("page") || "",
        },
      });
      dispatch(setUsers(response.data.data.rows));
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

  const resetSearch = () => {
    setSearchInput("");
    navigate(returnUrl);
  };

  useEffect(() => {
    fetchData();
  }, [queryParams.get("s"), queryParams.get("page")]);

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <PageHeader title={`User-wise Permissions`} />
          </div>
        </div>
      </div>
      <PageWrapper>
        <div className="col-12">
          <AssignPermissionToUser />

          <div className="card">
            <div className="card-header">
              Total {totalRecords} roles found
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
                      <th className="bg-dark text-white">Permissions</th>
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
                    ) : users?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center">
                          NO DATA FOUND
                        </td>
                      </tr>
                    ) : (
                      users?.map((r, index) => {
                        return (
                          <tr key={nanoid()}>
                            <td>
                              {serialNo(queryParams.get("page")) + index}.
                            </td>
                            <td className="text-nowrap">
                              {r.name.toUpperCase()}
                            </td>
                            <td className="text-nowrap">
                              <span
                                className={`badge bg-${roleBadge(
                                  r.role
                                )}-lt me-1 my-1 fs-6`}
                              >
                                {r.role.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              {r.permissions.map((p) => {
                                return (
                                  p.name && (
                                    <span
                                      key={nanoid()}
                                      className={`badge bg-success-lt me-1 my-1 fs-6`}
                                    >
                                      {p.name}
                                    </span>
                                  )
                                );
                              })}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-success btn-sm me-2"
                                onClick={() =>
                                  dispatch(setUserPermissionModal(r.id))
                                }
                              >
                                <MdOutlineModeEdit />
                              </button>
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

export default UserPermission;
