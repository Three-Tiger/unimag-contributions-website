import { useEffect, useState } from "react";
import AdminLayout from "../components/layouts/Admin";
import { Tab, Tabs } from "react-bootstrap";
import annualMagazineApi from "../api/annualMagazine";
import swalService from "../services/SwalService";
import ContributionComponent from "../components/ContributionComponent";
import handleError from "../services/HandleErrors";

const ContributionPage = () => {
  const [annualMagazines, setAnnualMagazines] = useState([]);
  const [key, setKey] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await annualMagazineApi.getAll();

        setAnnualMagazines(response);
        if (response.length > 0) {
          setKey(response[0].academicYear);
        }
      } catch (error) {
        handleError.showError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <AdminLayout>
        {annualMagazines.length > 0 && (
          <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
            {annualMagazines.map((annualMagazine, index) => (
              <Tab
                key={index}
                eventKey={annualMagazine.academicYear}
                title={annualMagazine.academicYear}
              >
                {key === annualMagazine.academicYear && (
                  <ContributionComponent annualMagazine={annualMagazine} />
                )}
              </Tab>
            ))}
          </Tabs>
        )}
      </AdminLayout>
    </>
  );
};

export default ContributionPage;
