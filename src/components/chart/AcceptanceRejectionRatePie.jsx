import ReactApexChart from "react-apexcharts";
import statisticApi from "../../api/statisticApi";
import { useEffect, useState } from "react";
import handleError from "../../services/HandleErrors";

const AcceptanceRejectionRatePie = () => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await statisticApi.acceptanceRejectionRate();

        Object.keys(response).forEach((key) => {
          if (labels.includes(key)) return;
          setSeries((series) => [...series, response[key]]);
          setLabels((labels) => [...labels, key]);
        });
      } catch (error) {
        handleError.showError(error);
      }
    };

    fetchData();
  }, []);

  const state = {
    series: series,
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: labels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <div>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="pie"
        width={355}
      />
    </div>
  );
};

export default AcceptanceRejectionRatePie;
