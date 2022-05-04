import {
    StyleSheet,
} from "@react-pdf/renderer";

export const Pdfstyles = StyleSheet.create({
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
    tablerow:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
    }
});
