import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "../../components/UserManagement/styles/common.module.css";
import millstyles from "../../styles/Mill.module.css";
import StickyTable from "../../components/Reuse_components/Table/StickyTable";

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

export default function SendToMillForm({ supplierData, millsData }) {
    // Form data.
    const [greyCloth, setGreyCloth] = useState([]);
    const [taka, setTaka] = useState([]);

    // Form binding.
    const [billDate, setBillDate] = useState();
    const [challanDate, setChallanDate] = useState();
    const [selectedGrey, setSelectedGrey] = useState("DEFAULT");
    const [selectedSupplier, setSelectedSupplier] = useState("DEFAULT");
    const [selectedMill, setSelectedMill] = useState("DEFAULT");

    const fetchGreyCloth = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3005/userservice/fetchGreyBills/${selectedSupplier}`
            );

            setGreyCloth(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch mill data", toastStyle);
        }
    };

    const fetchTaka = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3005/userservice/taka/${selectedGrey}`
            );

            setTaka(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch taka details", toastStyle);
        }
    };

    useEffect(() => {
        fetchGreyCloth();
    }, [selectedSupplier]);

    useEffect(() => {
        fetchTaka();
    }, [selectedGrey]);

    const submitHandler = () => {
        console.log("Hello");
    };

    return (
        <form onSubmit={submitHandler} className={millstyles["form"]}>
            <div className={millstyles["form--group"]}>
                <input
                    type="text"
                    onChange={(e) => setBillDate(e.target.value)}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                    value={billDate}
                    placeholder="Bill Date"
                    className={millstyles["form--input"]}
                />
                <input
                    type="text"
                    placeholder="Bill Number"
                    className={millstyles["form--input"]}
                />
                <input
                    type="text"
                    onChange={(e) => setChallanDate(e.target.value)}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                    value={challanDate}
                    placeholder="Challan Date"
                    className={millstyles["form--input"]}
                />
                <input
                    type="text"
                    placeholder="Challan Number"
                    className={millstyles["form--input"]}
                />
            </div>

            <div className={millstyles["form--group"]}>
                <select
                    placeholder="Mill"
                    className={`${millstyles["form--input"]} ${millstyles["form--input-select"]}`}
                    value={selectedSupplier}
                    onChange={(e) => {
                        setSelectedSupplier(e.target.value);
                    }}
                >
                    <option disabled hidden value="DEFAULT">
                        Select supplier...
                    </option>
                    {supplierData.map((supplier) => {
                        return (
                            <option
                                value={supplier.AccName}
                                key={supplier.AccName}
                            >
                                {supplier.AccName}
                            </option>
                        );
                    })}
                </select>
                <select
                    placeholder="Mill"
                    className={`${millstyles["form--input"]} ${millstyles["form--input-select"]}`}
                    value={selectedMill}
                    onChange={(e) => {
                        setSelectedMill(e.target.value);
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
                >
                    <option disabled hidden value="DEFAULT">
                        Select item...
                    </option>
                    {greyCloth.map((cloth) => {
                        return (
                            <option value={cloth.itemID} key={cloth.itemID}>
                                {cloth.ItemName}
                            </option>
                        );
                    })}
                </select>
            </div>

            <div className={millstyles["form--group"]}>
                <StickyTable
                    TableCol={tableColumns}
                    TableData={taka}
                    // style={{
                    //     marginLeft: "70px",
                    //     width: "602px",
                    //     border: "1px Solid black",
                    //     borderRadius: "10px",
                    // }}
                />
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
