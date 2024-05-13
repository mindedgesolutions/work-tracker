import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import customFetch from "../../../../utils/customFetch";
import { splitErrors } from "../../../../utils/showErrors";

const AdminRemarkPie = ({ isLoading }) => {
  const { projects } = useSelector((store) => store.projects);
  const [projectNo, setProjectNo] = useState("");

  const getPieData = async (id) => {
    const project = id || 1;
    setProjectNo(project || "");
    try {
      const response = await customFetch.get(
        `/charts/admin/remark-pie/${project}`
      );
      console.log(response.data.data);
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  useEffect(() => {
    getPieData;
  }, [projectNo]);

  return (
    <div className="col-lg-6">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <h3 className="card-title col">Task summary</h3>
            <div className="col-auto">
              <select
                className="form-control form-control-sm mt-1 px-2"
                name="projectId"
                value={projectNo}
                onChange={(e) => getPieData(e.target.value)}
              >
                <option value="">- Select project -</option>
                {projects.map((i) => {
                  return (
                    <option key={nanoid()} value={i.id}>
                      {i.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          {isLoading ? (
            <div>Loading ...</div>
          ) : (
            <div id="apexchartsq68n679s-2" className="chart-md"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRemarkPie;
