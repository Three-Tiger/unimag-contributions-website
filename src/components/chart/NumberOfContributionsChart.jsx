import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import statisticApi from "../../api/statisticApi";
import handleError from "../../services/HandleErrors";

const NumberOfContributionsChart = () => {
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await statisticApi.numberOfContributions();
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
        height: 430,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      xaxis: {
        categories: categories,
      },
    },
  };

  return (
    <div>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={500}
      />
    </div>
  );
};

export default NumberOfContributionsChart;
