import { PDFViewer, View, Text } from "@react-pdf/renderer";
import PdfFormat from "../../Reuse_components/pdfgenerator/PdfFormat";
import { Pdfstyles as pdfstyles } from "../../Reuse_components/pdfgenerator/Pdfstyles";

const SaleBillPdf = ({ data }) => {
    console.log(data);
    return (
        <PDFViewer width={"700px"} height={"500px"}>
            <PdfFormat>
                <View style={{ alignItems: "center" }}>
                    <Text style={pdfstyles.heading}>Sale Bill</Text>
                    <Text style={pdfstyles.title}>firm 1</Text>

                    <Text style={{ padding: "10px" }}>
                        {
                            "-----------------------------------------------------------------------------------------------"
                        }
                    </Text>
                </View>
                <View style={pdfstyles.inputbox}>
                    <View style={pdfstyles.inputline}>
                        <Text style={pdfstyles.texts}>
                            M/s &emsp; : &emsp; {data.info.CNAME}
                        </Text>
                        <Text style={pdfstyles.texts}>
                            Bill No &emsp; : &emsp; {data.info.BILL_NO}
                        </Text>
                    </View>
                    <View style={pdfstyles.inputline}>
                        <Text style={pdfstyles.texts}>
                            Date &emsp; : &emsp;
                            {data.info.ORDER_DATE}
                        </Text>
                    </View>
                </View>
                <View style={pdfstyles.inputbox}>
                    <View style={pdfstyles.tablerow}>
                        <Text style={pdfstyles.texts}>Sr</Text>
                        <Text style={pdfstyles.texts}>Item</Text>
                        <Text style={pdfstyles.texts}>Rate</Text>
                        <Text style={pdfstyles.texts}>Qty</Text>
                        <Text style={pdfstyles.texts}>Amount</Text>
                    </View>
                    {data.detail.map((item, index) => {
                        return (
                            <View style={pdfstyles.tablerow}>
                                <Text style={pdfstyles.texts}>{index + 1}</Text>
                                <Text style={pdfstyles.texts}>{item.NAME}</Text>
                                <Text style={pdfstyles.texts}>{item.RATE}</Text>
                                <Text style={pdfstyles.texts}>{item.QTY}</Text>
                                <Text style={pdfstyles.texts}>
                                    {item.amount}
                                </Text>
                            </View>
                        );
                    })}
                </View>
                <Text style={pdfstyles.texts}>
                    Total &emsp; : &emsp;
                    {data.total}
                </Text>
            </PdfFormat>
        </PDFViewer>
    );
};

export default SaleBillPdf;
