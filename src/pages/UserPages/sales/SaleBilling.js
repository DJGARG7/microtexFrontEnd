import StickyTable from "../../../components/Reuse_components/Table/StickyTable";
import Axios from "axios";
import { useState, useEffect } from "react";
import {
    toastError,
    toastSuccess,
} from "../../../components/Reuse_components/toast";
import "./temp.css";
import Modal from "../../../components/Reuse_components/Modal";
import SaleBillModal from "../../../components/User_components/sales/SaleBillModal";

import ReactLoading from "react-loading";

import styles from "../Mill/styles/Mill.module.css";

export default function SaleBilling({ userDetails }) {
    const [total, setTotal] = useState(0);
    const [salesList, setSalesList] = useState([]);
    const [salesDetailList, setSalesDetailList] = useState([]);
    const [billInfo, setBillInfo] = useState({});
    const [isOpen, setIsOpen] = useState(false);

    const [isAllowed, setIsAllowed] = useState(false);
    const [isAllowedLoading, setIsAllowedLoading] = useState(true);
    const [isSalesLoading, setIsSalesLoading] = useState(true);

    const checkPermission = async () => {
        try {
            const res = await Axios.get(
                `http://localhost:3002/permissions/${userDetails.uuid}/7`
            );

            setIsAllowed(res.data);
            setIsAllowedLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSalesOrder = async () => {
        try {
            const res = await Axios.get(
                `http://localhost:3005/sales/sales_order/0`
            );
            if(res.data.length == 0){
                toastSuccess("No pending challans")
            }
            setSalesList(res.data);
            setIsSalesLoading(false);
        } catch (e) {
            toastError("Failed to fetch sales data");
        }
    };

    useEffect(() => {
        checkPermission();
        fetchSalesOrder();
    }, [isOpen]);

    const TableColData = [
        {
            Header: "Action",
            Cell: (tableProps) => (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <button
                        onClick={() => salesShowHandler(tableProps.row)}
                        className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                        style={{
                            cursor: "pointer",
                            height: "auto",
                            padding: "2.5px 0",
                            margin: "2.5px 0",
                            fontSize: "0.9rem",
                            textTransform: "uppercase",
                            fontWeight: "600",
                        }}
                    >
                        Show
                    </button>
                    <button
                        className={`${styles["form--btn"]} ${styles["form--del-btn"]}`}
                        style={{
                            cursor: "pointer",
                            height: "auto",
                            padding: "2.5px 0",
                            margin: "2.5px 0",
                            fontSize: "0.9rem",
                            textTransform: "uppercase",
                            fontWeight: "600",
                        }}
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => salesBillHandler(tableProps.row)}
                        className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                        style={{
                            cursor: "pointer",
                            height: "auto",
                            padding: "2.5px 0",
                            margin: "2.5px 0",
                            fontSize: "0.9rem",
                            textTransform: "uppercase",
                            fontWeight: "600",
                        }}
                    >
                        Bill
                    </button>
                </div>
            ),
            width: 100,
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
            Header: "Design",
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
        {
            Header: "Amount",
            accessor: "amount",
            Filter: "",
        },
    ];

    const salesShowHandler = async (currRow) => {
        var tot = 0;
        const res = await Axios.get(
            `http://localhost:3005/sales/sales_detail/${currRow.values.BILL_NO}`
        );
        res.data.map((row) => {
            row.amount = row.RATE * row.QTY;
            tot += row.amount;
        });
        setTotal(tot);
        setSalesDetailList(res.data);
    };

    const salesBillHandler = (currRow) => {
        setBillInfo(currRow.values);
        salesShowHandler(currRow);
        setIsOpen(true);
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

    const makeBill = async () => {
        console.log("make bill runing");
        const transactData = {
            date: billInfo.ORDER_DATE.slice(0, 10),
            uid: billInfo.CNAME,
            accType: "Sundry Debtors",
            amt: total,
            CrDr: "Dr",
            billno: billInfo.BILL_NO,
            remark: "cloth sale",
        };
        console.log(transactData);
        try {
            const res = await Axios.post(
                "http://localhost:3005/sales/transact",
                transactData
            );
            console.log("here");
            toastSuccess("Bill Transacted");
            setIsOpen(false);
            setSalesDetailList([]);
        } catch (error) {
            toastError("Transaction Failed");
        }
    };

    if (isAllowedLoading || isSalesLoading) {
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
            <h2>Sale Billing</h2>

            <div style={{ display: "flex", marginTop: "2.5vh" }}>
                <div className={styles["form--table"]}>
                    <StickyTable
                        TableCol={TableColData}
                        TableData={salesList}
                    ></StickyTable>
                </div>

                <div className={styles["form--table"]}>
                    <StickyTable
                        TableCol={TableColData1}
                        TableData={salesDetailList}
                    ></StickyTable>
                </div>
            </div>

            <Modal
                open={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setSalesDetailList([]);
                }}
            >
                <SaleBillModal
                    billData={{
                        info: billInfo,
                        detail: salesDetailList,
                        colHead: TableColData1,
                        total: total,
                    }}
                    makeBill={makeBill}
                />
            </Modal>
        </div>
    );
}
