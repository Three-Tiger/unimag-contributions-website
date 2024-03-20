import AcceptanceRejectionRatePie from "../components/chart/AcceptanceRejectionRatePie";
import NumberOfAccountBarChart from "../components/chart/NumberOfAccountBarChart";
import NumberOfContributionsChart from "../components/chart/NumberOfContributionsChart";
import PercentagesChart from "../components/chart/PercentagesChart";
import AdminLayout from "../components/layouts/Admin";

const DashboardPage = () => {
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
          <div className="filter">
            <a className="icon" href="#" data-bs-toggle="dropdown">
              <i className="bi bi-three-dots"></i>
            </a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <li className="dropdown-header text-start">
                <h6>Filter</h6>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  Today
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  This Month
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  This Year
                </a>
              </li>
            </ul>
          </div>

          <div className="card-body">
            <h5 className="card-title">
              Recent Sales <span>| Today</span>
            </h5>

            <table className="table table-borderless datatable">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Product</th>
                  <th scope="col">Price</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    <a href="#">#2457</a>
                  </th>
                  <td>Brandon Jacob</td>
                  <td>
                    <a href="#" className="text-primary">
                      At praesentium minu
                    </a>
                  </td>
                  <td>$64</td>
                  <td>
                    <span className="badge bg-success">Approved</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <a href="#">#2147</a>
                  </th>
                  <td>Bridie Kessler</td>
                  <td>
                    <a href="#" className="text-primary">
                      Blanditiis dolor omnis similique
                    </a>
                  </td>
                  <td>$47</td>
                  <td>
                    <span className="badge bg-warning">Pending</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <a href="#">#2049</a>
                  </th>
                  <td>Ashleigh Langosh</td>
                  <td>
                    <a href="#" className="text-primary">
                      At recusandae consectetur
                    </a>
                  </td>
                  <td>$147</td>
                  <td>
                    <span className="badge bg-success">Approved</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <a href="#">#2644</a>
                  </th>
                  <td>Angus Grady</td>
                  <td>
                    <a href="#" className="text-primar">
                      Ut voluptatem id earum et
                    </a>
                  </td>
                  <td>$67</td>
                  <td>
                    <span className="badge bg-danger">Rejected</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <a href="#">#2644</a>
                  </th>
                  <td>Raheem Lehner</td>
                  <td>
                    <a href="#" className="text-primary">
                      Sunt similique distinctio
                    </a>
                  </td>
                  <td>$165</td>
                  <td>
                    <span className="badge bg-success">Approved</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card top-selling overflow-auto">
          <div className="filter">
            <a className="icon" href="#" data-bs-toggle="dropdown">
              <i className="bi bi-three-dots"></i>
            </a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <li className="dropdown-header text-start">
                <h6>Filter</h6>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  Today
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  This Month
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  This Year
                </a>
              </li>
            </ul>
          </div>

          <div className="card-body pb-0">
            <h5 className="card-title">
              Top Selling <span>| Today</span>
            </h5>

            <table className="table table-borderless">
              <thead>
                <tr>
                  <th scope="col">Preview</th>
                  <th scope="col">Product</th>
                  <th scope="col">Price</th>
                  <th scope="col">Sold</th>
                  <th scope="col">Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    <a href="#">
                      <img src="assets/img/product-1.jpg" alt="" />
                    </a>
                  </th>
                  <td>
                    <a href="#" className="text-primary fw-bold">
                      Ut inventore ipsa voluptas nulla
                    </a>
                  </td>
                  <td>$64</td>
                  <td className="fw-bold">124</td>
                  <td>$5,828</td>
                </tr>
                <tr>
                  <th scope="row">
                    <a href="#">
                      <img src="assets/img/product-2.jpg" alt="" />
                    </a>
                  </th>
                  <td>
                    <a href="#" className="text-primary fw-bold">
                      Exercitationem similique doloremque
                    </a>
                  </td>
                  <td>$46</td>
                  <td className="fw-bold">98</td>
                  <td>$4,508</td>
                </tr>
                <tr>
                  <th scope="row">
                    <a href="#">
                      <img src="assets/img/product-3.jpg" alt="" />
                    </a>
                  </th>
                  <td>
                    <a href="#" className="text-primary fw-bold">
                      Doloribus nisi exercitationem
                    </a>
                  </td>
                  <td>$59</td>
                  <td className="fw-bold">74</td>
                  <td>$4,366</td>
                </tr>
                <tr>
                  <th scope="row">
                    <a href="#">
                      <img src="assets/img/product-4.jpg" alt="" />
                    </a>
                  </th>
                  <td>
                    <a href="#" className="text-primary fw-bold">
                      Officiis quaerat sint rerum error
                    </a>
                  </td>
                  <td>$32</td>
                  <td className="fw-bold">63</td>
                  <td>$2,016</td>
                </tr>
                <tr>
                  <th scope="row">
                    <a href="#">
                      <img src="assets/img/product-5.jpg" alt="" />
                    </a>
                  </th>
                  <td>
                    <a href="#" className="text-primary fw-bold">
                      Sit unde debitis delectus repellendus
                    </a>
                  </td>
                  <td>$79</td>
                  <td className="fw-bold">41</td>
                  <td>$3,239</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default DashboardPage;
