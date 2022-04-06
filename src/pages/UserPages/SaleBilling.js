import StickyTable from "../../components/Reuse_components/Table/StickyTable";
import Axios from "axios";
import { useState, useEffect } from "react";
import {
    toastError,
    toastSuccess,
} from "../../components/Reuse_components/toast";
import "./temp.css";

function SaleBilling({ userDetails }) {
    const [salesList, setSalesList] = useState([]);
    const [salesDetailList, setSalesDetailList] = useState([]);

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

    useEffect(async () => {
        checkPermission();
        try {
            const res = await Axios.get(
                `http://localhost:3005/sales/sales_order`
            );
            setSalesList(res.data);
        } catch (e) {
            toastError("Error loading sales data");
        }
    }, []);
    const TableColData = [
        {
            Header: "Action",
            Cell: (tableProps) => (
                <button onClick={() => salesShowHandler(tableProps.row)}>
                    Show
                </button>
            ),
        },
        {
            Header: "Challan No.",
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
    const TableColData1 = [
        {
            Header: "Design Name",
            accessor: "NAME",
            Filter: "",
        },
        {
            Header: "Rate",
            accessor: "RATE",
            Filter: "",
        },
        {
            Header: "Quantity",
            accessor: "QTY",
            Filter: "",
        },
    ];
    const salesShowHandler = async (currRow) => {
        const res = await Axios.get(
            `http://localhost:3005/sales/sales_detail/${currRow.values.BILL_NO}`
        );
        console.log(res.data);
        setSalesDetailList(res.data);
    };

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
        <div className="sales_main">
            <div className="sales_inside">
                <StickyTable
                    TableCol={TableColData}
                    TableData={salesList}
                ></StickyTable>
            </div>
            <div className="sales_inside">
                <h2>Sale Billing</h2>Here pending sale challans will be
                displayed. Either bill it or delete it.
                <StickyTable
                    TableCol={TableColData1}
                    TableData={salesDetailList}
                ></StickyTable>
            </div>
        </div>
    );
}

export default SaleBilling;
