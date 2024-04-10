import ReactApexChart from "react-apexcharts";
import statisticApi from "../../api/statisticApi";
import { useEffect, useState } from "react";
import handleError from "../../services/HandleErrors";
import NoData from "/gif/no_data.gif";
import { Image } from "react-bootstrap";

const ContributionWithoutFeedbackAfter14Days = () => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          annualMagazineId: "2B3068E2-EAB5-476D-6C45-08DC458456C8",
        };

        const response =
          await statisticApi.getPercentageContributionFeedbackAfter14Days(
            params
          );
        console.log("🚀 ~ fetchData ~ response:", response);

        const percentageWithFeedbackAfter14Days = response.percentage;
        const percentageWithoutFeedbackAfter14Days =
          100 - percentageWithFeedbackAfter14Days;

        setSeries([
          percentageWithoutFeedbackAfter14Days,
          percentageWithFeedbackAfter14Days,
        ]);
        setLabels([
          "Without feedback after 14 days (articles)",
          "With feedback after 14 days (articles)",
        ]);
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
          width={520}
        />
      )}
    </div>
  );
};

export default ContributionWithoutFeedbackAfter14Days;
