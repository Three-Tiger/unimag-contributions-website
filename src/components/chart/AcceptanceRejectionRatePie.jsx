import ReactApexChart from "react-apexcharts";
import statisticApi from "../../api/statisticApi";
import { useEffect, useState } from "react";
import handleError from "../../services/HandleErrors";
import NoData from "/gif/no_data.gif";
import { Image } from "react-bootstrap";

const AcceptanceRejectionRatePie = ({ facultyId }) => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        var params = null;
        if (facultyId) {
          params = { facultyId: facultyId };
        }

        const response = await statisticApi.acceptanceRejectionRate(params);
        console.log("🚀 ~ fetchData ~ response:", response);

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
      {(series[0] === 0 && series[1] === 0 && series[2] === 0) ||
      (series[0] === 0 && series[1] === 0) ? (
        <div className="text-center">
          <Image src={NoData} alt="No data" height={215} />
        </div>
      ) : (
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="pie"
          width={355}
        />
      )}
    </div>
  );
};

export default AcceptanceRejectionRatePie;
