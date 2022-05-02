import {
    PDFViewer,
    View,
    Text,
    StyleSheet,
} from "@react-pdf/renderer";
import PdfFormat from "../../../components/Reuse_components/pdfgenerator/PdfFormat";

const pdfstyles = StyleSheet.create({
    inputline: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: {
        fontSize: "20px",
        fontWeight: "bold",
    },
    heading: {
        padding: "10px",
        fontSize: "15px",
        textDecoration: "underline",
    },
    texts: {
        fontSize: "13px",
        padding: "2px",
    },
    inputbox: {
        border: "1px solid black",
        display: "flex",
        alignSelf: "center",
        padding: "8px",
        width: "90%",
        flexDirection: "column",
    },
});

function Sendjobpdf({challandetails,itemdetials,sendjobitemslist}) {
    return (

                <PDFViewer width={"700px"} height={"500px"}>
                    <PdfFormat>
                        <View style={{ alignItems: "center" }}>
                            <Text style={pdfstyles.heading}>
                                Job Send Challan
                            </Text>
                            <Text style={pdfstyles.title}>
                                Textile ERP Software
                            </Text>

                            <Text style={{ padding: "10px" }}>
                                {
                                    "-------------------------------------------------------------"
                                }
                            </Text>
                        </View>
                        <View style={pdfstyles.inputbox}>
                            <View style={pdfstyles.inputline}>
                                <Text style={pdfstyles.texts}>
                                    M/s &emsp; : &emsp;{" "}
                                    {challandetails.accntname}
                                </Text>
                                <Text style={pdfstyles.texts}>
                                    Challan No &emsp; : &emsp;{" "}
                                    {challandetails.challanNo}
                                </Text>
                            </View>
                            <View style={pdfstyles.inputline}>
                                <Text style={pdfstyles.texts}>
                                    Address &emsp; : &emsp;{" "}
                                    {challandetails.challanNo}
                                </Text>
                                <Text style={pdfstyles.texts}>
                                    Challan Date &emsp; : &emsp;
                                    {challandetails.challanDate}
                                </Text>
                            </View>
                            <View style={pdfstyles.inputline}>
                                <Text style={pdfstyles.texts}>
                                    Job Type &emsp; : &emsp;{" "}
                                    {challandetails.jobType}
                                </Text>
                            </View>
                        </View>
                        {sendjobitemslist.map((item, index) => {
                            return (
                                <View style={pdfstyles.inputbox}>
                                    <View style={pdfstyles.inputline}>
                                        <Text style={pdfstyles.texts}>
                                            Item Name &emsp; : &emsp;{" "}
                                            {item.ItemName}
                                        </Text>
                                        <Text style={pdfstyles.texts}>
                                            Pieces &emsp; : &emsp; {item.pieces}
                                        </Text>
                                    </View>
                                    <View style={pdfstyles.inputline}>
                                        <Text style={pdfstyles.texts}>
                                            Job Rate &emsp; : &emsp;{" "}
                                            {item.jobRate}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </PdfFormat>
                </PDFViewer>
    );
}

export default Sendjobpdf;
