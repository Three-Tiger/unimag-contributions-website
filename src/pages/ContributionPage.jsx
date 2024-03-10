import { useState } from "react";
import AdminLayout from "../components/layouts/Admin";
import fileDetailApi from "../api/fileDetail";

const ContributionPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadSingle = async () => {
    setIsLoading(true);
    try {
      const response = await fileDetailApi.downloadFile(
        "FACAF748-1CFF-433E-9859-08DC401F2F44"
      );
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setIsLoading(false);
    } catch (error) {
      console.error("Error downloading file:", error);
      setIsLoading(false);
    }
  };

  const handleDownloadMultiple = async () => {
    setIsLoading(true);
    try {
      const response = await fileDetailApi.downloadMultipleFile(
        "FFF0BBE8-96C3-4A86-9793-08DC401EEE54"
      );
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ContributionFile.zip");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setIsLoading(false);
    } catch (error) {
      console.error("Error downloading file:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <AdminLayout>
        <div>
          <button onClick={handleDownloadMultiple} disabled={isLoading}>
            {isLoading ? "Downloading..." : "Download Multiple Files"}
          </button>

          <button onClick={handleDownloadSingle} disabled={isLoading}>
            {isLoading ? "Downloading..." : "Download Single Files"}
          </button>
        </div>
      </AdminLayout>
    </>
  );
};

export default ContributionPage;
