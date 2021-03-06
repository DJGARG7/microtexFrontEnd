import { useState, useEffect } from "react";
import Axios from "axios";
import {
    toastError,
    toastSuccess,
} from "../../../components/Reuse_components/toast";
import styles from "../Mill/styles/Mill.module.css";
import StickyTable from "../../../components/Reuse_components/Table/StickyTable";
import CurrentDate from "../../../components/Reuse_components/CurrentDate";

const CashPay = () => {
    //----
    const [type, setType] = useState("");
    //----
    const [sdlist, setSdlist] = useState([]);
    const [custName, setCustName] = useState("");
    const [drBillsList, setDrBillsList] = useState([]);
    const [total, setTotal] = useState(0);
    const [checkedList, setCheckedList] = useState({});
    const [selectedAmt, setSelectedAmt] = useState({});
    const [billsString, setBillsString] = useState("");

    useEffect(() => {
        setTotal(
            Object.values(selectedAmt).reduce(
                (sum, value) => sum + (value || 0),
                0
            )
        );
        setBillsString(
            Object.keys(checkedList)
                .filter((key) => {
                    return checkedList[key];
                })
                .toString()
        );
    }, [selectedAmt]);
    const checkboxHandler = (e, tableProps) => {
        console.log(e.target.checked);
        if (e.target.checked) {
            setCheckedList({
                ...checkedList,
                [parseInt(tableProps.row.values.billno)]: true,
            });
            setSelectedAmt({
                ...selectedAmt,
                [tableProps.row.values.billno]: tableProps.row.values.amount,
            });
        } else {
            setCheckedList({
                ...checkedList,
                [parseInt(tableProps.row.values.billno)]: false,
            });
            setSelectedAmt({
                ...selectedAmt,
                [tableProps.row.values.billno]: 0,
            });
        }
    };

    const TableColData = [
        {
            Header: "Action",
            Cell: (tableProps) => (
                <input
                    type="checkbox"
                    onChange={(e) => checkboxHandler(e, tableProps)}
                    checked={checkedList[tableProps.row.values.billno]}
                />
            ),
            width: 100,
        },
        {
            Header: "Bill no.",
            accessor: "billno",
            Filter: "",
        },
        {
            Header: "Amount",
            accessor: "amount",
            Filter: "",
        },
        {
            Header: "Sale Date",
            accessor: "t_date",
            Filter: "",
        },
        {
            Header: "transaction id",
            accessor: "t_id",
            Filter: "",
            width: 155,
        },
    ];

    const fetchAccounts = async () => {
        try {
            const res = await Axios.get(
                `http://localhost:3003/accountMaster/${type}`
            );
            setSdlist(res.data);
        } catch (e) {
            toastError("Error fetching account data");
        }
    };

    const showUnpaidBillHandler = async () => {
        console.log("running");
        try {
            const res = await Axios.get(
                `http://localhost:3007/transaction/crBills/${type}/${custName}`
            );
            if (res.data.length == 0) {
                toastSuccess("No unpaid bills for this account");
                setDrBillsList([]);
            } else {
                res.data.forEach((data, index) => {
                    const date = new Date(data.t_date);
                    data.t_date = date.toLocaleDateString("en-GB");
                });
                setDrBillsList(res.data);
            }
        } catch (e) {
            toastError("Error showing bills");
            setCustName("");
            setDrBillsList([]);
        }
        setCheckedList({});
        setTotal(0);
    };

    useEffect(() => {
        if (type !== "") {
            fetchAccounts();
            setCustName("");
            setDrBillsList([]);
        }
        // if (!type == "") fetchAccounts();
    }, [type]);
    useEffect(() => {
        if (custName !== "") {
            showUnpaidBillHandler();
        }
    }, [custName]);

    const recordCashHandler = async (e) => {
        e.preventDefault();
        const data = {
            date: CurrentDate(),
            uid: custName,
            accType: type,
            amt: total,
            CrDr: "Dr",
            billno: "-1",
            remark: billsString,
        };
        try {
            const res = await Axios.post(
                `http://localhost:3005/cashbook/payment`,
                data
            );
            toastSuccess("Transaction successfull!");
        } catch (e) {
            toastError("Transaction failed! Please try again");
        }
        setCustName("");
        setDrBillsList([]);
        setTotal(0);
    };

    return (
        <div className={styles["main"]}>
            <h2>Make Payment</h2>
            <form className={styles["form"]}>
                <div
                    className={styles["form--group"]}
                    style={{ justifyContent: "space-around" }}
                >
                    <select
                        name="type"
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value);
                        }}
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "22.5%",
                            minWidth: "200px",
                            margin: "10px 0",
                        }}
                    >
                        <option value="" disabled hidden>
                            Select Account Type
                        </option>
                        <option value="Sundry Creditors">
                            Sundry Creditors
                        </option>
                        <option value="Creditors For Job">
                            Creditors For Job
                        </option>
                        <option value="Creditors for process">
                            Creditors for process
                        </option>
                    </select>
                    <select
                        name="custName"
                        value={custName}
                        onChange={(e) => {
                            setCustName(e.target.value);
                        }}
                        required
                        disabled={type === ""}
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "22.5%",
                            minWidth: "200px",
                            margin: "10px 0",
                        }}
                    >
                        <option value="" disabled hidden>
                            Select customer...
                        </option>
                        {sdlist.map((sd) => {
                            return (
                                <option value={sd.uid} key={sd.uid}>
                                    {sd.AccName}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className={styles["form--table"]}>
                    <StickyTable
                        TableCol={TableColData}
                        TableData={drBillsList}
                    />
                </div>

                <div
                    className={styles["form--group"]}
                    style={{
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    <p>
                        <strong>Total Amount:</strong> {total}
                    </p>
                    <button
                        type="button"
                        onClick={recordCashHandler}
                        disabled={total == 0}
                        className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                        style={{ width: "175px" }}
                    >
                        Record Cash Receive
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CashPay;
