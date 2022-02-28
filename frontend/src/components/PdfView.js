import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import "../Pdf.css";
import { cleanRes } from "../resFormats/Clean";
import LoadingBox from "./LoadingBox";

const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
};

const PdfView = (props) => {
  const { userId, docId } = props;
  const [file, setFile] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const load = <LoadingBox view={true} />;

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  useEffect(() => {
    async function getPdf() {
      setFile(await cleanRes(userId, docId));
    }
    getPdf();
  }, [docId, props.path, userId]);

  return (
    <div className="PdfView">
      <div className="PdfView__container">
        <div className="PdfView__container__document">
          {file ? (
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              options={options}
              loading={load}
            >
              <Page pageNumber={pageNumber} />
              {props.small ? null : (
                <div className="Page_control">
                  <button>{"<"}</button>
                  <span>
                    {numPages} מתוך {pageNumber}
                  </span>
                  <button>{">"}</button>
                </div>
              )}
            </Document>
          ) : (
            load
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfView;
