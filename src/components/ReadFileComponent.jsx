import React, { useEffect, useState } from "react";
import fileDetailApi from "../api/fileDetailApi";
import handleError from "../services/HandleErrors";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { convertToHtml } from "mammoth/mammoth.browser";
import { PDFDocument } from "pdf-lib/cjs";

function ReadFileComponent({ fileDetail }) {
  const [docs, setDocs] = useState("");

  const test = [
    {
      uri: "/Report-Responses.pdf",
      fileType: "application/pdf",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fileDetailApi.readFile(fileDetail.fileId);
        const file = new File([response], fileDetail.fileName, {
          type: response.type,
        });
        const pdfFile = await convertToPdf(response);
        console.log("🚀 ~ fetchData ~ pdfFile:", pdfFile);
        // setDocs([
        //   {
        //     uri: window.URL.createObjectURL(pdfFile),
        //     fileType: "application/pdf",
        //     fileName: `${fileDetail.fileName.split(".")[0]}.pdf`,
        //   },
        // ]);

        setDocs([
          {
            uri: window.URL.createObjectURL(file),
            fileType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            fileName: fileDetail.fileName,
          },
        ]);
      } catch (error) {
        handleError.showError(error);
      }
    };

    const convertToPdf = async (docxBlob) => {
      try {
        const docxBuffer = await readBlobAsArrayBuffer(docxBlob);

        // Convert DOCX to HTML
        const { value } = await convertToHtml({ arrayBuffer: docxBuffer });

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();

        // Add HTML content to the PDF document
        const page = pdfDoc.addPage();
        page.drawText(value, { x: 50, y: 750, size: 12 });

        // Generate Blob for PDF file
        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

        return pdfBlob;

        // Download PDF file
        // const downloadLink = document.createElement("a");
        // downloadLink.href = window.URL.createObjectURL(pdfBlob);
        // downloadLink.download = "converted.pdf";
        // downloadLink.click();
      } catch (error) {
        console.error("Error converting DOCX to PDF:", error);
      }
    };

    const readBlobAsArrayBuffer = (blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
      });
    };

    fetchData();
  }, []);

  return (
    <>
      {docs ? (
        <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default ReadFileComponent;
