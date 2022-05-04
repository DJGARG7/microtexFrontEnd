import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./styles/Mill.module.css";
import BillsTable from "./BillsTable";
import Modal from "../../../components/Reuse_components/Modal";
import PdfMill from "./PdfMill";

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
    const [challanNumber, setChallanNumber] = useState("");
    const [selectedGrey, setSelectedGrey] = useState("DEFAULT");
    const [selectedSupplier, setSelectedSupplier] = useState("DEFAULT");
    const [selectedMill, setSelectedMill] = useState("DEFAULT");
    const [selectedBill, setSelectedBill] = useState({});
    const [selectedTaka, setSelectedTaka] = useState([]);
    const [totalMeters, setTotalMeters] = useState(0);
    const [challansubmit, setchallansubmit] = useState(false);
    const [pdfmodal, setpdfmodal] = useState(false);
    const [pdfdata, setpdfdata] = useState();
    const [SupplierAccountName, setSupplierAccountName] = useState();
    const [millaccoutname,setmillaccountname] = useState();
    const [itemname,setitemname] = useState();
    // Fetch supppliers for an item from backend.
    const fetchSuppliers = async () => {
        if (selectedGrey === "DEFAULT") return;

        let suppliersToast;

        try {
            suppliersToast = toast.loading("Fetching suppliers...", toastStyle);

            const res = await axios.get(
                `http://localhost:3005/mill/suppliers/${selectedGrey}`
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
        if (selectedSupplier === "DEFAULT" || selectedGrey === "DEFAULT")
            return;

        let billsToast;

        try {
            billsToast = toast.loading("Fetching bills...", toastStyle);

            const res = await axios.get(
                `http://localhost:3005/purchases/bills/${selectedSupplier}/${selectedGrey}`
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
            toast.error("Failed to fetch bills.", toastStyle, {
                id: billsToast,
            });
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, [selectedGrey]);

    useEffect(() => {
        fetchBills();
    }, [selectedSupplier, selectedGrey]);

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
        const postData = {
            // For MILL_CHALLAN.
            challanNumber: parseInt(challanNumber),
            challanDate,
            supplierID: selectedSupplier,
            itemID: parseInt(selectedGrey),
            millID: selectedMill,
            totalMeters,

            // For MILL_TAKA_DETAILS.
            billNumber: selectedBill.billNumber,
            selectedTaka,
        };
        try {
            const res = await axios.post(`http://localhost:3005/mill/send/`, {
                // For MILL_CHALLAN.
                challanNumber: parseInt(challanNumber),
                challanDate,
                supplierID: selectedSupplier,
                itemID: parseInt(selectedGrey),
                millID: selectedMill,
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
            setBillFromTable([])
            setBills("");
            setTotalMeters(0);
            setchallansubmit(true);
            setpdfdata(postData);
        } catch (error) {
            console.log(error);
            toast.error(`Failed to send: ${error.response.data}.`, {
                id: submitToast,
            });
        }
    };

    const onInvoicePrint = () => {
        console.log(pdfdata);
        setpdfmodal(true);
    };
    return (
        <form onSubmit={submitHandler} className={styles["form"]}>
            {/* Row 1: Inputs. */}
            <div className={styles["form--group"]}>
                {/* Column 1: Challan information. */}
                <div
                    className={styles["form--group"]}
                    style={{ width: "auto", margin: "0" }}
                >
                    <input
                        type="number"
                        onChange={(e) => setChallanNumber(e.target.value)}
                        value={challanNumber}
                        min="1"
                        placeholder="Challan Number"
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
                        onChange={(e) => setChallanDate(e.target.value)}
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => (e.target.type = "text")}
                        value={challanDate}
                        placeholder="Challan Date"
                        className={styles["form--input"]}
                        style={{ width: "150px", minWidth: "150px" }}
                        required
                    />
                </div>

                {/* Column 2: selectedMill. */}
                <select
                    placeholder="Mill"
                    className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                    value={selectedMill}
                    onChange={(e) => {
                        const index = e.target.selectedIndex;
                        const el = e.target.childNodes[index];
                        const name = el.getAttribute("id");
                        setmillaccountname(name);
         
                        setSelectedMill(e.target.value);
                    }}
                    style={{
                        width: "20%",
                        minWidth: "200px",
                        margin: "10px 0",
                    }}
                >
                    <option disabled hidden value="DEFAULT">
                        Select mill...
                    </option>
                    {millsData.map((mill,index) => {
                        return (
                            <option value={mill.uid} key={index} id={mill.AccName}>
                                {mill.AccName}
                            </option>
                        );
                    })}
                </select>

                {/* Column 3: selectedGrey. */}
                <select
                    placeholder="Grey cloth"
                    className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                    value={selectedGrey}
                    onChange={(e) => {
                        const index = e.target.selectedIndex;
                        const el = e.target.childNodes[index];
                        const name = el.getAttribute("id");
                        console.log(name);
                        setitemname(name);
                        
                        setSelectedGrey(e.target.value);
                    }}
                    style={{
                        width: "15%",
                        minWidth: "150px",
                        margin: "10px 0",
                    }}
                >
                    <option disabled hidden value="DEFAULT">
                        Select item...
                    </option>
                    {itemData.map((cloth) => {
                        return (
                            <option value={cloth.itemID} key={cloth.itemID} id={cloth.itemName}>
                                {cloth.itemName}
                            </option>
                        );
                    })}
                </select>

                {/* Column 4: selectedSupplier */}
                <select
                    placeholder="Supplier"
                    className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                    value={selectedSupplier}
                    onChange={(e) => {
                        const index = e.target.selectedIndex;
                        const el = e.target.childNodes[index];
                        const name = el.getAttribute("id");
                        setSupplierAccountName(name);
                        setSelectedSupplier(e.target.value);
                    }}
                    style={{
                        width: "20%",
                        minWidth: "200px",
                        margin: "10px 0",
                    }}
                >
                    <option disabled hidden value="DEFAULT">
                        Select supplier...
                    </option>
                    {suppliers.map((supplier) => {
                        return (
                            <option
                                value={supplier.uid}
                                id={supplier.AccName}
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
            <div className={styles["form--table"]}>
                <BillsTable
                    data={bills}
                    setTaka={setTakaFromTable}
                    setBill={setBillFromTable}
                    setTotal={setTotalMetersFromTable}
                />
            </div>

            {/* Row 3: Selected options. */}
            <div
                className={styles["form--group"]}
                style={{
                    alignSelf: "center",
                    backgroundColor: "#dddddd",
                    borderRadius: "7.5px",
                    marginTop: "auto",
                    marginBottom: "0",
                    position: "sticky",
                    bottom: "0",
                }}
            >
                {/* Column 1: billNumber. */}
                <div
                    className={styles["form--group"]}
                    style={{
                        width: "auto",
                        margin: "0",
                        alignItems: "center",
                    }}
                >
                    <label
                        htmlFor="billNumber"
                        style={{ margin: "0 10px 0 10px" }}
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
                        className={styles["form--input"]}
                        style={{ width: "7.5vw", minWidth: "125px" }}
                        disabled={
                            typeof selectedBill.sentTaka === "undefined"
                                ? true
                                : false
                        }
                    />
                </div>

                {/* Column 2: Taka information.  */}
                <div
                    className={styles["form--group"]}
                    style={{
                        width: "auto",
                        margin: "0",
                        alignItems: "center",
                    }}
                >
                    <label
                        htmlFor="selectedTaka"
                        style={{ margin: "0 10px 0 10px" }}
                    >
                        Selected Taka
                    </label>
                    <input
                        type="number"
                        value={selectedTaka.length}
                        id="selectedTaka"
                        readOnly
                        className={styles["form--input"]}
                        style={{ width: "2vw", minWidth: "50px" }}
                        disabled={
                            typeof selectedBill.sentTaka === "undefined"
                                ? true
                                : false
                        }
                    />

                    <label
                        htmlFor="totalTaka"
                        style={{ margin: "0 10px 0 10px" }}
                    >
                        of
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
                        className={styles["form--input"]}
                        style={{ width: "2vw", minWidth: "50px" }}
                        disabled={
                            typeof selectedBill.sentTaka === "undefined"
                                ? true
                                : false
                        }
                    />
                </div>

                {/* Column 3: itemName. */}
                <div
                    className={styles["form--group"]}
                    style={{
                        width: "auto",
                        margin: "0",
                        alignItems: "center",
                    }}
                >
                    <label
                        htmlFor="itemName"
                        style={{ margin: "0 10px 0 10px" }}
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
                        className={styles["form--input"]}
                        style={{ width: "10vw", minWidth: "150px" }}
                        disabled={
                            typeof selectedBill.sentTaka === "undefined"
                                ? true
                                : false
                        }
                    />
                </div>

                {/* Column 4: Total meters. */}
                <div
                    className={styles["form--group"]}
                    style={{
                        width: "auto",
                        margin: "0",
                        alignItems: "center",
                    }}
                >
                    <label htmlFor="Amount" style={{ margin: "0 10px 0 10px" }}>
                        Total Meters
                    </label>
                    <input
                        type="number"
                        value={totalMeters}
                        id="totalMeters"
                        readOnly
                        className={styles["form--input"]}
                        style={{ width: "3vw", minWidth: "90px" }}
                        disabled={
                            typeof selectedBill.sentTaka === "undefined"
                                ? true
                                : false
                        }
                    />
                </div>

                {/* Column 5: Submit button. */}
                <button
                    className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                    style={{
                        width: "75px",
                        minWidth: "50px",
                        margin: "0 10px 0 10px",
                        alignSelf: "center",
                    }}
                    disabled={
                        typeof selectedBill.billNumber === "undefined"
                            ? true
                            : false
                    }
                >
                    Send
                </button>
                <button
                    className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                    style={{
                        width: "75px",
                        minWidth: "50px",
                        margin: "0 10px 0 10px",
                        alignSelf: "center",
                    }}
                    disabled={!challansubmit}
                    type="button"
                    onClick={onInvoicePrint}
                >
                    Invoice
                </button>
            </div>
            <Modal open={pdfmodal} onClose={() => setpdfmodal(false)}>
                <PdfMill data={pdfdata} accountName={millaccoutname} itemname={itemname}/>
            </Modal>
        </form>
    );
}
