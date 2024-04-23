import React, { useEffect, useState } from "react";
import {
  AssignPermissionToRole,
  PageHeader,
  PageWrapper,
  PaginationContainer,
  TableLoader,
} from "../../components";
import { Form, useLocation, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { IoReloadSharp } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { splitErrors } from "../../../utils/showErrors";
import customFetch from "../../../utils/customFetch";
import { serialNo } from "../../../utils/functions";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";
import { setRolePermissionModal } from "../../features/masters/permissionSlice";
import { setListRole } from "../../features/masters/roleSlice";

const RolePermission = () => {
  document.title = `Role wise Permissions | ${
    import.meta.env.VITE_ADMIN_TITLE
  }`;
  const returnUrl = `/admin/role-permissions`;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const { listRole } = useSelector((store) => store.roles);

  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [metaData, setMetaData] = useState([]);

  const resetSearch = () => {
    setSearchInput("");
    navigate(returnUrl);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(`/masters/roles`, {
        params: {
          name: queryParams.get("s") || "",
          page: queryParams.get("page") || "",
        },
      });
      setMetaData(response.data.meta);
      dispatch(setListRole(response.data.data.rows));

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
  }, [queryParams.get("s"), queryParams.get("page")]);

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <PageHeader title={`Role-wise Permissions`} />
          </div>
        </div>
      </div>
      <PageWrapper>
        <div className="col-12">
          <AssignPermissionToRole />

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
                      <th className="bg-dark text-white">Role</th>
                      <th className="bg-dark text-white">Permissions</th>
                      <th className="bg-dark text-white"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={4}>
                          <TableLoader />
                        </td>
                      </tr>
                    ) : listRole?.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center">
                          NO DATA FOUND
                        </td>
                      </tr>
                    ) : (
                      listRole?.map((r, index) => {
                        return (
                          <tr key={nanoid()}>
                            <td>
                              {serialNo(queryParams.get("page")) + index}.
                            </td>
                            <td className="text-nowrap">
                              {r.name.toUpperCase()}
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
                                  dispatch(setRolePermissionModal(r.id))
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
            {/* <ViewProject /> */}
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

export default RolePermission;
