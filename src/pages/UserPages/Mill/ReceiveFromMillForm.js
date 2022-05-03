import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import StickyTable from "../../../components/Reuse_components/Table/StickyTable";
import styles from "./styles/Mill.module.css";

const toastStyle = {
    style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
    },
};

// Helper function to get the current date.
function convertDate(inputFormat) {
    function pad(s) {
        return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
}

export default function ReceiveFromMillForm({ itemData, millsData }) {
    // Table columns.
    const columns = useMemo(() => [
        {
            Header: "Challan No.",
            accessor: "challanNumber",
        },
        {
            Header: "Mill",
            accessor: "AccName",
            Filter: "",
        },
        {
            Header: "Item ID",
            accessor: "itemID",
            Filter: "",
            show: false,
        },
        {
            Header: "Send Date",
            accessor: "sentDate",
        },
        {
            Header: "Item",
            accessor: "itemName",
            Filter: "",
        },
        {
            Header: "Sent Taka",
            accessor: "sentTaka",
            Filter: "",
            width: 110,
        },
        {
            Header: "Sent Meters",
            accessor: "sentMeters",
            Filter: "",
            width: 135,
        },
        {
            Header: "Action",
            accessor: (str) => "ShowTaka",
            Cell: (tableProps) => (
                <div>
                    <button
                        className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                        style={{
                            cursor: "pointer",
                            height: "auto",
                            padding: "2.5px 5px",
                            margin: "0",
                            fontSize: "0.9rem",
                            textTransform: "uppercase",
                            fontWeight: "600",
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            setSelectedChallan(tableProps.row.original);
                        }}
                    >
                        Select
                    </button>
                </div>
            ),
            sticky: "right",
            Filter: "",
            width: 100,
        },
    ]);

    // Form-related data.
    const [challans, setChallans] = useState([]);

    // Form binding.
    const [receiveDate, setReceiveDate] = useState(convertDate(new Date()));
    const [selectedGrey, setSelectedGrey] = useState("DEFAULT");
    const [selectedMill, setSelectedMill] = useState("DEFAULT");
    const [selectedChallan, setSelectedChallan] = useState([]);
    const [receivedMeters, setReceivedMeters] = useState();
    const [millLoss, setMillLoss] = useState();
    const [pieceLoss, setPieceLoss] = useState();
    const [rate, setRate] = useState();
    const [amount, setAmount] = useState();

    // Fetch challan for mill & item from backend.
    const fetchChallan = async () => {
        if (selectedMill === "DEFAULT" || selectedGrey === "DEFAULT") return;

        let billsToast;

        try {
            billsToast = toast.loading("Fetching challan...", toastStyle);

            const res = await axios.get(
                `http://localhost:3005/mill/challan/${selectedMill}/${selectedGrey}`
            );

            // Converting date to DD/MM/YYYY format.
            res.data.forEach((challan) => {
                const date = new Date(challan.sentDate);
                challan.sentDate = date.toLocaleDateString("en-GB");
            });

            setChallans(res.data);

            toast.success("Challan fetched.", { id: billsToast });
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch challan.", toastStyle, {
                id: billsToast,
            });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        const submitToast = toast.loading("Receiving from mill...", toastStyle);

        try {
            const res = await axios.post(
                `http://localhost:3005/mill/receive/`,
                {
                    // For MILL_CHALLAN.
                    challanNumber: selectedChallan.challanNumber,
                    millID: selectedMill,
                    itemID: selectedChallan.itemID,
                    receiveDate,
                    amount,

                    // For MILL_CHALLAN_DETAILS.
                    receivedTaka: selectedChallan.sentTaka,
                    receivedMeters: parseInt(receivedMeters),
                    millLoss,
                    pieceLoss,
                    rate: parseFloat(rate),

                    // For INVENTORY.
                    itemName: itemData.filter(
                        (item) => item.itemID == selectedGrey
                    )[0].itemName,
                }
            );

            toast.success(res.data, { id: submitToast });

            // Refresh form.
            setReceiveDate(convertDate(new Date()));
            setSelectedGrey("DEFAULT");
            setSelectedMill("DEFAULT");
            setSelectedChallan([]);
            setReceivedMeters("");
            setMillLoss("");
            setPieceLoss("");
            setRate("");
            setAmount("");
        } catch (error) {
            console.log(error);
            toast.error(`${error.response.data}`, {
                id: submitToast,
            });
        }
    };

    useEffect(() => {
        fetchChallan();
    }, [selectedGrey, selectedMill]);

    useEffect(() => {
        // Mill loss.
        let tempLM =
            Math.round(
                (selectedChallan.sentMeters - receivedMeters + Number.EPSILON) *
                    100
            ) / 100;

        // Piece loss.
        let tempLP =
            Math.round(((receivedMeters % 10) + Number.EPSILON) * 100) / 100;

        if (tempLM < 0) {
            toast.error(
                `Please enter a value <= ${selectedChallan.sentMeters}.`,
                toastStyle
            );
            setReceivedMeters("");
        } else {
            setMillLoss(tempLM);
            setPieceLoss(tempLP);
        }
    }, [receivedMeters]);

    useEffect(() => {
        setAmount(
            Math.round(
                (parseFloat(rate) * receivedMeters + Number.EPSILON) * 100
            ) / 100
        );
    }, [rate]);

    return (
        <form onSubmit={submitHandler} className={styles["form"]}>
            {/* Row 1: Inputs. */}
            <div
                className={styles["form--group"]}
                style={{ justifyContent: "space-around" }}
            >
                {/* Column 1: selectedMill. */}
                <select
                    placeholder="Mill"
                    className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                    value={selectedMill}
                    onChange={(e) => {
                        setSelectedMill(e.target.value);
                    }}
                    style={{
                        width: "25%",
                        minWidth: "200px",
                        margin: "10px 0",
                    }}
                >
                    <option disabled hidden value="DEFAULT">
                        Select mill...
                    </option>
                    {millsData.map((mill) => {
                        return (
                            <option value={mill.uid} key={mill.AccName}>
                                {mill.AccName}
                            </option>
                        );
                    })}
                </select>

                {/* Column 2: selectedGrey. */}
                <select
                    placeholder="Grey cloth"
                    className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                    value={selectedGrey}
                    onChange={(e) => {
                        setSelectedGrey(e.target.value);
                    }}
                    style={{
                        width: "25%",
                        minWidth: "200px",
                        margin: "10px 0",
                    }}
                >
                    <option disabled hidden value="DEFAULT">
                        Select item...
                    </option>
                    {itemData.map((cloth) => {
                        return (
                            <option value={cloth.itemID} key={cloth.itemID}>
                                {cloth.itemName}
                            </option>
                        );
                    })}
                </select>

                {/* Column 3: receiveDate. */}
                <input
                    type="text"
                    onChange={(e) => setReceiveDate(e.target.value)}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                    value={receiveDate}
                    placeholder="Receive Date"
                    className={styles["form--input"]}
                    style={{ width: "150px", minWidth: "150px" }}
                    required
                />
            </div>

            {/* Row 2: Challan Table */}
            <div
                className={styles["form--table"]}
                // style={{ display: "none" }}
            >
                <StickyTable
                    TableCol={columns}
                    TableData={challans}
                    style={{
                        maxHeight: "38vh",
                        maxWidth: "70vw",
                        marginBottom: "15px",
                    }}
                />
            </div>

            {/* Row 3: Received information. */}
            <div
                className={styles["form--group"]}
                style={{
                    backgroundColor: "#dddddd",
                    borderRadius: "7.5px",
                    marginTop: "auto",
                    marginBottom: "0",
                    position: "sticky",
                    bottom: "0",
                }}
            >
                {/* Column 1: Sent information.  */}
                <div
                    className={styles["form--group"]}
                    style={{
                        width: "auto",
                        margin: "0",
                        alignItems: "center",
                    }}
                >
                    <label
                        htmlFor="sentMeters"
                        style={{ margin: "0 10px 0 10px" }}
                    >
                        Sent Meters
                    </label>
                    <input
                        type="number"
                        value={
                            typeof selectedChallan.sentMeters === "undefined"
                                ? ""
                                : selectedChallan.sentMeters
                        }
                        placeholder="0"
                        id="sentMeters"
                        readOnly
                        className={styles["form--input"]}
                        style={{ width: "5vw", minWidth: "70px" }}
                        disabled={
                            typeof selectedChallan.sentTaka === "undefined"
                                ? true
                                : false
                        }
                    />
                </div>

                {/* Column 2: Received information.  */}
                <div
                    className={styles["form--group"]}
                    style={{
                        width: "auto",
                        margin: "0",
                        alignItems: "center",
                    }}
                >
                    <label
                        htmlFor="receivedMeters"
                        style={{ margin: "0 10px 0 1vw" }}
                    >
                        Received Meters
                    </label>
                    <input
                        type="number"
                        value={receivedMeters}
                        id="receivedMeters"
                        placeholder="?"
                        onChange={(e) => {
                            setReceivedMeters(e.target.value);
                        }}
                        className={styles["form--input"]}
                        style={{
                            width: "5vw",
                            minWidth: "70px",
                        }}
                        disabled={
                            typeof selectedChallan.sentTaka === "undefined"
                                ? true
                                : false
                        }
                        required
                    />

                    <label
                        htmlFor="millLoss"
                        style={{ margin: "0 10px 0 1vw" }}
                    >
                        Mill Loss
                    </label>
                    <input
                        type="number"
                        value={millLoss}
                        id="millLoss"
                        placeholder="?"
                        onChange={(e) => setMillLoss(e.target.value)}
                        className={styles["form--input"]}
                        style={{ width: "5vw", minWidth: "70px" }}
                        disabled={
                            typeof selectedChallan.sentTaka === "undefined"
                                ? true
                                : false
                        }
                        step=".01"
                        readOnly
                        required
                    />

                    <label
                        htmlFor="pieceLoss"
                        style={{ margin: "0 10px 0 1vw" }}
                    >
                        Piece Loss
                    </label>
                    <input
                        type="number"
                        value={pieceLoss}
                        placeholder="?"
                        disabled={
                            typeof selectedChallan.sentTaka === "undefined"
                                ? true
                                : false
                        }
                        id="pieceLoss"
                        step=".01"
                        readOnly
                        className={styles["form--input"]}
                        style={{ width: "5vw", minWidth: "50px" }}
                    />
                </div>

                {/* Column 3: Rate & Amount.  */}
                <div
                    className={styles["form--group"]}
                    style={{
                        width: "auto",
                        margin: "0",
                        alignItems: "center",
                    }}
                >
                    <label htmlFor="rate" style={{ margin: "0 10px 0 1vw" }}>
                        Rate
                    </label>
                    <input
                        type="number"
                        step=".01"
                        value={rate}
                        id="rate"
                        placeholder="?"
                        onChange={(e) => setRate(e.target.value)}
                        className={styles["form--input"]}
                        style={{ width: "5vw", minWidth: "75px" }}
                        disabled={
                            typeof selectedChallan.sentTaka === "undefined"
                                ? true
                                : false
                        }
                        required
                    />

                    <label htmlFor="amount" style={{ margin: "0 10px 0 1vw" }}>
                        Amount
                    </label>
                    <input
                        type="number"
                        value={amount}
                        id="amount"
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="?"
                        readOnly
                        className={styles["form--input"]}
                        style={{
                            width: "7.5vw",
                            minWidth: "75px",
                        }}
                        disabled={
                            typeof selectedChallan.sentTaka === "undefined"
                                ? true
                                : false
                        }
                        step=".01"
                        required
                    />
                </div>
                {/* Column: Submit button. */}
                <button
                    className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                    style={{ margin: "0 10px 0 1vw", alignSelf: "center" }}
                    disabled={
                        typeof selectedChallan.sentTaka === "undefined"
                            ? true
                            : false
                    }
                >
                    Receive
                </button>
            </div>
        </form>
    );
}
