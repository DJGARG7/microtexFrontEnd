import { useEffect, useState } from "react";
import Axios from "axios";
import {
    toastError,
    toastSuccess,
} from "../../../components/Reuse_components/toast";
import StickyTable from "../../../components/Reuse_components/Table/StickyTable";
const SaleStock = () => {
    const addSaleStockHandler = (rowData) => {
        console.log(rowData.row.values);
        //open modal select pieces/meters and add it to sale inventory and subtract from job inventory if full not selected else delete row
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
                        // className={`${styles["form--btn"]} ${styles["form--del-btn"]}`}
                        // style={{
                        //     cursor: "pointer",
                        //     height: "auto",
                        //     padding: "2.5 0",
                        //     margin: "0",
                        //     fontSize: "0.9rem",
                        //     textTransform: "uppercase",
                        //     fontWeight: "600",
                        // }}
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
            Header: "mtrs available",
            accessor: "meters",
            Filter: "",
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
        },
        {
            Header: "Lace",
            Cell: (tableProps) => {
                return rowDisplayHandler(tableProps);
            },
            accessor: "Lace",
            Filter: "",
        },
    ];
    const [DName, setDName] = useState("");
    const [clothType, setClothType] = useState("");
    const [DNamelist, setDNamelist] = useState([]);
    const [clothlist, setClothlist] = useState([]);
    const [jobStockList, setJobStockList] = useState([]);
    const fetchDesigns = async () => {
        try {
            const res1 = await Axios.get(
                "http://localhost:3004/designMaster/nameAndType"
            );
            setDNamelist(res1.data[0]);
            setClothlist(res1.data[1]);
            // setIsDesignsLoading(false);
        } catch (e) {
            toastError("Failed to fetch designs");
        }
    };
    const fetchJobStocksHandler = async () => {
        try {
            const res1 = await Axios.get(
                `http://localhost:3005/sales/jobStocks/cloth_type_1`
            );
            console.log(res1.data);
            if (res1.data.length == 0) {
                toastError("No stock for this cloth");
            } else {
                setJobStockList(res1.data);
            }
            // setIsDesignsLoading(false);
        } catch (e) {
            toastError("Failed to fetch designs");
        }
    };
    useEffect(() => {
        fetchDesigns();
    }, []);
    const submitHandler = (e) => {
        e.preventDefault();
    };
    return (
        <>
            <form onSubmit={submitHandler}>
                <select
                    name="DName"
                    value={DName}
                    onChange={(e) => setDName(e.target.value)}
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
                <button type="button" onClick={fetchJobStocksHandler}>
                    Show Available stocks
                </button>
            </form>
            <StickyTable TableCol={TableColData} TableData={jobStockList} />
        </>
    );
};
export default SaleStock;
//select design name , design cloth type then fetch from inventory where = godown , =clothtype
