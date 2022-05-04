import {
    PDFViewer,
    View,
    Text,
} from "@react-pdf/renderer";
import PdfFormat from "../../../components/Reuse_components/pdfgenerator/PdfFormat";
import { Pdfstyles as pdfstyles } from "../../../components/Reuse_components/pdfgenerator/Pdfstyles";

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
