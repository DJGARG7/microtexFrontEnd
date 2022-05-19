import { useState, useEffect } from "react";
import Axios from "axios";
import {
    toastError,
    toastSuccess,
} from "../../../components/Reuse_components/toast";
import StickyTable from "../../../components/Reuse_components/Table/StickyTable";

import ReactLoading from "react-loading";

import styles from "../Mill/styles/Mill.module.css";

function convertDate(inputFormat) {
    function pad(s) {
        return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
}

export default function SaleChallan({ userDetails }) {
    const [qtyHandle, setQtyHandle] = useState({});
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
        qtyHandle[tableData.row.values.clothType] =
            parseInt(qtyHandle[tableData.row.values.clothType]) -
            parseInt(tableData.row.values.quantity);
        copyData.splice(tableData.row.index, 1);
        setItemList(copyData);
    };

    //for items in table
    const [itemList, setItemList] = useState([]);

    const [challan, setChallan] = useState("");
    const [custName, setCustName] = useState("");
    const [SCdate, setSCDate] = useState(convertDate(new Date()));

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

    //stock data useStates
    const [qty, setQty] = useState(0);
    const [estimate, setEstimate] = useState(0);
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
            setDNamelist(res1.data);

            // setClothlist(res1.data[1]);
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
    useEffect(async () => {
        setClothType("none");
        if (DName !== "none") {
            try {
                const res = await Axios.get(
                    `http://localhost:3004/designMaster/Type/${DName}`
                );
                console.log("running");
                setClothlist(res.data);
            } catch (e) {}
        }
    }, [DName]);
    useEffect(async () => {
        if (clothType !== "none") {
            try {
                const res = await Axios.get(
                    `http://localhost:3004/designMaster/quantity/${clothType}`
                );
                console.log(res.data[0]);
                console.log(parseInt(qtyHandle[clothType]));
                if (clothType in qtyHandle) {
                    setQty(
                        parseInt(res.data[0].qty) -
                            parseInt(qtyHandle[clothType])
                    );
                } else {
                    setQty(parseInt(res.data[0].qty));
                }

                setEstimate(res.data[0].CALC_PRICE);
            } catch (e) {
                toastError("cannot fetch quantity");
            }
        } else {
            setQty(0);
            setEstimate(0);
        }
    }, [clothType]);
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
            if (clothType in qtyHandle) {
                qtyHandle[clothType] =
                    parseInt(qtyHandle[clothType]) + parseInt(quantity);
            } else {
                qtyHandle[clothType] = parseInt(quantity);
            }
            console.log(qtyHandle);
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
        } catch (error) {
            console.log(error);
            toastError("Addition failed!");
        }
        setChallan("");
        setCustName("");
        setItemList([]);
        setQtyHandle({});
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

                    <select
                        name="DName"
                        value={DName}
                        onChange={(e) => setDName(e.target.value)}
                        // disabled={!isEntering}
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "20%",
                            minWidth: "200px",
                            margin: "10px 0",
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

                <div className={styles["form--group"]}>
                    <select
                        name="clothType"
                        value={clothType}
                        onChange={(e) => setClothType(e.target.value)}
                        // disabled={!isEntering}
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "20%",
                            minWidth: "200px",
                            margin: "10px 0",
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
                        }}
                        disabled={clothType == "none"}
                    />

                    <button
                        type="button"
                        onClick={addItemHandler}
                        className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                        style={{ width: "100px" }}
                        disabled={quantity <= 0 || quantity > qty}
                    >
                        Add item
                    </button>
                </div>

                <div
                    className={styles["form--group"]}
                    style={{
                        width: "auto",
                        margin: "0",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <p>Available Pieces: {qty}</p>
                    <p>Estimated Price: {estimate}</p>
                </div>

                <div
                    className={styles["form--table"]}
                    style={{ marginBottom: "40px" }}
                >
                    <StickyTable TableCol={TableColData} TableData={itemList} />
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
