import { useMemo, useState } from "react";
import StickyTable from "../../../components/Reuse_components/Table/StickyTable";
import Modal from "../../../components/Reuse_components/Modal";
import styles from "../../../components/UserManagement/styles/common.module.css";
import axios from "axios";
import toast from "react-hot-toast";
import TakaTable from "./TakaTable";

const toastStyle = {
    style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
    },
};

export default function BillsTable({ data, setTaka }) {
    const columns = useMemo(() => [
        {
            Header: "Bill No.",
            accessor: "billNumber",
        },
        {
            Header: "Bill Date",
            accessor: "billDate",
        },
        {
            Header: "Supplier",
            accessor: "AccName",
        },
        {
            Header: "Item ID",
            accessor: "itemID",
            Filter: "",
            show: false,
        },
        {
            Header: "Item",
            accessor: "itemName",
            Filter: "",
        },
        {
            Header: "Taka",
            accessor: "taka",
            Filter: "",
        },
        {
            Header: "Meters",
            accessor: "meters",
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
                            padding: "2.5px 7.5px",
                            margin: "0",
                            fontSize: "0.9rem",
                            textTransform: "uppercase",
                            fontWeight: "600",
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            fetchTakaDetails(tableProps.row.original);
                        }}
                    >
                        Choose Taka
                    </button>
                </div>
            ),
            sticky: "right",
            Filter: "",
            width: 100,
        },
    ]);

    const [takaDetails, setTakaDetails] = useState([]);

    // Modal state.
    const [isTakaModalOpen, setIsTakaModalOpen] = useState(false);

    const fetchTakaDetails = async (bill) => {
        // Open modal.
        setIsTakaModalOpen(true);

        try {
            const res = await axios.get(
                `http://localhost:3005/purchases/taka/${bill.billNumber}/${bill.itemID}`
            );

            // Adding serial number.
            res.data.forEach((taka, index) => {
                taka.serialNumber = index + 1;
            });

            setTakaDetails(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch taka details", toastStyle);
        }
    };

    const closeTakaModal = () => {
        setIsTakaModalOpen(false);
    };

    return (
        <>
            <StickyTable TableCol={columns} TableData={data} />
            <Modal open={isTakaModalOpen} onClose={closeTakaModal}>
                <h2 style={{ marginBottom: "25px" }}>Choose Taka</h2>
                <TakaTable
                    data={takaDetails}
                    setTaka={setTaka}
                    closeTakaModal={closeTakaModal}
                />
            </Modal>
        </>
    );
}
