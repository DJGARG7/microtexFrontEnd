import StickyTable from "../../components/Reuse_components/Table/StickyTable";
import Axios from "axios";
import { useState, useEffect } from "react";
import {
    toastError,
    toastSuccess,
} from "../../components/Reuse_components/toast";
import "./temp.css";
import Modal from "../../components/Reuse_components/Modal";
import SaleBillModal from "../../components/User_components/sales/SaleBillModal";
function SaleBilling({ userDetails }) {
    const [total, setTotal] = useState(0);
    const [salesList, setSalesList] = useState([]);
    const [salesDetailList, setSalesDetailList] = useState([]);
    const [billInfo, setBillInfo] = useState({});
    const [isOpen, setIsOpen] = useState(false);
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
    }, [isOpen]);
    const TableColData = [
        {
            Header: "Action",
            Cell: (tableProps) => (
                <div>
                    <button onClick={() => salesShowHandler(tableProps.row)}>
                        Show
                    </button>
                    <button>Delete</button>
                    <button onClick={() => salesBillHandler(tableProps.row)}>
                        Bill
                    </button>
                </div>
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
            console.log("here")
            toastSuccess("Bill Transacted");
            setIsOpen(false);
            setSalesDetailList([]);
        } catch (error) {
            toastError("Transaction Failed");
        }
    };
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

export default SaleBilling;
