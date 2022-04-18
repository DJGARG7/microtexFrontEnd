import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "../../../components/UserManagement/styles/common.module.css";
import millstyles from "./styles/Mill.module.css";

const tableColumns = [
    {
        Header: "Taka Number",
        accessor: "col1", // accessor is the "key" in the data
    },
    {
        Header: "Taka Details",
        accessor: "col2", // accessor is the "key" in the data
    },
];

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
    const [taka, setTaka] = useState([]);

    // Form binding.
    const [challanDate, setChallanDate] = useState(convertDate(new Date()));
    const [challanNumber, setChallanNumber] = useState();
    const [selectedGrey, setSelectedGrey] = useState("DEFAULT");
    const [selectedSupplier, setSelectedSupplier] = useState("DEFAULT");
    const [selectedMill, setSelectedMill] = useState("DEFAULT");

    const fetchSuppliers = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3005/purchases/suppliers/${selectedGrey}`
            );

            setSuppliers(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch supplier data", toastStyle);
        }
    };

    const fetchTaka = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3005/purchases/taka/${selectedGrey}`
            );

            setTaka(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch taka details", toastStyle);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, [selectedGrey]);

    useEffect(() => {
        fetchTaka();
    }, [selectedSupplier]);

    const submitHandler = () => {
        console.log("Hello");
    };

    return (
        <form onSubmit={submitHandler} className={millstyles["form"]}>
            <div className={millstyles["form--group"]}>
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

                <select
                    placeholder="Mill"
                    className={`${millstyles["form--input"]} ${millstyles["form--input-select"]}`}
                    value={selectedMill}
                    onChange={(e) => {
                        setSelectedMill(e.target.value);
                    }}
                    style={{
                        width: "20vw",
                        minWidth: "250px",
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

                <select
                    placeholder="Grey cloth"
                    className={`${millstyles["form--input"]} ${millstyles["form--input-select"]}`}
                    value={selectedGrey}
                    onChange={(e) => {
                        setSelectedGrey(e.target.value);
                    }}
                    style={{
                        width: "17.5vw",
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
            </div>

            <div
                className={millstyles["form--group"]}
                style={{ justifyContent: "center" }}
            >
                <select
                    placeholder="Supplier"
                    className={`${millstyles["form--input"]} ${millstyles["form--input-select"]}`}
                    value={selectedSupplier}
                    onChange={(e) => {
                        setSelectedSupplier(e.target.value);
                    }}
                >
                    {console.log(suppliers)}
                    <option disabled hidden value="DEFAULT">
                        Select supplier...
                    </option>
                    {suppliers.map((supplier) => {
                        return (
                            <option value={supplier.uid} key={supplier.uid}>
                                {supplier.AccName}
                            </option>
                        );
                    })}
                </select>
            </div>

            <div className={millstyles["form--group"]}>
                {/* Render table for taka */}
            </div>

            <button
                className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
            >
                Send
            </button>
        </form>
    );
}
