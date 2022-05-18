import styles from "../../Mill/styles/Mill.module.css";
import toast from "react-hot-toast";
import ReactLoading from "react-loading";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import StickyTable from "../../../../components/Reuse_components/Table/StickyTable";

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

export default function MillReport({ userDetails }) {
    // Loading states.
    const [isItemsLoading, setIsItemsLoading] = useState(true);
    const [isSuppliersLoading, setIsSuppliersLoading] = useState(true);
    const [isMillsLoading, setIsMillsLoading] = useState(true);
    const [isGreyStockLoading, setIsGreyStockLoading] = useState(false);

    // Form-related data.
    const [items, setItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [mill, setMills] = useState([]);
    const [greyStock, setGreyStock] = useState([]);

    // Form binding.
    const [selectedType, setSelectedType] = useState("DEFAULT");
    const [selectedGrey, setSelectedGrey] = useState("DEFAULT");
    const [selectedSupplier, setSelectedSupplier] = useState("DEFAULT");
    const [selectedMill, setSelectedMill] = useState("DEFAULT");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Table column definitions.
    // Grey inventory.
    const greyCols = useMemo(() => [
        {
            Header: "Item ID",
            accessor: "itemID",
            Filter: "",
        },
        {
            Header: "Item Name",
            accessor: "itemName",
            Filter: "",
        },
        {
            Header: "Supplier",
            accessor: "supplier",
            Filter: "",
        },
        {
            Header: "Stock Avail. (in M)",
            accessor: "meters",
            Filter: "",
            width: 185,
        },
    ]);

    // Mill status.
    const sentMillCols = useMemo(() => [
        {
            Header: "Challan Number",
            accessor: "challanNumber",
        },
        {
            Header: "Mill",
            accessor: "mill",
        },
        {
            Header: "Supplier",
            accessor: "supplier",
        },
        {
            Header: "Sent Date",
            accessor: "sendDate",
            Filter: "",
        },
        {
            Header: "Sent Meters",
            accessor: "sentMeters",
            Filter: "",
        },
    ]);

    const recMillCols = useMemo(() => [
        {
            Header: selectedType === "2" ? "Challan Number" : "Bill Number",
            accessor: "challanNumber",
        },
        {
            Header: "Item Name",
            accessor: "itemName",
        },
        {
            Header: "Supplier",
            accessor: "supplier",
        },
        {
            Header: "Available Meters",
            accessor: "meters",
            Filter: "",
        },
    ]);

    const fetchItems = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3005/purchases/items`
            );
            setItems(res.data);
            setIsItemsLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch item data", toastStyle);
        }
    };

    const fetchSuppliers = async () => {
        let accountType = "Sundry Creditors";

        try {
            const res = await axios.get(
                `http://localhost:3003/accountMaster/${accountType}`
            );

            setSuppliers(res.data);
            setIsSuppliersLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch supplier data", toastStyle);
        }
    };

    const fetchMills = async () => {
        let accountType = "Creditors for process";

        try {
            const res = await axios.get(
                `http://localhost:3003/accountMaster/${accountType}`
            );

            setMills(res.data);
            setIsMillsLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch mill data", toastStyle);
        }
    };

    const fetchGreyStock = async () => {
        setIsGreyStockLoading(true);

        try {
            const res = await axios.get(
                `http://localhost:3005/reports/greyStock`
            );

            setGreyStock(res.data);
            setIsGreyStockLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch grey stock", toastStyle);
        }
    };

    const submitHandler = () => {
        console.log("Hello");
    };

    useEffect(() => {
        fetchItems();
        fetchSuppliers();
        fetchMills();
        fetchGreyStock();
    }, []);

    if (isMillsLoading || isSuppliersLoading || isItemsLoading) {
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
            <h2>Mill Report</h2>
            <form onSubmit={submitHandler} className={styles["form"]}>
                {/* Row 1: Inputs. */}
                <div className={styles["form--group"]}>
                    {/* Column 1: Report type */}
                    <select
                        placeholder="Type"
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        value={selectedType}
                        onChange={(e) => {
                            setSelectedType(e.target.value);
                        }}
                        style={{
                            width: "15%",
                            minWidth: "175px",
                            margin: "10px 0",
                        }}
                    >
                        <option disabled hidden value="DEFAULT">
                            Select report type...
                        </option>
                        <option value="1">Grey Stock</option>
                        <option value="2">Pending Stock</option>
                        <option value="3">Received Stock</option>
                    </select>

                    {/* Column 2: Filters. */}
                    <div
                        className={styles["form--group"]}
                        style={{ width: "auto", margin: "0" }}
                    >
                        {/* <label
                            htmlFor=""
                            style={{ margin: "20px 0px 20px 5px" }}
                        >
                            Filters
                        </label> */}
                        <select
                            placeholder="Filter item"
                            className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                            value={selectedGrey}
                            onChange={(e) => {
                                setSelectedGrey(e.target.value);
                            }}
                            style={{
                                width: "12.5vw",
                                minWidth: "150px",
                                margin: "10px 5px 10px 10px",
                            }}
                        >
                            <option value="DEFAULT">Filter by item...</option>
                            {items.map((cloth) => {
                                return (
                                    <option
                                        value={cloth.itemName}
                                        key={cloth.itemID}
                                        id={cloth.itemName}
                                    >
                                        {cloth.itemName}
                                    </option>
                                );
                            })}
                        </select>

                        <select
                            placeholder="Filter Supplier"
                            className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                            value={selectedSupplier}
                            onChange={(e) => {
                                setSelectedSupplier(e.target.value);
                            }}
                            style={{
                                width: "12.5vw",
                                minWidth: "175px",
                                margin: "10px 5px",
                            }}
                        >
                            <option value="DEFAULT">
                                Filter by supplier...
                            </option>
                            {suppliers.map((supplier) => {
                                return (
                                    <option
                                        value={supplier.AccName}
                                        id={supplier.AccName}
                                        key={supplier.uid}
                                    >
                                        {supplier.AccName}
                                    </option>
                                );
                            })}
                        </select>

                        <select
                            placeholder="Filter Mill"
                            className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                            value={selectedMill}
                            onChange={(e) => {
                                setSelectedMill(e.target.value);
                            }}
                            style={{
                                width: "12.5vw",
                                minWidth: "175px",
                                margin: "10px 5px",
                                display:
                                    selectedType === "1" ? "none" : "inline",
                            }}
                        >
                            <option value="DEFAULT">Filter by mill...</option>
                            {mill.map((mill) => {
                                return (
                                    <option
                                        value={mill.uid}
                                        id={mill.AccName}
                                        key={mill.uid}
                                    >
                                        {mill.AccName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Column 3: Date range. */}
                    <div
                        className={styles["form--group"]}
                        style={{ width: "auto", margin: "0" }}
                    >
                        <label htmlFor="" style={{ margin: "20px 5px" }}>
                            Between
                        </label>
                        <input
                            type="text"
                            onChange={(e) => setStartDate(e.target.value)}
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => (e.target.type = "text")}
                            value={startDate}
                            placeholder="Start Date"
                            className={styles["form--input"]}
                            style={{
                                width: "150px",
                                minWidth: "150px",
                                margin: "10px 5px",
                            }}
                            disabled={selectedType === "1" ? true : false}
                            required
                        />
                        <input
                            type="text"
                            onChange={(e) => setEndDate(e.target.value)}
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => (e.target.type = "text")}
                            value={endDate}
                            placeholder="End Date"
                            className={styles["form--input"]}
                            style={{
                                width: "150px",
                                minWidth: "150px",
                                margin: "10px 5px",
                            }}
                            disabled={selectedType === "1" ? true : false}
                            required
                        />
                    </div>
                </div>

                <div className={styles["form--table"]}>
                    {isGreyStockLoading ? (
                        <ReactLoading type="bubbles" color="#212121" />
                    ) : (
                        <StickyTable
                            TableCol={greyCols}
                            TableData={greyStock
                                .filter((stock) => {
                                    if (selectedGrey === "DEFAULT")
                                        return (
                                            stock.itemName === stock.itemName
                                        );
                                    else return stock.itemName === selectedGrey;
                                })
                                .filter((stock) => {
                                    if (selectedSupplier === "DEFAULT")
                                        return (
                                            stock.supplier === stock.supplier
                                        );
                                    else
                                        return (
                                            stock.supplier === selectedSupplier
                                        );
                                })}
                        />
                    )}
                </div>
            </form>
        </div>
    );
}
