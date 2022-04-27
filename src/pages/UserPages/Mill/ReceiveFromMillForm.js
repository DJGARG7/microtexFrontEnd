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
        },
        {
            Header: "Sent Meters",
            accessor: "sentMeters",
            Filter: "",
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
                            console.log(selectedChallan);
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
    const [receivedMeters, setReceivedMeters] = useState(0);
    const [lostMeters, setLostMeters] = useState(0);
    const [lossP, setLossP] = useState(0);
    const [rate, setRate] = useState(0);
    const [amount, setAmount] = useState(0);

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
            console.log(challans);

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
                    itemID: selectedChallan.itemID,
                    receiveDate,
                    amount,

                    // For MILL_CHALLAN_DETAILS.
                    receivedTaka: selectedChallan.sentTaka,
                    receivedMeters,
                    lostMeters,
                    rate,
                }
            );

            toast.success(res.data, { id: submitToast });

            // Refresh form.
            setReceiveDate(convertDate(new Date()));
            setSelectedGrey("DEFAULT");
            setSelectedMill("DEFAULT");
            setSelectedChallan([]);
            setReceivedMeters(0);
            setLostMeters(0);
            setLossP(0);
            setRate(0);
            setAmount(0);
        } catch (error) {
            console.log(error);
            toast.error(`Failed to receive: ${error.response.data}.`, {
                id: submitToast,
            });
        }
    };

    useEffect(() => {
        fetchChallan();
    }, [selectedGrey, selectedMill]);

    useEffect(() => {
        let tempLM = selectedChallan.sentMeters - receivedMeters;
        let tempLP =
            Math.round(
                ((parseFloat(tempLM) / selectedChallan.sentMeters) * 100 +
                    Number.EPSILON) *
                    100
            ) / 100;

        if (tempLM < 0) {
            toast.error(
                `Please enter a value greater than ${selectedChallan.sentMeters}.`,
                toastStyle
            );
            setReceivedMeters(0);
        } else {
            setLostMeters(tempLM);
            setLossP(tempLP);
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
                        margin: "10px 15px 10px 15px",
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
                        margin: "10px 15px 10px 15px",
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
                style={{ marginTop: "auto" }}
            >
                <StickyTable
                    TableCol={columns}
                    TableData={challans}
                    style={{ maxHeight: "38vh", marginBottom: "15px" }}
                />
            </div>

            {/* Row 3: Received information. */}
            <div
                className={styles["form--group"]}
                style={{
                    backgroundColor: "#dddddd",
                    borderRadius: "5px",
                    marginTop: "auto",
                    marginBottom: "25px",
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
                        htmlFor="sentTaka"
                        style={{ margin: "0 10px 0 10px" }}
                    >
                        Sent Taka
                    </label>
                    <input
                        type="number"
                        value={
                            typeof selectedChallan.sentTaka === "undefined"
                                ? 0
                                : selectedChallan.sentTaka
                        }
                        id="sentTaka"
                        readOnly
                        className={styles["form--input"]}
                        style={{ width: "2vw", minWidth: "50px" }}
                    />

                    <label
                        htmlFor="sentMeters"
                        style={{ margin: "0 10px 0 20px" }}
                    >
                        Sent Meters
                    </label>
                    <input
                        type="number"
                        value={
                            typeof selectedChallan.sentMeters === "undefined"
                                ? 0
                                : selectedChallan.sentMeters
                        }
                        id="sentMeters"
                        readOnly
                        className={styles["form--input"]}
                        style={{ width: "3vw", minWidth: "90px" }}
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
                        style={{ margin: "0 10px 0 10px" }}
                    >
                        Received Meters
                    </label>
                    <input
                        type="number"
                        value={receivedMeters}
                        id="receivedMeters"
                        onChange={(e) => {
                            setReceivedMeters(e.target.value);
                        }}
                        className={styles["form--input"]}
                        style={{
                            width: "3vw",
                            minWidth: "90px",
                        }}
                        disabled={
                            typeof selectedChallan.sentTaka === "undefined"
                                ? true
                                : false
                        }
                        required
                    />

                    <label
                        htmlFor="lostMeters"
                        style={{ margin: "0 10px 0 20px" }}
                    >
                        Lost Meters
                    </label>
                    <input
                        type="number"
                        value={lostMeters}
                        id="lostMeters"
                        onChange={(e) => setLostMeters(e.target.value)}
                        className={styles["form--input"]}
                        style={{ width: "3vw", minWidth: "90px" }}
                        disabled={
                            typeof selectedChallan.sentTaka === "undefined"
                                ? true
                                : false
                        }
                        readOnly
                        required
                    />

                    <label htmlFor="lossP" style={{ margin: "0 10px 0 20px" }}>
                        Loss %
                    </label>
                    <input
                        type="number"
                        value={lossP}
                        disabled={
                            typeof selectedChallan.sentTaka === "undefined"
                                ? true
                                : false
                        }
                        id="lossP"
                        step=".01"
                        readOnly
                        className={styles["form--input"]}
                        style={{ width: "3vw", minWidth: "90px" }}
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
                    <label htmlFor="rate" style={{ margin: "0 10px 0 10px" }}>
                        Rate
                    </label>
                    <input
                        type="number"
                        value={rate}
                        id="rate"
                        onChange={(e) => setRate(e.target.value)}
                        className={styles["form--input"]}
                        style={{ width: "3vw", minWidth: "90px" }}
                        disabled={
                            typeof selectedChallan.sentTaka === "undefined"
                                ? true
                                : false
                        }
                        required
                    />

                    <label htmlFor="amount" style={{ margin: "0 10px 0 20px" }}>
                        Amount
                    </label>
                    <input
                        type="number"
                        value={amount}
                        id="amount"
                        onChange={(e) => setAmount(e.target.value)}
                        readOnly
                        className={styles["form--input"]}
                        style={{
                            width: "4vw",
                            minWidth: "125px",
                            marginRight: "10px",
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
            </div>

            {/* Row 4: Submit button. */}
            <button
                className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                style={{ margin: "0 10px 0 25px", alignSelf: "center" }}
            >
                Receive
            </button>
        </form>
    );
}
