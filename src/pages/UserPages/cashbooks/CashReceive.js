import { useState, useEffect } from "react";
import Axios from "axios";
import {
    toastError,
    toastSuccess,
} from "../../../components/Reuse_components/toast";
import styles from "../Mill/styles/Mill.module.css";
import StickyTable from "../../../components/Reuse_components/Table/StickyTable";
import CurrentDate from "../../../components/Reuse_components/CurrentDate";
import ReactLoading from "react-loading";

const CashReceive = () => {
    const [sdlist, setSdlist] = useState([]);
    const [custName, setCustName] = useState("");
    const [drBillsList, setDrBillsList] = useState([]);
    const [total, setTotal] = useState(0);
    const type = "Sundry Debtors";
    const [checkedList, setCheckedList] = useState({});
    const [selectedAmt, setSelectedAmt] = useState({});
    const [billsString, setBillsString] = useState("");

    const [isAccountsLoading, setIsAccountsLoading] = useState(true);

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
            Header: "Bill no",
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
            setIsAccountsLoading(false);
        } catch (e) {
            toastError("Error fetching SD data");
        }
    };

    const showUnpaidBillHandler = async () => {
        console.log("running");
        try {
            const res = await Axios.get(
                `http://localhost:3007/transaction/drBills/${custName}`
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
        fetchAccounts();
    }, []);

    useEffect(() => {
        if (custName !== "") {
            showUnpaidBillHandler();
        }
    }, [custName]);

    const recordCashHandler = async () => {
        const data = {
            date: CurrentDate(),
            uid: custName,
            accType: type,
            amt: total,
            CrDr: "Cr",
            billno: "-1",
            remark: billsString,
        };
        try {
            const res = await Axios.post(
                `http://localhost:3005/cashbook/receive`,
                data
            );
            toastSuccess("Successful Transaction");
        } catch (e) {
            toastError("Transaction Failed. Try again");
        }
        setCustName("");
        setDrBillsList([]);
        setTotal(0);
    };

    if (isAccountsLoading) {
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
        <div className={styles["main"]}>
            <h2>Receive Payment</h2>
            <form className={styles["form"]}>
                <div
                    className={styles["form--group"]}
                    style={{ justifyContent: "center" }}
                >
                    <select
                        name="custName"
                        value={custName}
                        onChange={(e) => {
                            setCustName(e.target.value);
                        }}
                        required
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "20%",
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
export default CashReceive;
