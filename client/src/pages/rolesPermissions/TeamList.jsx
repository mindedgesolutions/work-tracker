import React, { useEffect, useState } from "react";
import {
  AssignTeam,
  PageHeader,
  PageWrapper,
  PaginationContainer,
  TableLoader,
} from "../../components";
import { Form, useLocation } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { IoFolderOpen, IoReloadSharp } from "react-icons/io5";
import { nanoid } from "nanoid";
import { serialNo } from "../../../utils/functions";
import { MdOutlineModeEdit } from "react-icons/md";
import customFetch from "../../../utils/customFetch";
import { splitErrors } from "../../../utils/showErrors";
import { useDispatch, useSelector } from "react-redux";
import {
  setLeadId,
  setListTeam,
  setShowModal,
} from "../../features/masters/teamSlice";

const TeamList = () => {
  document.title = `Assign members to Teams | ${
    import.meta.env.VITE_ADMIN_TITLE
  }`;

  const dispatch = useDispatch();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const [isLoading, setIsLoading] = useState(false);
  const [metaData, setMetaData] = useState("");

  const { listTeam } = useSelector((store) => store.teams);
  const { changeCount } = useSelector((store) => store.common);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(`/masters/teams`, {
        params: { page: queryParams.get("page") || "" },
      });
      dispatch(setListTeam(response.data.data.rows));
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

  const openModal = (id) => {
    dispatch(setLeadId(id));
    dispatch(setShowModal());
  };

  useEffect(() => {
    fetchData();
  }, [changeCount]);

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <PageHeader title={`Assign members to Teams`} />
          </div>
        </div>
      </div>
      <PageWrapper>
        <div className="col-12">
          <AssignTeam />

          <div className="card">
            <div className="card-header">Total {totalRecords} teams found</div>

            <div className="card-body p-2">
              <div className="table-responsive">
                <table className="table table-vcenter datatable table-hover table-bordered card-table fs-5">
                  <thead>
                    <tr>
                      <th className="bg-dark text-white">Sl. No.</th>
                      <th className="bg-dark text-white">Manager / Lead</th>
                      <th className="bg-dark text-white">Role</th>
                      <th className="bg-dark text-white">Members</th>
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
                    ) : listTeam?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center">
                          NO DATA FOUND
                        </td>
                      </tr>
                    ) : (
                      listTeam?.map((r, index) => {
                        return (
                          <tr key={nanoid()}>
                            <td>
                              {serialNo(queryParams.get("page")) + index}.
                            </td>
                            <td>{r?.name?.toUpperCase()}</td>
                            <td>{r?.role?.toUpperCase()}</td>
                            <td>
                              {r?.members?.map((i) => {
                                return (
                                  <span
                                    key={nanoid()}
                                    className="badge bg-success-lt cursor-pointer me-1"
                                  >
                                    {i.name}
                                  </span>
                                );
                              })}
                            </td>
                            <td className="text-nowrap">
                              <button
                                type="button"
                                className="btn btn-success btn-sm me-2"
                                onClick={() => openModal(r?.id)}
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

export default TeamList;
