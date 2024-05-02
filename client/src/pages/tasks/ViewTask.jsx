import React, { useEffect, useState } from "react";
import { PageHeader, PageWrapper, PaginationContainer } from "../../components";
import {
  Form,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { IoReloadSharp } from "react-icons/io5";
import { splitErrors } from "../../../utils/showErrors";
import customFetch from "../../../utils/customFetch";
import { useDispatch, useSelector } from "react-redux";
import { setTask, setTaskRemarks } from "../../features/task/taskSlice";
import { priorityTextColor } from "../../../utils/functions";
import { nanoid } from "nanoid";

const ViewTask = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const { returnPath } = useSelector((store) => store.auth);
  const { task, taskRemarks } = useSelector((store) => store.tasks);

  const [searchInput, setSearchInput] = useState("");
  const [taskUuid, setTaskUuid] = useState("");
  const [meta, setMeta] = useState("");

  const returnUrl = <Link to={`${returnPath}/tasks`}>Back to Task List</Link>;

  const fetchData = async () => {
    setTaskUuid(params.id);
    try {
      const master = await customFetch.get(`/tasks/all-data/${params.id}`);
      dispatch(setTask(master.data.data.rows[0]));

      const remarks = await customFetch.get(`/tasks/task-remarks/${params.id}`);
      dispatch(setTaskRemarks(remarks.data.data.rows));
      setMeta(remarks.data.meta);
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  document.title = `View Details of ${task?.task_id} | ${
    import.meta.env.VITE_COMMON_TITLE
  }`;

  const totalRecords = meta.totalRecords;
  const pageCount = meta.totalPages;
  const currentPage = meta.currentPage;

  const resetSearch = () => {};

  useEffect(() => {
    fetchData();
  }, [params.id]);

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <PageHeader
              title={`View Details of ${task?.task_id}`}
              breadCrumb={returnUrl}
            />
          </div>
        </div>
      </div>
      <PageWrapper>
        <div className="col-md-5 col-sm-12">
          <div className="card">
            <div className="card-header pb-0">
              <h3 className="card title border-0">Task details</h3>
            </div>
            <div className="card-body">
              <div className="col-md-12 col-sm-12">
                <label className="fw-bold">{task?.prname?.toUpperCase()}</label>
              </div>
              <div className="col-md-12 col-sm-12 fw-bold mt-4">
                <p className="fw-bold">{task?.short_desc}</p>
              </div>
              <div className="col-md-12 col-sm-12 mt-2">
                <p>{task?.long_desc || `NA`}</p>
              </div>
              <hr />
              <div className="col-md-12 col-sm-12">
                <label>
                  {task?.time_allotted} {task?.time_unit}/s
                  {priorityTextColor(task?.priorityname)}
                </label>
              </div>
              <div className="col-md-12 col-sm-12 mt-2">
                <label>
                  Assigned by :{" "}
                  <span className="fw-bold">
                    {task?.assignby?.toUpperCase()}
                  </span>
                </label>
              </div>
              <div className="col-md-12 col-sm-12 mt-2">
                <label className="mb-2">Assigned to : </label>
                <br />
                {task?.details?.map((i, index) => {
                  return (
                    <div key={nanoid()}>
                      <span className="fw-bold">
                        {index + 1}. {i?.assign_name?.toUpperCase()}
                      </span>
                      <br />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-7 col-sm-12">
          <div className="card">
            <div className="card-header">
              Total {totalRecords} updates found
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

            <div className="card-body">
              {task?.remarks?.map((i) => {
                return (
                  i.remark_by_id && (
                    <div key={nanoid()} className="list-group-item mb-3">
                      <div className="row align-items-center">
                        <div className="col-auto">
                          <span className="badge bg-red"></span>
                        </div>
                        <div className="col">
                          <a href="#" className="text-reset">
                            Pawel Kuna
                          </a>
                          <div className="text-secondary">
                            Change deprecated html tags to text decoration
                            classes (#29604) Lorem ipsum, dolor sit amet
                            consectetur adipisicing elit. Ex error qui inventore
                            obcaecati sequi, amet dolorum necessitatibus ratione
                            molestiae libero maiores voluptas cumque magnam quo
                            pariatur labore iure optio. Recusandae.
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                );
              })}
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

export default ViewTask;
