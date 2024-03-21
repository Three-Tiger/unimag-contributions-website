import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import statisticApi from "../../api/statisticApi";
import handleError from "../../services/HandleErrors";

const PercentagesChart = () => {
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await statisticApi.percentageOfContributions();
        setSeries(formatData(response));
        setCategories(formatCategories(response));
      } catch (error) {
        handleError.showError(error);
      }
    };

    const formatCategories = (data) => {
      return Object.keys(data);
    };

    const formatData = (data) => {
      const years = Object.keys(data);
      const fields = Object.keys(data[years[0]]);

      const formattedData = fields.map((field) => {
        const fieldData = [];

        years.forEach((year) => {
          fieldData.push(data[year][field]);
        });

        return { name: field, data: fieldData };
      });

      return formattedData;
    };

    fetchData();
  }, []);

  const state = {
    series: series,
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: "100%",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      xaxis: {
        categories: categories,
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "right",
        offsetX: 0,
        offsetY: 50,
      },
    },
  };

  return (
    <div>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default PercentagesChart;
