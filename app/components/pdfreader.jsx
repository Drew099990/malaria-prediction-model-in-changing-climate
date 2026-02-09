
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import React from 'react'

function PDFr() {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages } ){
    setNumPages(numPages);
  }

  return (
    <div>
      <Document file="./ICT341_202002654_LAB 4.pdf" onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
}

export default PDFr;