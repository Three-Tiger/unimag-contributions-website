import { useEffect, useState } from "react";
import contributionApi from "../../api/contributionApi";

const ContributionComponent = ({ annualMagazine }) => {
  const [contributions, setContributions] = useState([]);

  const handleErrors = (error) => {
    if (error.response.status >= 400 && error.response.status < 500) {
      swalService.showMessage(
        "Warning",
        error.response.data.message,
        "warning"
      );
    } else {
      swalService.showMessage(
        "Error",
        "Something went wrong. Please try again later.",
        "error"
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =
          await contributionApi.getContributionsByAnnualMagazineId(
            annualMagazine.annualMagazineId
          );

        setContributions(response);
      } catch (error) {
        handleErrors(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {contributions.length > 0 && (
        <div>
          {contributions.map((contribution) => (
            <div key={contribution.contributionId}>
              <h1>{contribution.title}</h1>
              <p>{contribution.description}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ContributionComponent;
