import { useEffect, useState } from "react";
import AcceptanceRejectionRatePie from "../components/chart/AcceptanceRejectionRatePie";
import NumberOfContributionsChart from "../components/chart/NumberOfContributionsChart";
import handleError from "../services/HandleErrors";
import FullLayout from "../components/layouts/Full";
import authService from "../services/AuthService";

const GuestStatisticPage = () => {
  const [facultyId, setFacultyId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = authService.getUserData();
        setFacultyId(user.faculty.facultyId);
      } catch (error) {
        handleError.showError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <FullLayout>
      {facultyId && (
        <section className="section dashboard container">
          <div className="row">
            <div className="col-md-6">
              <div className="card info-card sales-card">
                <div className="card-body">
                  <h5 className="card-title">
                    Contribution pending/acceptance/rejection rate
                  </h5>
                  <AcceptanceRejectionRatePie facultyId={facultyId} />
                </div>
              </div>
            </div>

            <div className="col-md-6"></div>
          </div>
          <div className="card info-card sales-card">
            <div className="card-body">
              <h5 className="card-title">
                Number of contributiors for each academic year.
              </h5>
              <NumberOfContributionsChart facultyId={facultyId} />
            </div>
          </div>
        </section>
      )}
    </FullLayout>
  );
};

export default GuestStatisticPage;
