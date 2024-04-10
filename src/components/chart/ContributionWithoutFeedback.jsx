import ReactApexChart from "react-apexcharts";
import statisticApi from "../../api/statisticApi";
import { useEffect, useState } from "react";
import handleError from "../../services/HandleErrors";
import NoData from "/gif/no_data.gif";
import { Image } from "react-bootstrap";

const ContributionWithoutFeedback = () => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await statisticApi.getContributionWithoutComment();

        const contributionWithoutFeedback =
          response.contributionWithoutFeedback;
        const contributionWithFeedback =
          response.totalContributions - contributionWithoutFeedback;

        setSeries([contributionWithoutFeedback, contributionWithFeedback]);
        setLabels(["Without feedback (articles)", "With feedback (articles)"]);
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
      {series[0] === 0 && series[1] === 0 && series[2] === 0 ? (
        <div className="text-center">
          <Image src={NoData} alt="No data" height={215} />
        </div>
      ) : (
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="pie"
          width={450}
        />
      )}
    </div>
  );
};

export default ContributionWithoutFeedback;
