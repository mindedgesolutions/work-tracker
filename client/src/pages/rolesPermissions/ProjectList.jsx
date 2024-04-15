import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, useLocation, useNavigate } from "react-router-dom";
import customFetch from "../../../utils/customFetch";
import {
  setListProject,
  setProjects,
  setAddModal,
} from "../../features/masters/projectSlice";
import { splitErrors } from "../../../utils/showErrors";
import {
  AddEditProject,
  PageHeader,
  PageWrapper,
  PaginationContainer,
  TableLoader,
} from "../../components";
import { IoIosSearch } from "react-icons/io";
import { IoFolderOpen, IoReloadSharp } from "react-icons/io5";
import { serialNo } from "../../../utils/functions";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";

const ProjectList = () => {
  document.title = `List of Projects | ${import.meta.env.VITE_ADMIN_TITLE}`;
  const returnUrl = `/admin/projects`;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [metaData, setMetaData] = useState([]);

  const { listProject } = useSelector((store) => store.projects);
  const { changeCount } = useSelector((store) => store.common);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(`/masters/projects`, {
        params: {
          name: queryParams.get("s") || "",
          page: queryParams.get("page") || "",
        },
      });

      setMetaData(response.data.meta);
      dispatch(setListProject(response.data.data.rows));
      dispatch(setProjects(response.data.data.rows));

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
  }, [queryParams.get("s"), queryParams.get("page"), changeCount]);

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <PageHeader title={`List of Projects`} />
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <span className="d-none d-sm-inline">
                  <button
                    type="submit"
                    className="btn btn-success d-none d-sm-inline-block me-2"
                    onClick={() => dispatch(setAddModal())}
                  >
                    Add new
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageWrapper>
        <div className="col-12">
          <AddEditProject />

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
                      <th className="bg-dark text-white"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={3}>
                          <TableLoader />
                        </td>
                      </tr>
                    ) : listProject?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center">
                          NO DATA FOUND
                        </td>
                      </tr>
                    ) : (
                      listProject?.map((r, index) => {
                        return (
                          <tr key={nanoid()}>
                            <td>
                              {serialNo(queryParams.get("page")) + index}.
                            </td>
                            <td>{r.name.toUpperCase()}</td>
                            <td className="text-nowrap">
                              <button
                                type="button"
                                className="btn btn-primary btn-sm me-2"
                                // onClick={() => handleView(r.uuid)}
                              >
                                <IoFolderOpen size={14} />
                              </button>
                              <button
                                type="button"
                                className="btn btn-success btn-sm me-2"
                                onClick={() => dispatch(setRoleId(r.id))}
                              >
                                <MdOutlineModeEdit />
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm me-2"
                                // onClick={() => handleDelete(r.uuid)}
                              >
                                <FaRegTrashCan />
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

export default ProjectList;
