import React from "react";
import { AdminTaskGraph, PageHeader, PageWrapper } from "../../components";

const AdminDashboard = () => {
  document.title = `Admin Dashboard | ${import.meta.env.VITE_ADMIN_TITLE}`;

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <PageHeader title={`Admin Dashbaord`} />
          </div>
        </div>
      </div>
      <PageWrapper>
        <AdminTaskGraph />
        AdminDashboard
      </PageWrapper>
    </>
  );
};

export default AdminDashboard;
