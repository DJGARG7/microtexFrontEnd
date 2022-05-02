import Modal from "../../../components/Reuse_components/Modal";

import StickyTable from "../../../components/Reuse_components/Table/StickyTable";
import TakaDetails from "../../../components/Reuse_components/TakaDetails";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import {
    toastError,
    toastSuccess,
} from "../../../components/Reuse_components/toast";
import toast from "react-hot-toast";

import styles from "../Mill/styles/Mill.module.css";

// Axios default configuration to include cookie and user ID with every request.
axios.defaults.withCredentials = true;
axios.defaults.headers.common["userID"] = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails")).userID
    : "";

// Axios instances.
const accounts = axios.create({
    baseURL: "http://localhost:3003/accountMaster/",
});

const purchases = axios.create({
    baseURL: "http://localhost:3005/purchases/",
});

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

export default function GreyPurchase({ userDetails }) {
    const billColumns = useMemo(() => [
        {
            Header: "Action",
            accessor: (str) => "Edit",
            Cell: (tableProps) => (
                <div>
                    <button
                        className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                        style={{
                            cursor: "pointer",
                            height: "auto",
                            padding: "2.5px",
                            margin: "0",
                            fontSize: "0.9rem",
                            textTransform: "uppercase",
                            fontWeight: "600",
                        }}
                        type="submit"
                        onClick={() => {
                            onEditHandler(tableProps);
                        }}
                    >
                        Edit
                    </button>
                </div>
            ),
            sticky: "left",
            Filter: "",
            width: 100,
        },
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
            Header: "item",
            accessor: "itemName",
            Filter: "",
        },
        {
            Header: "Taka",
            accessor: "taka",
            Filter: "",
        },
        {
            Header: "Mts",
            accessor: "meters",
            Filter: "",
        },
        {
            Header: "Rate",
            Filter: "",
            accessor: "rate",
        },
        {
            Header: "Amount",
            accessor: "amount",
            Filter: "",
        },
        {
            Header: "Discount",
            accessor: "discount",
            Filter: "",
        },
    ]);

    const purchasedListCol = useMemo(() => [
        {
            Header: "Action",
            accessor: (str) => "delete",
            Cell: (tableProps) => (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <button
                        className={`${styles["form--btn"]} ${styles["form--del-btn"]}`}
                        style={{
                            cursor: "pointer",
                            height: "auto",
                            padding: "2.5 0",
                            margin: "0",
                            fontSize: "0.9rem",
                            textTransform: "uppercase",
                            fontWeight: "600",
                        }}
                        type="button"
                        onClick={() => {
                            settotalamount((preamount) => {
                                return parseInt(
                                    preamount -
                                        purchaseditems[tableProps.row.index]
                                            .Amount
                                );
                            });
                            setpurchaseditems((prestate) => {
                                prestate.splice(tableProps.row.index, 1);
                                return [...prestate];
                            });
                        }}
                    >
                        Delete
                    </button>
                </div>
            ),
            sticky: "left",
            Filter: "",
            width: 100,
        },
        {
            Header: "Item",
            accessor: "itemName",
            Filter: "",
        },
        {
            Header: "Taka",
            accessor: "Taka",
            Filter: "",
        },
        {
            Header: "Meters",
            accessor: "Mts",
            Filter: "",
        },
        {
            Header: "Rate",
            Filter: "",
            accessor: "Rate",
        },
        {
            Header: "Amount",
            accessor: "Amount",
            Filter: "",
        },
    ]);

    // Authorization state.
    const [isAllowed, setIsAllowed] = useState(false);

    // Loading states.
    const [isAllowedLoading, setIsAllowedLoading] = useState(true);
    const [isSuppliersLoading, setIsSuppliersLoading] = useState(true);
    const [isItemsLoading, setIsItemsLoading] = useState(true);

    // Form-related data.
    const [suppliers, setSuppliers] = useState([]); // for setting the account name returend in useEffect
    const [items, setItems] = useState([]);

    // Modal states.
    const [isItemModalOpen, setIsItemModalOpen] = useState(false); //toggles modal for greyitem adder
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false); // use state to handle modal toggle
    const [isTakaModalOpen, setIsTakaModalOpen] = useState(false);

    // For adding a new item.
    const [newItemName, setNewItemName] = useState("");

    // Form binding.
    const [formData, setFormData] = useState({
        billNumber: "",
        billDate: convertDate(new Date()),
        accountID: "DEFAULT",
        itemID: 0,
        Mts: "",
        Rate: "",
        Amount: "",
        Discount: "",
        DiscountAmt: "",
        NetAmount: "",
    });
    const [totalmts, settotalmts] = useState(0);
    const [totalamount, settotalamount] = useState(""); // THIS IS THE FINAL AMOUNT OF THE BILL
    const [bills, setBills] = useState([]); // for modal table
    const [purchaseditems, setpurchaseditems] = useState([]); // list of purchased items
    const [takaList, setTakaList] = useState([]); // used to hold info about taka details

    const checkPermission = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3002/permissions/${userDetails.uuid}/1`
            );

            setIsAllowed(res.data);
            setIsAllowedLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const getSuppliers = async () => {
        let type = "Sundry Creditors";
        try {
            const res = await accounts.get(`${type}`);
            setSuppliers(res.data);
            setIsSuppliersLoading(false);
        } catch (error) {
            toastError("Error retrieving account data.");
        }
    };

    const getItems = async () => {
        try {
            const res = await purchases.get("items");
            setItems(res.data);
            setIsItemsLoading(false);
        } catch (error) {
            toastError(error.response.data);
        }
    };

    const closeItemModal = () => {
        setIsItemModalOpen(false);
    };

    const openTakaModal = () => {
        setIsTakaModalOpen(true);
    };

    const closeTakaModal = () => {
        setIsTakaModalOpen(false);
    };

    const closePurchaseHandler = () => {
        setIsPurchaseModalOpen(false);
    };

    const onItemAdd = async (event) => {
        event.preventDefault();

        // Post the item to backend.
        try {
            const res = await purchases.post("items", {
                itemName: newItemName,
            });
            toastSuccess(res.data);

            // Close the modal.
            closeItemModal();

            // Reset new item name.
            setNewItemName("");
        } catch (error) {
            toastError(error.response.data);
        }

        getItems();
    };

    // function to handle onsubmit form request
    const onSubmitHandler = async (event) => {
        event.preventDefault();

        // Adding item to the table.
        const newItem = {
            itemID: formData.itemID,
            itemName: items.filter((item) => item.itemID == formData.itemID)[0]
                .itemName,
            Mts: formData.Mts,
            Rate: formData.Rate,
            Amount:
                Math.round(
                    parseFloat(document.getElementById("NetAmount").value) * 100
                ) / 100,
            billNumber: formData.billNumber,
            Discount: formData.Discount,
            Taka: formData.Taka,
            takaList,
        };

        setpurchaseditems((preitems) => {
            return [...preitems, newItem];
        });

        if (1) {
            toastSuccess("Item qdded to the list!");
            settotalamount((presamount) => {
                return parseFloat(presamount + newItem.Amount);
            });
            setTakaList([]);
            settotalmts(0);
            setFormData({
                ...formData,
                Mts: "",
                Rate: "",
                Amount: "",
                Discount: "",
                NetAmount: "",
                DiscountAmt: "",
                Taka: "",
            });
        }
    };

    // if edit is selected when the edit button is clicked on the table
    const onEditHandler = (tableprops) => {
        setIsPurchaseModalOpen(false);
        /* Incomplete. */
    };

    // function to handle any changes
    const onChangeHandler = (event) => {
        let value = event.target.value;

        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    };

    const onMainSubmit = async () => {
        try {
            const res = await purchases.post("bills", {
                formData,
                purchaseditems,
                totalamount,
            });

            toast.success(res.data, toastStyle);

            setFormData({
                ...formData,
                billNumber: "",
                accountID: "DEFAULT",
                itemID: 0,
            });

            setpurchaseditems([]);
            settotalamount(0);
        } catch (error) {
            console.log(error);
            toast.error("Failed to save bill.", toastStyle);
        }
    };

    // when view all pucrchased isclicked
    const onViewBillHandler = async () => {
        setIsPurchaseModalOpen(true);

        // Fetch bills.
        try {
            const res = await purchases.get("bills");

            // Calculations for rendering.
            res.data.forEach((item) => {
                const date = new Date(item.billDate);
                item.billDate = date.toLocaleDateString("en-GB");
            });

            setBills(res.data);
            toast.success("Bills fetched.", toastStyle);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch bills.", toastStyle);
        }
    };

    // function that handles data recived from child taka component
    const onTakaHandler = (takaData) => {
        setTakaList(takaData.tabledata);
        setIsTakaModalOpen(false);
        setFormData({
            ...formData,
            Taka: takaData.tabledata.length,
            Mts: takaData.totalmts,
        });
        settotalmts(takaData.totalmts);
        toastSuccess("Taka details saved!");
    };

    useEffect(() => {
        checkPermission();
        getSuppliers();
        getItems();
    }, []);

    // useeffect to upadte the data
    useEffect(() => {
        const dis =
            Math.round(
                ((formData.Discount / 100) * formData.Amount + Number.EPSILON) *
                    100
            ) / 100;
        setFormData({
            ...formData,
            Amount: formData.Rate * formData.Mts,
            DiscountAmt: dis,
        });
    }, [formData.Rate, formData.Mts, formData.Discount]);

    if (isAllowedLoading || isSuppliersLoading || isItemsLoading) {
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

    if (!isAllowed) {
        return (
            <div
                style={{
                    marginTop: "10vh",
                }}
            >
                <strong>You are not allowed access to this area.</strong>
            </div>
        );
    }

    return (
        <div className={styles["main"]}>
            <h2>Grey Purchase</h2>
            <form onSubmit={onSubmitHandler} className={styles["form"]}>
                {/* Row 1: Bill information, supplier & item */}
                <div className={styles["form--group"]}>
                    <div
                        className={styles["form--group"]}
                        style={{ width: "auto", margin: "0" }}
                    >
                        <input
                            type="number"
                            name="billNumber"
                            value={formData.billNumber}
                            onChange={onChangeHandler}
                            placeholder="Bill Number"
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
                            name="billDate"
                            value={formData.billDate}
                            onChange={onChangeHandler}
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => (e.target.type = "text")}
                            placeholder="Bill Date"
                            className={styles["form--input"]}
                            style={{ width: "150px", minWidth: "150px" }}
                            required
                        />
                    </div>
                    <select
                        name="accountID"
                        onChange={onChangeHandler}
                        required
                        value={formData.accountID}
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "20vw",
                            minWidth: "250px",
                            margin: "10px 0",
                        }}
                    >
                        <option value="DEFAULT" disabled hidden>
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
                    <div
                        className={styles["form--group"]}
                        style={{ width: "auto", margin: "0" }}
                    >
                        <select
                            name="itemID"
                            value={formData.itemID}
                            onChange={onChangeHandler}
                            className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                            style={{
                                width: "15vw",
                                minWidth: "197.5px",
                                marginRight: "15px",
                            }}
                            required
                        >
                            <option value="0" disabled hidden>
                                Select item...
                            </option>
                            {items.map((item) => {
                                return (
                                    <option
                                        value={item.itemID}
                                        key={item.itemID}
                                    >
                                        {item.itemName}
                                    </option>
                                );
                            })}
                        </select>
                        <button
                            type="button"
                            onClick={() => {
                                setIsItemModalOpen(true);
                            }}
                            className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                            style={{ width: "87.5px", minWidth: "87.5px" }}
                        >
                            Add Item
                        </button>
                    </div>
                </div>

                {/* Row 2: Cloth & rate information. */}
                <div className={styles["form--group"]}>
                    <div
                        className={styles["form--group"]}
                        style={{ width: "auto", margin: "0" }}
                    >
                        <input
                            name="Taka"
                            type="number"
                            placeholder="Taka"
                            value={formData.Taka}
                            onChange={onChangeHandler}
                            required
                            readOnly
                            className={styles["form--input"]}
                            style={{
                                width: "10vw",
                                minWidth: "87.5px",
                                marginRight: "15px",
                            }}
                        />
                        <button
                            type="button"
                            onClick={openTakaModal}
                            className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                            style={{ width: "87.5px", minWidth: "87.5px" }}
                        >
                            Add Taka
                        </button>
                    </div>
                    <input
                        type="number"
                        name="Mts"
                        value={formData.Mts}
                        id="mts"
                        required
                        min="0"
                        onChange={onChangeHandler}
                        placeholder="Meters"
                        readOnly
                        className={styles["form--input"]}
                        style={{ width: "10vw", minWidth: "150px" }}
                        
                    />
                    <input
                        type="number"
                        id="rate"
                        name="Rate"
                        min="0"
                        value={formData.Rate}
                        onChange={onChangeHandler}
                        placeholder="Rate"
                        className={styles["form--input"]}
                        style={{ width: "10vw", minWidth: "150px" }}
                        required
                    />
                    <input
                        type="number"
                        name="Discount"
                        placeholder="Discount %"
                        value={formData.Discount}
                        onChange={onChangeHandler}
                        min="0"
                        max="100"
                        className={styles["form--input"]}
                        style={{ width: "10vw", minWidth: "150px" }}
                    />
                </div>

                {/* Row 3: Amount calculations */}
                <div
                    className={styles["form--group"]}
                    style={{
                        backgroundColor: "#dddddd",
                        borderRadius: "5px",
                    }}
                >
                    <div
                        className={styles["form--group"]}
                        style={{
                            width: "auto",
                            margin: "0",
                            alignItems: "center",
                        }}
                    >
                        <label
                            htmlFor="Amount"
                            style={{ margin: "0 10px 0 10px" }}
                        >
                            Amount w/o Discount
                        </label>
                        <input
                            type="number"
                            name="Amount"
                            value={formData.Amount}
                            id="Amount"
                            required
                            readOnly
                            className={styles["form--input"]}
                            style={{ width: "7.5vw", minWidth: "100px" }}
                        />
                    </div>
                    <div
                        className={styles["form--group"]}
                        style={{
                            width: "auto",
                            margin: "0",
                            alignItems: "center",
                        }}
                    >
                        <label htmlFor="Amount" style={{ marginRight: "10px" }}>
                            Discount Amount
                        </label>
                        <input
                            type="text"
                            name="DiscountAmt"
                            id="DiscountAmt"
                            value={formData.DiscountAmt}
                            readOnly
                            className={styles["form--input"]}
                            style={{ width: "7.5vw", minWidth: "100px" }}
                        />
                    </div>
                    <div
                        className={styles["form--group"]}
                        style={{
                            width: "auto",
                            margin: "0",
                            alignItems: "center",
                        }}
                    >
                        <label htmlFor="Amount" style={{ marginRight: "10px" }}>
                            Net Amount
                        </label>
                        <input
                            type="number"
                            name="NetAmount"
                            id="NetAmount"
                            value={formData.Amount - formData.DiscountAmt}
                            readOnly
                            required
                            
                            className={styles["form--input"]}
                            style={{ width: "7.5vw", minWidth: "100px" }}
                        />
                    </div>

                    <div
                        className={styles["form--group"]}
                        style={{ width: "auto", margin: "0 10px 0 0" }}
                    >
                        <input
                            type="submit"
                            value="Add to List"
                            className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                            disabled={(formData.Amount - formData.DiscountAmt)<=0}
                            style={{ width: "100px", minWidth: "100px" }}
                        />
                    </div>
                </div>

                {/* Row 4: Purchase list. */}
                <div className={styles["form--table"]}>
                    <StickyTable
                        TableCol={purchasedListCol}
                        TableData={purchaseditems}
                        style={{ maxHeight: "32.5vh" }}
                    />
                </div>

                {/* Row 5: Button group. */}
                <div
                    className={styles["form--group"]}
                    style={{
                        backgroundColor: "#edf2f4",
                        justifyContent: "center",
                        marginTop: "auto",
                        marginBottom: "0",
                        position: "sticky",
                        bottom: "0",
                    }}
                >
                    <button
                        onClick={onViewBillHandler}
                        type="button"
                        className={`${styles["form--btn"]} ${styles["form--edit-btn"]}`}
                        style={{
                            backgroundColor: "#2297be",
                            width: "150px",
                            minWidth: "150px",
                            marginBottom: "0",
                        }}
                    >
                        View Purchases
                    </button>

                    <input
                        type="text"
                        disabled
                        placeholder="Total Amount"
                        value={totalamount > 0 ? totalamount : "Final Amount"}
                        className={styles["form--input"]}
                        style={{
                            width: "150px",
                            minWidth: "150px",
                            margin: "10px 15px 0 15px",
                        }}
                    />

                    <button
                        disabled={purchaseditems.length > 0 ? false : true}
                        type="button"
                        onClick={onMainSubmit}
                        className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                        style={{
                            width: "150px",
                            minWidth: "150px",
                            marginBottom: "0",
                        }}
                    >
                        Save Bill
                    </button>
                </div>
            </form>

            {/* Modal 1: Saved bills. */}
            <Modal open={isPurchaseModalOpen} onClose={closePurchaseHandler}>
                <h2 style={{ marginBottom: "25px" }}>Purchases</h2>
                <StickyTable
                    TableCol={billColumns}
                    TableData={bills}
                    style={{
                        maxWidth: "90vw",
                        width: "100%",
                        maxHeight: "90vh",
                    }}
                />
            </Modal>

            {/* Modal 2: New item information. */}
            <Modal open={isItemModalOpen} onClose={closeItemModal}>
                <h2 style={{ marginBottom: "25px" }}>Add Item</h2>
                <form
                    className={styles["form"]}
                    style={{ padding: "0", flexDirection: "row" }}
                    onSubmit={onItemAdd}
                >
                    <input
                        type="text"
                        required
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className={styles["form--input"]}
                        style={{ width: "15vw", minWidth: "200px" }}
                        placeholder="Item Name"
                    />
                    <button
                        className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                        style={{
                            width: "100px",
                            minWidth: "100px",
                            margin: "10px 0 10px 10px",
                        }}
                    >
                        Add Item
                    </button>
                </form>
            </Modal>

            {/* Modal 3: Taka information. */}
            <Modal open={isTakaModalOpen} onClose={closeTakaModal}>
                <h2>Add Taka</h2>
                <TakaDetails
                    takaList={takaList}
                    totalMts={totalmts}
                    onTakaHandler={onTakaHandler}
                />
            </Modal>
        </div>
    );
}
