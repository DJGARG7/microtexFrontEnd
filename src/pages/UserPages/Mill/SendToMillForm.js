import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "../../../components/UserManagement/styles/common.module.css";
import millstyles from "./styles/Mill.module.css";
import BillsTable from "./BillsTable";

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

export default function SendToMillForm({ itemData, millsData }) {
    // Form-related data.
    const [suppliers, setSuppliers] = useState([]);
    const [bills, setBills] = useState([]);

    // Form binding.
    const [challanDate, setChallanDate] = useState(convertDate(new Date()));
    const [challanNumber, setChallanNumber] = useState();
    const [selectedGrey, setSelectedGrey] = useState("DEFAULT");
    const [selectedSupplier, setSelectedSupplier] = useState("DEFAULT");
    const [selectedMill, setSelectedMill] = useState("DEFAULT");
    const [selectedBill, setSelectedBill] = useState({});
    const [selectedTaka, setSelectedTaka] = useState([]);
    const [totalMeters, setTotalMeters] = useState(0);

    // Fetch supppliers for an item from backend.
    const fetchSuppliers = async () => {
        const suppliersToast = toast.loading(
            "Getting suppliers...",
            toastStyle
        );

        try {
            const res = await axios.get(
                `http://localhost:3005/purchases/suppliers/${selectedGrey}`
            );

            setSuppliers(res.data);
            setSelectedSupplier("DEFAULT");

            toast.success("Suppliers fetched.", { id: suppliersToast });
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch supplier data.", suppliersToast, {
                id: suppliersToast,
            });
        }
    };

    // Fetch selected bill of a supplier from backend.
    const fetchBills = async () => {
        const billsToast = toast.loading("Getting suppliers...", toastStyle);

        try {
            const res = await axios.get(
                `http://localhost:3005/purchases/fetchGreyBills/${selectedSupplier}/${selectedGrey}`
            );

            // Converting date to DD/MM/YYYY format.
            res.data.forEach((bill) => {
                const date = new Date(bill.billDate);
                bill.billDate = date.toLocaleDateString("en-GB");
            });

            setBills(res.data);

            toast.success("Bills fetched.", { id: billsToast });
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch bills", toastStyle, {
                id: billsToast,
            });
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, [selectedGrey]);

    useEffect(() => {
        fetchBills();
    }, [selectedSupplier]);

    // Retrieve selected bill details from BillTable.
    const setBillFromTable = (data) => {
        setSelectedBill(data);
    };

    // Retrive selected taka from TakaTable.
    const setTakaFromTable = (data) => {
        setSelectedTaka(data);
    };

    // Retrieve sum of selected taka (in meters) from TakaTable.
    const setTotalMetersFromTable = (data) => {
        setTotalMeters(data);
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        const submitToast = toast.loading("Sending to mill...", toastStyle);

        try {
            const res = await axios.post(`http://localhost:3005/mill/challan`, {
                // For MILL_CHALLAN.
                challanNumber,
                challanDate,
                selectedSupplier,
                selectedGrey,
                selectedMill,
                totalMeters,

                // For MILL_TAKA_DETAILS.
                billNumber: selectedBill.billNumber,
                selectedTaka,
            });

            toast.success(res.data, { id: submitToast });

            // Refresh form.
            setChallanDate(convertDate(new Date()));
            setChallanNumber("");
            setSelectedGrey("DEFAULT");
            setSelectedSupplier("DEFAULT");
            setSelectedMill("DEFAULT");
            setSelectedBill({});
            setSelectedTaka([]);
            setTotalMeters(0);
        } catch (error) {
            console.log(error);
            toast.error(`Failed to send: ${error.response.data}.`, {
                id: submitToast,
            });
        }
    };

    console.log(selectedTaka, selectedBill, totalMeters);

    return (
        <form onSubmit={submitHandler} className={millstyles["form"]}>
            {/* Row 1: Inputs. */}
            <div className={millstyles["form--group"]}>
                {/* Column 1: Challan information. */}
                <div
                    className={millstyles["form--group"]}
                    style={{ width: "auto", margin: "0" }}
                >
                    <input
                        type="number"
                        onChange={(e) => setChallanNumber(e.target.value)}
                        value={challanNumber}
                        min="1"
                        placeholder="Challan Number"
                        className={millstyles["form--input"]}
                        style={{
                            width: "10vw",
                            minWidth: "150px",
                            marginRight: "15px",
                        }}
                        required
                    />
                    <input
                        type="text"
                        onChange={(e) => setChallanDate(e.target.value)}
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => (e.target.type = "text")}
                        value={challanDate}
                        placeholder="Challan Date"
                        className={millstyles["form--input"]}
                        style={{ width: "150px", minWidth: "150px" }}
                        required
                    />
                </div>

                {/* Column 2: selectedMill. */}
                <select
                    placeholder="Mill"
                    className={`${millstyles["form--input"]} ${millstyles["form--input-select"]}`}
                    value={selectedMill}
                    onChange={(e) => {
                        setSelectedMill(e.target.value);
                    }}
                    style={{
                        width: "20%",
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

                {/* Column 3: selectedGrey. */}
                <select
                    placeholder="Grey cloth"
                    className={`${millstyles["form--input"]} ${millstyles["form--input-select"]}`}
                    value={selectedGrey}
                    onChange={(e) => {
                        setSelectedGrey(e.target.value);
                    }}
                    style={{
                        width: "15%",
                        minWidth: "150px",
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

                {/* Column 4: selectedSupplier */}
                <select
                    placeholder="Supplier"
                    className={`${millstyles["form--input"]} ${millstyles["form--input-select"]}`}
                    value={selectedSupplier}
                    onChange={(e) => {
                        setSelectedSupplier(e.target.value);
                    }}
                    style={{
                        width: "20%",
                        minWidth: "200px",
                        margin: "10px 15px 10px 15px",
                    }}
                >
                    <option disabled hidden value="DEFAULT">
                        Select supplier...
                    </option>
                    {suppliers.map((supplier) => {
                        return (
                            <option
                                value={supplier.uid}
                                key={supplier.uid}
                                disabled={supplier.uid === -1 ? true : false}
                            >
                                {supplier.AccName}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* Row 2: Table. */}
            <div className={millstyles["form--table"]}>
                <BillsTable
                    data={bills}
                    setTaka={setTakaFromTable}
                    setBill={setBillFromTable}
                    setTotal={setTotalMetersFromTable}
                />
            </div>

            {/* Row 3: Selected options. */}
            <div
                className={millstyles["form--group"]}
                style={{
                    width: "auto",
                    padding: "0 10px",
                    alignSelf: "center",
                    justifyContent: "space-around",
                    backgroundColor: "#dddddd",
                    borderRadius: "5px",
                    marginTop: "45px",
                }}
            >
                {/* Column 1: billNumber. */}
                <div
                    className={millstyles["form--group"]}
                    style={{
                        width: "auto",
                        margin: "0",
                        alignItems: "center",
                    }}
                >
                    <label
                        htmlFor="billNumber"
                        style={{ margin: "0 10px 0 0" }}
                    >
                        Bill Number
                    </label>
                    <input
                        type="number"
                        value={
                            typeof selectedBill.billNumber === "undefined"
                                ? 0
                                : selectedBill.billNumber
                        }
                        id="billNumber"
                        readOnly
                        className={millstyles["form--input"]}
                        style={{ width: "7.5vw", minWidth: "150px" }}
                    />
                </div>

                {/* Column 2: Taka information.  */}
                <div
                    className={millstyles["form--group"]}
                    style={{
                        width: "auto",
                        margin: "0",
                        alignItems: "center",
                    }}
                >
                    <label
                        htmlFor="selectedTaka"
                        style={{ margin: "0 10px 0 40px" }}
                    >
                        Selected Taka
                    </label>
                    <input
                        type="number"
                        value={selectedTaka.length}
                        id="selectedTaka"
                        readOnly
                        className={millstyles["form--input"]}
                        style={{ width: "2vw", minWidth: "50px" }}
                    />

                    <label
                        htmlFor="totalTaka"
                        style={{ margin: "0 10px 0 10px" }}
                    >
                        out of
                    </label>
                    <input
                        type="number"
                        value={
                            typeof selectedBill.taka === "undefined"
                                ? 0
                                : selectedBill.taka
                        }
                        id="totalTaka"
                        readOnly
                        className={millstyles["form--input"]}
                        style={{ width: "2vw", minWidth: "50px" }}
                    />
                </div>

                {/* Column 3: itemName. */}
                <div
                    className={millstyles["form--group"]}
                    style={{
                        width: "auto",
                        margin: "0",
                        alignItems: "center",
                    }}
                >
                    <label
                        htmlFor="itemName"
                        style={{ margin: "0 10px 0 40px" }}
                    >
                        Item
                    </label>
                    <input
                        type="text"
                        value={
                            typeof selectedBill.itemName === "undefined"
                                ? "?"
                                : selectedBill.itemName
                        }
                        id="itemName"
                        readOnly
                        className={millstyles["form--input"]}
                        style={{ width: "10vw", minWidth: "200px" }}
                    />
                </div>

                {/* Column 4: Total meters. */}
                <div
                    className={millstyles["form--group"]}
                    style={{
                        width: "auto",
                        margin: "0",
                        alignItems: "center",
                    }}
                >
                    <label htmlFor="Amount" style={{ margin: "0 10px 0 40px" }}>
                        Total Meters
                    </label>
                    <input
                        type="number"
                        value={totalMeters}
                        id="totalMeters"
                        readOnly
                        className={millstyles["form--input"]}
                        style={{ width: "5vw", minWidth: "100px" }}
                    />
                </div>

                {/* Column 5: Submit button. */}
                <button
                    className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                    style={{ marginLeft: "40px", alignSelf: "center" }}
                >
                    Send
                </button>
            </div>
        </form>
    );
}
