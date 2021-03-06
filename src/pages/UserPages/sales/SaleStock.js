import { useEffect, useState } from "react";
import Axios from "axios";
import {
    toastError,
    toastSuccess,
} from "../../../components/Reuse_components/toast";
import StickyTable from "../../../components/Reuse_components/Table/StickyTable";
import Modal from "../../../components/Reuse_components/Modal";
import SaleStockModal from "../../../components/User_components/sales/SaleStockModal";
import styles from "../Mill/styles/Mill.module.css";
import ReactLoading from "react-loading";

const SaleStock = () => {
    const [currMts, setCurrMts] = useState(0);
    const [inventoryID, setInventoryID] = useState(0);

    const addSaleStockHandler = (rowData) => {
        console.log(rowData.row.values);
        setCurrMts(rowData.row.values.pieces);
        setInventoryID(rowData.row.values.InventoryID);
        setIsOpen(true);
    };

    const rowDisplayHandler = (cellData) => {
        if (cellData.row.values[cellData.column.id] == 1) {
            return <>Done</>;
        } else {
            return <>---</>;
        }
    };

    const TableColData = [
        {
            Header: "Action",
            Cell: (tableProps) => {
                return (
                    <button
                        type="button"
                        onClick={() => addSaleStockHandler(tableProps)}
                        className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
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
                        Add
                    </button>
                );
            },
            width: 100,
        },
        {
            Header: "Inventory ID",
            accessor: "InventoryID",
            Filter: "",
        },
        {
            Header: "Pieces",
            accessor: "pieces",
            Filter: "",
            width: 100,
        },
        {
            Header: "Embroidery",
            Cell: (tableProps) => {
                return rowDisplayHandler(tableProps);
            },
            accessor: "Embroidery",
            Filter: "",
        },
        {
            Header: "Diamond/Stone",
            Cell: (tableProps) => {
                return rowDisplayHandler(tableProps);
            },
            accessor: "Stone",
            Filter: "",
            width: 160,
        },
        {
            Header: "Lace",
            Cell: (tableProps) => {
                return rowDisplayHandler(tableProps);
            },
            accessor: "Lace",
            Filter: "",
            width: 100,
        },
    ];

    const [DName, setDName] = useState("");
    const [clothType, setClothType] = useState("");
    const [DNamelist, setDNamelist] = useState([]);
    const [clothlist, setClothlist] = useState([]);
    const [jobStockList, setJobStockList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const [isDesignsLoading, setIsDesignsLoading] = useState(true);

    const fetchDesigns = async () => {
        try {
            const res = await Axios.get(
                "http://localhost:3004/designMaster/nameAndType"
            );
            setDNamelist(res.data);
            setIsDesignsLoading(false);
        } catch (e) {
            toastError("Failed to fetch designs");
        }
    };

    useEffect(() => {
        fetchDesigns();
    }, []);

    const fetchJobStocksHandler = async () => {
        try {
            const res = await Axios.get(
                `http://localhost:3005/sales/jobStocks/${clothType}`
            );
            console.log(res.data);
            if (res.data.length == 0) {
                toastError("No stock available");
            } else {
                setJobStockList(res.data);
            }
            // setIsDesignsLoading(false);
        } catch (e) {
            toastError("Failed to fetch designs");
        }
    };

    const transferInventoryHandler = async (num) => {
        const data = { num: num, DName: DName, inventoryID: inventoryID };
        console.log(data);
        try {
            await Axios.post(`http://localhost:3005/sales/addSaleStocks`, data);
            toastSuccess("Stock added successfully");
        } catch (e) {
            toastError("Failed to add stock for sale");
        }
        setIsOpen(false);
        setClothType("");
        setJobStockList([]);
    };

    useEffect(async () => {
        setClothType("");
        setJobStockList([]);
        if (DName !== "") {
            try {
                const res = await Axios.get(
                    `http://localhost:3004/designMaster/Type/${DName}`
                );
                setClothlist(res.data);
            } catch (e) {}
        }
    }, [DName]);

    if (isDesignsLoading) {
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
            <h2>Add Stock for Sale</h2>
            <form className={styles["form"]}>
                <div className={styles["form--group"]}>
                    <select
                        name="DName"
                        value={DName}
                        onChange={(e) => setDName(e.target.value)}
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "20%",
                            minWidth: "200px",
                            margin: "10px 0",
                        }}
                    >
                        <option value="" disabled hidden>
                            Select design name
                        </option>
                        {DNamelist.map((DName) => {
                            return (
                                <option value={DName.name} key={DName.name}>
                                    {DName.name}
                                </option>
                            );
                        })}
                    </select>

                    <select
                        name="clothType"
                        value={clothType}
                        onChange={(e) => setClothType(e.target.value)}
                        disabled={DName == ""}
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "20%",
                            minWidth: "200px",
                            margin: "10px 0",
                        }}
                    >
                        <option value="" disabled hidden>
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

                    <button
                        type="button"
                        onClick={fetchJobStocksHandler}
                        disabled={clothType == ""}
                        className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                        style={{ width: "200px" }}
                    >
                        Show Available Stock
                    </button>
                </div>

                <div
                    className={styles["form--table"]}
                    style={{ marginBottom: "40px" }}
                >
                    <StickyTable
                        TableCol={TableColData}
                        TableData={jobStockList}
                    />
                </div>
            </form>

            <Modal
                open={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }}
            >
                <SaleStockModal
                    stockData={currMts}
                    transferStock={transferInventoryHandler}
                />
            </Modal>
        </div>
    );
};
export default SaleStock;
