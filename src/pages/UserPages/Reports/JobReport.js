import React, { useEffect, useState } from "react";
import styles from "../../../styles/jobreport.module.css";
import styles2 from "../Mill/styles/Mill.module.css";
import StickyTable from "../../../components/Reuse_components/Table/StickyTable";
import Axios from "axios";
import ReactLoading from "react-loading";

Axios.defaults.withCredentials = true;
Axios.defaults.headers.common["userID"] = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails")).userID
    : "";

const reports = Axios.create({
    baseURL: "http://localhost:3005/reports/",
});

function JobReport() {
    const sentItemCol = [
        {
            Header: "Challan No.",
            accessor: "challanNo",
            Filter: "",
        },
        {
            Header: "Account",
            accessor: "AccName",
            Filter: "",
        },
        {
            Header: "Challan Date",
            accessor: "challanDate",
            Filter: "",
        },
        {
            Header: "Item Name",
            accessor: "itemName",
            Filter: "",
        },
        {
            Header: "Total Pieces",
            accessor: "pieces",
            Filter: "",
        },
    ];

    const receiveItemcol = [
        {
            Header: "Challan No.",
            accessor: "challanNo",
            Filter: "",
        },
        {
            Header: "Account",
            accessor: "AccName",
            Filter: "",
        },
        {
            Header: "Sent Date",
            accessor: "challanDate",
            Filter: "",
        },
        {
            Header: "Received Date",
            accessor: "receiveDate",
            Filter: "",
        },
        {
            Header: "Item Name",
            accessor: "itemName",
            Filter: "",
        },
        {
            Header: "Total Pieces",
            accessor: "pieces",
            Filter: "",
        },
    ];

    const rowDisplayHandler = (cellData) => {
        if (cellData.row.values[cellData.column.id] == 1) {
            return <>Done</>;
        } else {
            return <>---</>;
        }
    };

    const godownstockcol = [
        {
            Header: "Inventory ID",
            accessor: "InventoryID",
            Filter: "",
        },
        {
            Header: "Pieces",
            accessor: "pieces",
            Filter: "",
        },
        {
            Header: "Embroidery",
            Cell: (tableProps) => {
                return rowDisplayHandler(tableProps);
            },
            accessor: "Embroidery",
            Filter: "",
        },
        {
            Header: "Stone",
            Cell: (tableProps) => {
                return rowDisplayHandler(tableProps);
            },
            accessor: "Stone",
            Filter: "",
        },
        {
            Header: "Lace",
            Cell: (tableProps) => {
                return rowDisplayHandler(tableProps);
            },
            accessor: "Lace",
            Filter: "",
        },
    ];

    const [itemsentlist, setitemsentlist] = useState([]);
    const [itemreceivedlist, setitemreceivedlist] = useState([]);
    const [godownstock, setgodownstock] = useState([]);
    const [itemlist, setitemlist] = useState([]);

    const [isLoadingItems, setIsLoadingItems] = useState(true);

    const getSentItemList = async (jobtype) => {
        try {
            const res = await reports.get(`/getitemsent/${jobtype}`);
            // console.log(res.data);
            res.data.forEach((data, index) => {
                const date = new Date(data.challanDate);
                data.challanDate = date.toLocaleDateString("en-GB");
            });
            setitemsentlist(res.data);
        } catch (e) {
            console.log(e);
        }
    };

    const getitemreceived = async (jobtype) => {
        try {
            const res = await reports.get(`/getitemreceived/${jobtype}`);
            console.log(res.data);
            res.data.forEach((data, index) => {
                const date = new Date(data.challanDate);
                const date2 = new Date(data.receiveDate);
                data.challanDate = date.toLocaleDateString("en-GB");
                data.receiveDate = date2.toLocaleDateString("en-GB");
            });
            setitemreceivedlist(res.data);
        } catch (e) {
            console.log(e);
        }
    };

    const getgodownstock = async (itemname) => {
        try {
            const res = await reports.get(`/getgodownitem/${itemname}`);
            setgodownstock(res.data);
            console.log(res.data);
        } catch (e) {
            console.log(e);
        }
    };

    const getitemlist = async () => {
        try {
            const res = await reports.get("/getitemlist");
            setitemlist(res.data);
            setIsLoadingItems(false);
        } catch (e) {
            console.log(e);
        }
    };

    const onChangeJobType = (e) => {
        getSentItemList(e.target.value);
    };

    const onChangeItemlist = (e) => {
        getgodownstock(e.target.value);
    };

    useEffect(() => {
        getitemlist();
        setIsLoadingItems(false);
    }, []);

    if (isLoadingItems) {
        return (
            <div
                style={{
                    marginTop: "10vh",
                }}
            >
                <ReactLoading type="bubbles" color="#212121" />
            </div>
        );
    }

    return (
        <div className={styles2["main"]}>
            <h2>Job Report</h2>
            <br />
            <div className={styles["row"]}>
                <div className={styles["question"]}>
                    1. Show &nbsp;
                    <select
                        onChange={onChangeItemlist}
                        className={`${styles2["form--input"]} ${styles2["form--input-select"]}`}
                        style={{
                            height: "30px",
                            width: "auto",
                            minWidth: "200px",
                            margin: "0 5px",
                        }}
                    >
                        <option value="NaN">Select Item Name</option>
                        {itemlist.map((item, key) => {
                            return (
                                <option key={key} value={item.itemName}>
                                    {item.itemName}
                                </option>
                            );
                        })}
                    </select>
                    &nbsp; present in godown
                </div>
                <div
                    className={styles2["form--table"]}
                    style={{ alignItems: "flex-start" }}
                >
                    <StickyTable
                        TableCol={godownstockcol}
                        TableData={godownstock}
                        style={{ width: "752px" }}
                    />
                </div>
            </div>
            <br />
            <div className={styles["row"]}>
                <div className={styles["question"]}>
                    2. Show items sent to &nbsp;
                    <select
                        onChange={onChangeJobType}
                        className={`${styles2["form--input"]} ${styles2["form--input-select"]}`}
                        style={{
                            height: "30px",
                            width: "auto",
                            minWidth: "200px",
                            margin: "0 5px",
                        }}
                    >
                        <option value="NaN">Select Work type</option>
                        <option value="Embroidery">Embroidery</option>
                        <option value="Stone">Stone Work</option>
                        <option value="Lace">Lace Work</option>
                    </select>
                </div>
                <div
                    className={styles2["form--table"]}
                    style={{ alignItems: "flex-start" }}
                >
                    <StickyTable
                        TableCol={sentItemCol}
                        TableData={itemsentlist}
                        style={{ width: "752px" }}
                    />
                </div>
            </div>
            <br />
            <div className={styles["row"]}>
                <div className={styles["question"]}>
                    3. Show items received from &nbsp;
                    <select
                        onChange={(e) => getitemreceived(e.target.value)}
                        className={`${styles2["form--input"]} ${styles2["form--input-select"]}`}
                        style={{
                            height: "30px",
                            width: "auto",
                            minWidth: "200px",
                            margin: "0 5px",
                        }}
                    >
                        <option value="NaN">Select Work type</option>
                        <option value="Embroidery">Embroidery</option>
                        <option value="Stone">Stone Work</option>
                        <option value="Lace">Lace Work</option>
                    </select>
                </div>
                <div
                    className={styles2["form--table"]}
                    style={{ alignItems: "flex-start" }}
                >
                    <StickyTable
                        TableCol={receiveItemcol}
                        TableData={itemreceivedlist}
                        style={{ width: "902px" }}
                    />
                </div>
            </div>
        </div>
    );
}

export default JobReport;
