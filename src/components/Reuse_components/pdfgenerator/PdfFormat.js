import React, { Children } from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles


// Create Document Component
const PdfFormat = ({children}) => (
  <Document>
    <Page>
      {children}
    </Page>
  </Document>
);



export default PdfFormat;