import { Page, Document} from '@react-pdf/renderer';

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