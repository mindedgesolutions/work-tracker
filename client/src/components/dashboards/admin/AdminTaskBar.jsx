import React, { useEffect } from "react";
import ApexCharts from "apexcharts";
import { lastSixMonths } from "../../../../utils/functions";

const AdminTaskBar = ({ taskBarData, isLoading }) => {
  const options = {
    series: taskBarData,
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
    chart = new ApexCharts(
      document.querySelector("#apexchartsq68n679s-1"),
      options
    );

    chart.render();
  }, [taskBarData]);

  return (
    <div className="col-lg-6">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Task summary</h3>
          {isLoading ? (
            <div>Loading ...</div>
          ) : (
            <div
              id="apexchartsq68n679s-1"
              className="chart-lg"
              style={{ minHeight: "240px" }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTaskBar;
