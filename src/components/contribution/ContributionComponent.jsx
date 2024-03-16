import { useEffect, useState } from "react";
import contributionApi from "../../api/contributionApi";
import handleError from "../../services/HandleErrors";

const ContributionComponent = ({ annualMagazine }) => {
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =
          await contributionApi.getContributionsByAnnualMagazineId(
            annualMagazine.annualMagazineId
          );
        setContributions(response);
      } catch (error) {
        handleError.showError(error);
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
