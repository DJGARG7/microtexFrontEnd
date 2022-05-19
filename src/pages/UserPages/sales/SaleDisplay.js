import React, { useEffect, useState } from "react";
import Axios from "axios";
import {
    toastError,
    toastSuccess,
} from "../../../components/Reuse_components/toast";
import StickyTable from "../../../components/Reuse_components/Table/StickyTable";
import styles from "../Mill/styles/Mill.module.css";
import ReactLoading from "react-loading";

function SaleDisplay({ userDetails }) {
    //permission code
    const [isAllowed, setIsAllowed] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const checkPermission = async () => {
        try {
            const res = await Axios.get(
                `http://localhost:3002/permissions/${userDetails.uuid}/7`
            );

            setIsAllowed(res.data);
            setIsDataLoading(false);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkPermission();
    }, []);
    //permission code ends

    const [status, setStatus] = useState(0);
    const [salesList, setSalesList] = useState([]);

    useEffect(async () => {
        try {
            const res = await Axios.get(
                `http://localhost:3005/sales/sales_order/${status}`
            );
            if (res.data.length == 0) {
                toastSuccess(`No data!`);
            }
            setSalesList(res.data);
        } catch (e) {
            toastError("Error loading sales data");
        }
    }, [status]);

    const TableColData = [
        {
            Header: "Bill No.",
            accessor: "BILL_NO",
            Filter: "",
        },
        {
            Header: "Customer",
            accessor: "CNAME",
            Filter: "",
        },
        {
            Header: "Date",
            accessor: "ORDER_DATE",
            Filter: "",
        },
    ];

    // const [salesDetailList, setSalesDetailList] = useState([]);

    if (isDataLoading) {
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

    if (!isAllowed) {
        return (
            <div
                style={{
                    marginTop: "10vh",
                }}
            >
                <strong>You are not allowed access to this area.</strong>
            </div>
        );
    }

    return (
        <div className={styles["main"]}>
            <h2>Display Bills</h2>
            <select
                // className={styles["input-select"]}
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                // disabled={!isEntering}
                className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                style={{
                    width: "20%",
                    minWidth: "200px",
                    margin: "10px 0",
                    alignSelf: "center",
                }}
            >
                <option value={0}>Pending Challan</option>
                <option value={1}>Unpaid Bills</option>
                <option value={2}>Paid Bills</option>
            </select>
            <div className={styles["form--table"]}>
                <StickyTable TableCol={TableColData} TableData={salesList} />
            </div>
        </div>
    );
}

export default SaleDisplay;
