import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import "../Pdf.css";
import { cleanRes, cleanResOld } from "../resFormats/Clean";
import LoadingBox from "./LoadingBox";
import df from '../sample.pdf'
import dfd from '../res.pdf'

const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
};

const PdfView = (props) => {
  const { userId, docId } = props;
  const [file, setFile] = useState(false);
  const [showing,setShowing]=useState(false)
  const [oldFile,setOldFile]= useState("");
  const [started,setStarted]=useState(true)
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const load = <LoadingBox view={true} />;

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(numPages);
    setPageNumber(1);
    setShowing(false)
    setOldFile(file)
    
  }

  const show=()=>{
    if(!showing){
      setShowing(true)
      console.log('showing old')
    }
  }
  

  useEffect(() => {
    
    async function getPdf() {
      setFile(await cleanRes(userId, docId));
      
    }
    getPdf();
    
  }, [docId, props.path, started, userId,props.change]);

  return (
    <div className="PdfView">
      <div className="PdfView__container">
        <div className="PdfView__container__document">
          
          {file?
          <div>
            <Document          
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              options={options}
              loading={load}
              className={showing?"":"clear"}
              
            >
              <Page pageNumber={pageNumber} 
              />
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
         
            <Document
            
              file={oldFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadProgress={show}
              options={options}
              className={showing?"clear":""}
              //loading={load}
              
            >
              <Page pageNumber={pageNumber} 
              />

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
            </div>
          :null
}
          
        </div>
      </div>
    </div>
  );
};

export default PdfView;
