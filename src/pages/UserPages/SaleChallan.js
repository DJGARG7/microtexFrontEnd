import { useState, useEffect } from "react";
import Axios from "axios";
import {
    toastError,
    toastSuccess,
} from "../../components/Reuse_components/toast";
import CurrentDate from "../../components/Reuse_components/CurrentDate";
import StickyTable from "../../components/Reuse_components/Table/StickyTable";
import ReactLoading from "react-loading";

import styles from "./Mill/styles/Mill.module.css";

const currDate = CurrentDate();

export default function SaleChallan({ userDetails }) {
    const TableColData = [
        {
            Header: "Action",
            Cell: (tableProps) => (
                <button
                    type="button"
                    onClick={() => rowDeleteHandler(tableProps)}
                    className={`${styles["form--btn"]} ${styles["form--del-btn"]}`}
                    style={{
                        cursor: "pointer",
                        height: "auto",
                        padding: "2.5 0",
                        margin: "0",
                        fontSize: "0.9rem",
                        textTransform: "uppercase",
                        fontWeight: "600",
                    }}
                >
                    Delete
                </button>
            ),
            width: 100,
        },
        {
            Header: "Design",
            accessor: "DName",
            Filter: "",
        },
        {
            Header: "Cloth Type",
            accessor: "clothType",
            Filter: "",
        },
        {
            Header: "Rate",
            accessor: "rate",
            Filter: "",
        },
        {
            Header: "Quantity",
            accessor: "quantity",
            Filter: "",
        },
    ];

    const rowDeleteHandler = (tableData) => {
        const copyData = [...tableData.data];
        copyData.splice(tableData.row.index, 1);
        setItemList(copyData);
    };

    //for items in table
    const [itemList, setItemList] = useState([]);

    const [challan, setChallan] = useState("");
    const [custName, setCustName] = useState("");
    const [SCdate, setSCDate] = useState(currDate);

    const [DName, setDName] = useState("none");
    const [clothType, setClothType] = useState("none");
    const [rate, setRate] = useState("");
    const [quantity, setQuantity] = useState("");

    // list of sundry debtors
    const [sdlist, setSdlist] = useState([]);
    const [DNamelist, setDNamelist] = useState([]);
    const [clothlist, setClothlist] = useState([]);
    const type = "Sundry Debtors";

    const [isAllowed, setIsAllowed] = useState(false);
    const [isAllowedLoading, setIsAllowedLoading] = useState(true);
    const [isAccountsLoading, setIsAccountsLoading] = useState(true);
    const [isDesignsLoading, setIsDesignsLoading] = useState(true);

    const checkPermission = async () => {
        try {
            const res = await Axios.get(
                `http://localhost:3002/permissions/${userDetails.uuid}/5`
            );

            setIsAllowed(res.data);
            setIsAllowedLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

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

    const fetchDesigns = async () => {
        try {
            const res1 = await Axios.get(
                "http://localhost:3004/designMaster/nameAndType"
            );
            setDNamelist(res1.data[0]);
            setClothlist(res1.data[1]);
            setIsDesignsLoading(false);
        } catch (e) {
            toastError("Failed to fetch designs");
        }
    };

    useEffect(async () => {
        checkPermission();
        fetchAccounts();
        fetchDesigns();
    }, []);

    const addItemHandler = () => {
        try {
            if (DName === "none") {
                throw "Select Design Name";
            } else if (clothType === "none") {
                throw "Select Cloth Type";
            } else if (rate <= 0 || quantity <= 0) {
                throw "Enter valid rate/quantity";
            }
            setItemList([
                ...itemList,
                {
                    DName: DName,
                    clothType: clothType,
                    rate: rate,
                    quantity: quantity,
                },
            ]);
            setDName("none");
            setClothType("none");
            setRate("");
            setQuantity("");
        } catch (message) {
            toastError(message);
        }
    };

    const deleteItemHandler = () => {};

    //insert into db
    const submitHandler = async (e) => {
        e.preventDefault();
        const data = [challan, custName, SCdate, itemList];
        try {
            const res = await Axios.post("http://localhost:3005/sales/", data);
            if (res.data != 1) throw res.data;
            console.log("data added to db");
            toastSuccess("Challan Added");
            setChallan("");
            setCustName("");
            setItemList([]);
        } catch (error) {
            console.log(error);
            toastError("Addition failed!");
        }
    };

    if (isAllowedLoading || isDesignsLoading || isAccountsLoading) {
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
            <h2>Sale Challan</h2>
            <form onSubmit={submitHandler} className={styles["form"]}>
                <div className={styles["form--group"]}>
                    <div
                        className={styles["form--group"]}
                        style={{ width: "auto", margin: "0" }}
                    >
                        <input
                            type="number"
                            name="challan"
                            value={challan}
                            placeholder="Challan Number"
                            onChange={(e) => setChallan(e.target.value)}
                            // disabled={!isEntering}
                            className={styles["form--input"]}
                            style={{
                                width: "10vw",
                                minWidth: "150px",
                                marginRight: "15px",
                            }}
                            required
                        />

                        <input
                            type="text"
                            name="SCdate"
                            value={SCdate}
                            onChange={(e) => setSCDate(e.target.value)}
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => (e.target.type = "text")}
                            placeholder="Challan Date"
                            // disabled={!isEntering}
                            className={styles["form--input"]}
                            style={{ width: "150px", minWidth: "150px" }}
                            required
                        />
                    </div>

                    <select
                        name="custName"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        required
                        // disabled={!isEntering}
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "20%",
                            minWidth: "200px",
                            margin: "10px 15px 10px 15px",
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

                    <select
                        name="DName"
                        value={DName}
                        onChange={(e) => setDName(e.target.value)}
                        // disabled={!isEntering}
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "20%",
                            minWidth: "200px",
                            margin: "10px 15px 10px 15px",
                        }}
                    >
                        <option value="none" disabled hidden>
                            Select design...
                        </option>
                        {DNamelist.map((DName) => {
                            return (
                                <option value={DName.name} key={DName.name}>
                                    {DName.name}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div
                    className={styles["form--group"]}
                    style={{ justifyContent: "space-around" }}
                >
                    <select
                        name="clothType"
                        value={clothType}
                        onChange={(e) => setClothType(e.target.value)}
                        // disabled={!isEntering}
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "20%",
                            minWidth: "200px",
                            margin: "10px 15px 10px 15px",
                        }}
                    >
                        <option value="none" disabled hidden>
                            Select cloth type...
                        </option>
                        {clothlist.map((cloth) => {
                            return (
                                <option
                                    value={cloth.cloth_Type}
                                    key={cloth.cloth_Type}
                                >
                                    {cloth.cloth_Type}
                                </option>
                            );
                        })}
                    </select>

                    <input
                        type="number"
                        name="rate"
                        value={rate}
                        placeholder="Rate"
                        onChange={(e) => setRate(e.target.value)}
                        // disabled={!isEntering}
                        className={styles["form--input"]}
                        style={{
                            width: "10vw",
                            minWidth: "150px",
                            marginRight: "15px",
                        }}
                    />

                    <input
                        type="number"
                        name="quantity"
                        value={quantity}
                        placeholder="Quantity"
                        onChange={(e) => setQuantity(e.target.value)}
                        // disabled={!isEntering}
                        className={styles["form--input"]}
                        style={{
                            width: "10vw",
                            minWidth: "150px",
                            marginRight: "15px",
                        }}
                    />

                    <button
                        type="button"
                        onClick={addItemHandler}
                        className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                        style={{ width: "100px" }}
                    >
                        Add item
                    </button>
                </div>

                <div
                    className={styles["form--table"]}
                    style={{ marginBottom: "40px" }}
                >
                    <StickyTable
                        TableCol={TableColData}
                        TableData={itemList}
                    ></StickyTable>
                </div>

                <button
                    className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                    style={{ width: "125px", alignSelf: "center" }}
                >
                    Add Challan
                </button>
            </form>
        </div>
    );
}
