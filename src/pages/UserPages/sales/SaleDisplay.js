import React, { useEffect, useState } from "react";
import Axios from "axios";
import {
    toastError,
    toastSuccess,
} from "../../../components/Reuse_components/toast";
import StickyTable from "../../../components/Reuse_components/Table/StickyTable";
function SaleDisplay({ userDetails }) {
    //permission code
    const [isAllowed, setIsAllowed] = useState(false);
    const checkPermission = async () => {
        try {
            const res = await Axios.get(
                `http://localhost:3002/permissions/${userDetails.uuid}/7`
            );

            setIsAllowed(res.data);
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
                toastSuccess("No data");
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
    return (
        <div>
            {!isAllowed && (
                <div
                    style={{
                        marginTop: "10vh",
                    }}
                >
                    <strong>You are not allowed access to this area.</strong>
                </div>
            )}
            {isAllowed && (
                <div>
                    <select
                        // className={styles["input-select"]}
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        // disabled={!isEntering}
                        style={{ marginLeft: "10%" }}
                    >
                        <option value={0}>Pending Challan</option>
                        <option value={1}>Unpaid Bills</option>
                        <option value={2}>Paid Bills</option>
                    </select>
                    <StickyTable
                        TableCol={TableColData}
                        TableData={salesList}
                    ></StickyTable>
                </div>
            )}
        </div>
    );

    return;
}

export default SaleDisplay;
