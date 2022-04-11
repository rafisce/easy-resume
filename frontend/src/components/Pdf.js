import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { Link } from "react-router-dom";
import { freshPdf } from "../resFormats/Clean";
import Loader from "./Loader";
import LoadingBox from "./LoadingBox";

const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
};
const Pdf = (props) => {
  const { file } = props;
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [display, setDisplay] = useState(false);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(numPages);
    setPageNumber(1);
    setDisplay(true);
  }

  useEffect(() => {}, [display]);

  return (
    <div>
      <Document
        className="pdfdoc"
        file={props.fresh ? freshPdf() : file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<Loader />}
        noData={<div style={{ width: "210px", height: "292px" }}></div>}
        options={options}
      >
        <Page
          pageNumber={pageNumber}
          loading={<div style={{ width: "210px", height: "292px" }}></div>}
        />
      </Document>
    </div>
  );
};

export default Pdf;
