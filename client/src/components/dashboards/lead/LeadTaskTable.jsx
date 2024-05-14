import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const LeadTaskTable = () => {
  const { memberId, teamMembers } = useSelector((store) => store.teams);
  const member = memberId || teamMembers[0].id;

  useEffect(() => {
    console.log(member);
  }, [member]);

  return (
    <div className="col-lg-8">
      <div className="card" style={{ minHeight: "28rem" }}>
        <div className="card-header">
          <h3 className="card-title">Invoices</h3>
        </div>
        <div className="table-responsive">
          <table className="table card-table table-vcenter text-nowrap datatable">
            <thead>
              <tr>
                <th>Created</th>
                <th>Status</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="flag flag-xs flag-country-us me-2"></span>
                  Carlson Limited
                </td>
                <td>87956621</td>
                <td>15 Dec 2017</td>
                <td>
                  <span className="badge bg-success me-1"></span> Paid
                </td>
                <td>$887</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadTaskTable;
