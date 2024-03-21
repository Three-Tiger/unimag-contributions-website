import { useEffect, useState } from "react";
import AcceptanceRejectionRatePie from "../components/chart/AcceptanceRejectionRatePie";
import NumberOfAccountBarChart from "../components/chart/NumberOfAccountBarChart";
import NumberOfContributionsChart from "../components/chart/NumberOfContributionsChart";
import PercentagesChart from "../components/chart/PercentagesChart";
import AdminLayout from "../components/layouts/Admin";
import handleError from "../services/HandleErrors";
import statisticApi from "../api/statisticApi";
import formatDateTime from "../services/FormatDateTime";

const DashboardPage = () => {
  const [recentContributions, setRecentContributions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await statisticApi.getRecentContribution();
        setRecentContributions(response);
      } catch (error) {
        handleError.showError(error);
      }
    };

    fetchData();
  }, []);
  return (
    <AdminLayout>
      <section className="section dashboard">
        <div className="row">
          <div className="col-md-6">
            <div className="card info-card sales-card">
              <div className="card-body">
                <h5 className="card-title">
                  Contribution acceptance/rejection rate
                </h5>

                <AcceptanceRejectionRatePie />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card info-card revenue-card">
              <div className="card-body">
                <h5 className="card-title">Number of accounts created</h5>

                <NumberOfAccountBarChart />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              Number of contributions within each Faculty for each academic
              year.
            </h5>
            <NumberOfContributionsChart />
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              Percentage of contributions by each Faculty for any academic year.
            </h5>
            <PercentagesChart />
          </div>
        </div>

        <div className="card recent-sales overflow-auto">
          <div className="card-body">
            <h5 className="card-title">Recent Contributions</h5>

            <table className="table table-borderless datatable">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Submission Date</th>
                  <th scope="col">Email</th>
                  <th scope="col">Full name</th>
                  <th scope="col">Avatar</th>
                  <th scope="col">Faculty</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentContributions.map((contribution, index) => (
                  <tr key={index} className="align-middle">
                    <td>{contribution.title}</td>
                    <td>
                      {formatDateTime.toDateTimeString(
                        contribution.submissionDate
                      )}
                    </td>
                    <td>{contribution.user.email}</td>
                    <td>
                      {contribution.user.firstName} {contribution.user.lastName}
                    </td>
                    <td>
                      <img
                        src={
                          contribution.user.profilePicture
                            ? `/api/users/${contribution.user.userId}/image`
                            : "/image/default-avatar.png"
                        }
                        alt={contribution.user.firstName}
                        width="50"
                        height="50"
                        className="rounded-circle"
                      />
                    </td>
                    <td>{contribution.user.faculty.name}</td>
                    <td>
                      <span
                        className={
                          contribution.status === "Waiting"
                            ? "badge bg-warning"
                            : contribution.status === "Approved"
                            ? "badge bg-success"
                            : "badge bg-danger"
                        }
                      >
                        {contribution.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default DashboardPage;
