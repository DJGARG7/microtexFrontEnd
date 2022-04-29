import { useState, useEffect } from "react";
import Axios from "axios";
import {
    toastError,
    toastSuccess,
} from "../../../components/Reuse_components/toast";
import styles from "../Mill/styles/Mill.module.css";
import StickyTable from "../../../components/Reuse_components/Table/StickyTable";
const CashReceive = () => {
    const TableColData = [
        {
            Header: "Action",
            Cell: (tableProps) => <p>tick</p>,
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
        },
    ];
    const [custName, setCustName] = useState("");
    const [sdlist, setSdlist] = useState([]);
    const [drBillsList, setDrBillsList] = useState([]);
    const type = "Sundry Debtors";
    const fetchAccounts = async () => {
        try {
            const res = await Axios.get(
                `http://localhost:3003/accountMaster/${type}`
            );
            setSdlist(res.data);
            // setIsAccountsLoading(false);
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
            setDrBillsList(res.data);
        } catch (e) {
            toastError("Error showing bills");
            setCustName("");
        }
    };
    useEffect(() => {
        fetchAccounts();
    }, []);
    useEffect(() => {
        if (custName !== "") {
            showUnpaidBillHandler();
        }
    }, [custName]);
    const recordCashHandler = () => {
        //send axios post request to 3005/cashbook/receive with body
    };
    return (
        <div>
            <form>
                <select
                    name="custName"
                    value={custName}
                    onChange={(e) => {
                        setCustName(e.target.value);
                    }}
                    required
                    // disabled={!isEntering}
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
            </form>
            <StickyTable TableCol={TableColData} TableData={drBillsList} />
            <p>Total Amount</p>
            <button type="button" onClick={recordCashHandler}>
                Record Cash Receive
            </button>
        </div>
    );
};

export default CashReceive;

// ask for account name with sundry debtors name ...check for pending bills for that....
//total the amount and record that cash payment
// update status =2 for the bills
