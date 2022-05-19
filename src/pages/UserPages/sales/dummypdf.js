import { PDFViewer, View, Text } from "@react-pdf/renderer";
import PdfFormat from "../../../components/Reuse_components/pdfgenerator/PdfFormat";
import { Pdfstyles as pdfstyles } from "../../../components/Reuse_components/pdfgenerator/Pdfstyles";

function dummypdf({ data, accountName, itemname }) {
    return (
        <PDFViewer width={"700px"} height={"500px"}>
            <PdfFormat>
                <View style={{ alignItems: "center" }}>
                    <Text style={pdfstyles.heading}>Mill Send Challan</Text>
                    <Text style={pdfstyles.title}>Textile ERP Software</Text>

                    <Text style={{ padding: "10px" }}>
                        {
                            "-------------------------------------------------------------"
                        }
                    </Text>
                </View>
                <View style={pdfstyles.inputbox}>
                    <View style={pdfstyles.inputline}>
                        <Text style={pdfstyles.texts}>
                            M/s &emsp; : &emsp; {accountName}
                        </Text>
                        <Text style={pdfstyles.texts}>
                            Challan No &emsp; : &emsp; {data.challanNumber}
                        </Text>
                    </View>
                    <View style={pdfstyles.inputline}>
                        <Text style={pdfstyles.texts}>
                            Address &emsp; : &emsp; {data.challanNumber}
                        </Text>
                        <Text style={pdfstyles.texts}>
                            Challan Date &emsp; : &emsp;
                            {data.challanDate}
                        </Text>
                    </View>
                    <View style={pdfstyles.inputline}>
                        <Text style={pdfstyles.texts}>
                            Item &emsp; : &emsp; {itemname}
                        </Text>
                    </View>
                    <View style={pdfstyles.inputline}>
                        <Text style={pdfstyles.texts}>
                            Total Meters &emsp; : &emsp; {data.totalMeters}
                        </Text>
                    </View>
                </View>
                <View style={pdfstyles.inputbox}>
                    <View style={pdfstyles.tablerow}>
                        <Text style={pdfstyles.texts} >Sr no</Text>
                        <Text style={pdfstyles.texts}>Meters</Text>
                    </View>
                    {data.selectedTaka.map((item, index) => {
                    return (
                        <View style={pdfstyles.tablerow}>
                            <Text style={pdfstyles.texts}>{index+1}</Text>
                            <Text style={pdfstyles.texts}>{item.meters}</Text>
                        </View>
                    );
                })}
                </View>
            </PdfFormat>
        </PDFViewer>
    );
}

export default dummypdf;
