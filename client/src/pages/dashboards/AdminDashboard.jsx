import React from "react";
import {
  AdminRemarkPie,
  AdminTaskBar,
  PageHeader,
  PageWrapper,
} from "../../components";
import customFetch from "../../../utils/customFetch";
import { splitErrors } from "../../../utils/showErrors";
import { useLoaderData, useNavigation } from "react-router-dom";

export const loader = async () => {
  try {
    const task = await customFetch.get(`/charts/admin/task-bar`);
    return { taskBarData: task.data.data };
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return error;
  }
};

const AdminDashboard = () => {
  document.title = `Admin Dashboard | ${import.meta.env.VITE_ADMIN_TITLE}`;

  const { taskBarData } = useLoaderData();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

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
        <div className="row">
          <AdminTaskBar taskBarData={taskBarData} isLoading={isLoading} />
          <AdminRemarkPie isLoading={isLoading} />
        </div>
        AdminDashboard
      </PageWrapper>
    </>
  );
};

export default AdminDashboard;
