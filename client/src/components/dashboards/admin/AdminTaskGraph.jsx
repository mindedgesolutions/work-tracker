import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import { lastSixMonths } from "../../../../utils/functions";
import { splitErrors } from "../../../../utils/showErrors";
import customFetch from "../../../../utils/customFetch";

const AdminTaskGraph = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(`/charts/admin/task-bar`);
      setChartData(response.data.data.rows);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  const options = {
    series: [
      {
        name: "Net Profit",
        data: [44, 55, 57, 56, 61, 58],
      },
      {
        name: "Revenue",
        data: [76, 85, 101, 98, 87, 105],
      },
      {
        name: "Free Cash Flow",
        data: [35, 41, 36, 26, 45, 48],
      },
    ],
    chart: {
      type: "bar",
      height: 240,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: lastSixMonths(),
    },
    yaxis: {
      title: {
        text: "",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  };

  let chart;

  useEffect(() => {
    fetchData();

    chart = new ApexCharts(
      document.querySelector("#apexchartsq68n679s-1"),
      options
    );

    chart.render();
  }, []);

  return (
    <>
      <div className="col-lg-6">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">Task summary</h3>
            <div
              id="apexchartsq68n679s-1"
              className="chart-lg"
              style={{ minHeight: "240px" }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminTaskGraph;
