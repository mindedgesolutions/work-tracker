import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid";
import { initials, randomBadgeBg } from "../../../../utils/functions";
import { setMemberId } from "../../../features/masters/teamSlice";

const TeamMembers = () => {
  const dispatch = useDispatch();
  const { teamMembers } = useSelector((store) => store.teams);

  return (
    <div className="col-lg-4">
      <div className="row row-cards">
        <div className="col-12">
          <div className="card" style={{ height: "28rem" }}>
            <div className="card-body card-body-scrollable card-body-scrollable-shadow">
              <div className="divide-y">
                {teamMembers?.map((i) => {
                  return (
                    <div
                      key={nanoid()}
                      className="cursor-pointer"
                      onClick={() => dispatch(setMemberId(i.id))}
                    >
                      <div className="row">
                        <div className="col-auto">
                          <span
                            className={`avatar bg-${randomBadgeBg()} text-white`}
                          >
                            {initials(i.name)}
                          </span>
                        </div>
                        <div className="col">
                          <div className="text-truncate">
                            <strong>{i.name}</strong>
                          </div>
                          <div className="text-secondary">
                            {i.task_count === "0"
                              ? `0`
                              : i.task_count < 10
                              ? `0` + i.task_count
                              : i.task_count}{" "}
                            open tasks
                          </div>
                        </div>
                        <div className="col-auto align-self-center">
                          <div className="badge bg-success"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
