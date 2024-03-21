import ReactApexChart from "react-apexcharts";
import statisticApi from "../../api/statisticApi";
import { useEffect, useState } from "react";
import handleError from "../../services/HandleErrors";

const NumberOfAccountBarChart = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await statisticApi.numberOfAccountsCreated();

        Object.keys(response).forEach((key) => {
          if (categories.includes(key)) return;
          setData((data) => [...data, response[key]]);
          setCategories((categories) => [...categories, key]);
        });
      } catch (error) {
        handleError.showError(error);
      }
    };

    fetchData();
  }, []);

  const state = {
    series: [
      {
        data: data,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
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
        height={200}
      />
    </div>
  );
};

export default NumberOfAccountBarChart;
