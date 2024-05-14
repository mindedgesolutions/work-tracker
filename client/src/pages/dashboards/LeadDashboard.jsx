import React from "react";
import {
  LeadTaskTable,
  PageHeader,
  PageWrapper,
  TeamMembers,
} from "../../components";

const LeadDashboard = () => {
  document.title = `Lead Dashboard | ${import.meta.env.VITE_LEAD_TITLE}`;

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <PageHeader title={`Leader Dashbaord`} />
          </div>
        </div>
      </div>
      <PageWrapper>
        <TeamMembers />
        <LeadTaskTable />
      </PageWrapper>
    </>
  );
};

export default LeadDashboard;
