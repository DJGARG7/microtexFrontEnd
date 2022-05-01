/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Modal from "../../../components/Reuse_components/Modal";
import StickyTable from "../../../components/Reuse_components/Table/StickyTable";
import styles from "../Mill/styles/Mill.module.css";
import ReactLoading from "react-loading";
import axios from "axios";
import {
    toastError,
    toastSuccess,
} from "../../../components/Reuse_components/toast";

// axios default configuration to include cookie and user ID with every request.
axios.defaults.withCredentials = true;
axios.defaults.headers.common["userID"] = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails")).userID
    : "";

const accounts = axios.create({
    baseURL: "http://localhost:3003/accountMaster",
});
const jobinstance = axios.create({
    baseURL: "http://localhost:3005/job/",
});

function SendJobForWork({ userDetails }) {
    function convertDate(inputFormat) {
        function pad(s) {
            return s < 10 ? "0" + s : s;
        }
        var d = new Date(inputFormat);
        return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join(
            "-"
        );
    }
    const date = convertDate(new Date());
    const purchasedCol = [
        {
            Header: "Action",
            accessor: (str) => "delete",
            Cell: (tableProps) => (
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
                        settotalpcspresent((preamount) => {
                            return parseInt(
                                preamount +
                                    sendjobitemslist[tableProps.row.index]
                                        .pieces
                            );
                        });
                        setsendjobitemlist((prestate) => {
                            prestate.splice(tableProps.row.index, 1);
                            return [...prestate];
                        });
                    }}
                >
                    Delete
                </button>
            ),
            sticky: "left",
            Filter: "",
            // maxWidth: 100,
            // minWidth: 100,
            width: 100,
        },
        {
            Header: "Item Name",
            accessor: "ItemName",
            Filter: "",
            // width: "150px",
        },
        {
            Header: "Pcs",
            accessor: "pieces",
            Filter: "",
            // width: "90px",
        },
        {
            Header: "JobRate",
            accessor: "jobRate",
            Filter: "",
            // width: "90px",
        },
    ];

    const viewallitemscoldata = [
        {
            Header: "Challan no",
            accessor: "challanNo",

            // width: "150px",
        },
        {
            Header: "Challan Date",
            accessor: "challanDate",

            // width: "150px",
        },
        {
            Header: "Account Name",
            accessor: "AccName",

            // width: "150px",
        },
        {
            Header: "Job Type",
            accessor: "jobType",
            Filter: "",
            // width: "150px",
        },
        {
            Header: "Item Name",
            accessor: "itemName",
            Filter: "",
            // width: "150px",
        },
        {
            Header: "Pcs",
            accessor: "pieces",
            Filter: "",
            // width: "90px",
        },
        {
            Header: "JobRate",
            accessor: "jobRate",
            Filter: "",
            // width: "90px",
        },
    ];

    /*- - - - - - - - - - - - - - - - - - - - - - Use states - - - - - - - - - - - - - - - - - - - - */

    const [challandetails, setchallandetails] = useState({
        challanNo: "",
        jobType: "",
        challanDate: date,
        accntname: "",
    });
    const [itemdetials, setitemdetails] = useState({
        ItemName: "",
        ItemFrom: "",
        pieces: "",
        jobRate: "",
    });
    const [accntlist, setAccntList] = useState([]);
    const [accountID, setaccountID] = useState([]);
    const [sendjobitemslist, setsendjobitemlist] = useState([]);
    const [distinctitemlist, setdistinctitemlist] = useState([]); // distinct list of items in inventory
    const [totalpcspresent, settotalpcspresent] = useState([]); // total pcs in inventory
    const [itemID, setItemID] = useState(""); //ID of the item added to the list
    const [viewItemData, setViewItemData] = useState([]); // when view all items is clicked
    const [onViewJobItemModal, setOnViewJobItemModal] = useState(false); // controls the view all items modal
    const [inventoryID, setinventoryID] = useState();
    /*- - - - - - - - - - - - - - - - - - - - - - Use states - - - - - - - - - - - - - - - - - - - - */
    // Authorization state.
    const [isAllowed, setIsAllowed] = useState(false);

    // Loading states.
    const [isAllowedLoading, setIsAllowedLoading] = useState(true);
    const [isAccountsLoading, setIsAccountsLoading] = useState(true);

    const checkPermission = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3002/permissions/${userDetails.uuid}/8`
            );

            setIsAllowed(res.data);
            setIsAllowedLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAccounts = async () => {
        try {
            const res = await accounts.get("Creditors for job");
            setAccntList(res.data);
            setIsAccountsLoading(false);
        } catch (e) {
            console.log(e.response.data);
        }
    };

    //useEffect to fetch account names
    useEffect(() => {
        checkPermission();
        fetchAccounts();
    }, []);

    const clearall = () => {
        setchallandetails({
            challanNo: "",
            jobType: "",
            challanDate: date,
            accntname: "",
        });
        setitemdetails({
            ItemName: "",
            ItemFrom: "",
            pieces: "",
            jobRate: "",
        });
        settotalpcspresent("");
        setsendjobitemlist([]);
    };

    /*- - - - - - - - - - - - - - - - - - - - - - Input change function  - - - - - - - - - - - - - - - - - - - - */

    const onChallanChnageHandler = async (e) => {
        let res;
        let value = e.target.value;
        const name = e.target.name;

        // for getting the account id
        if (name === "accntname") {
            const index = e.target.selectedIndex;
            const el = e.target.childNodes[index];
            const id = el.getAttribute("id");
            console.log(id);
            setaccountID(id);
        }

        // sanity check to convert integer entered to integer
        if (!Number.isNaN(parseFloat(value)) && name !== "challanDate") {
            value = parseFloat(value);
        }
        setchallandetails({
            ...challandetails,
            [name]: value,
        });
    };

    const onitemChangeHandler = async (e) => {
        let res;
        let value = e.target.value;
        const name = e.target.name;

        // for setting the item select field
        if (name === "ItemFrom") {
            try {
                if (value !== "") {
                    res = await jobinstance.get(
                        `/getdistinctitems/${value[0]}/${value[1]}/${value[2]}`
                    );
                    console.log("rgrgrg");
                    setdistinctitemlist(res.data);
                } else {
                    setdistinctitemlist([]);
                }
            } catch (e) {
                console.log(e.response.data);
            }
        }

        // if an item is selected this loads all the mts in the inventory
        if (name === "ItemName" && value !== "") {
            const index = e.target.selectedIndex;
            const el = e.target.childNodes[index];
            const id = el.getAttribute("id");
            setItemID(id);

            distinctitemlist.forEach((item, index) => {
                if (item.itemID == id) {
                    console.log(item.pieces);
                    setinventoryID(item.InventoryID);
                    settotalpcspresent(item.pieces);
                }
            });
        }

        if (!Number.isNaN(parseFloat(value)) && name !== "ItemFrom") {
            value = parseFloat(value);
        }

        setitemdetails({
            ...itemdetials,
            [name]: value,
        });
    };
    /*- - - - - - - - - - - - - - - - - - - - - - Input change function  - - - - - - - - - - - - - - - - - - - - */

    /*- - - - - - - - - - - - - - - - - - - - - -       ON FORM SUBMIT    - - - - - - - - - - - - - - - - - - - - */

    const onFormSubmit = async (e) => {
        e.preventDefault();
        let em, st, la;
        distinctitemlist.forEach((item, index) => {
            if (item.InventoryID == inventoryID) {
                em = item.Embroidery;
                st = item.Stone;
                la = item.Lace;
            }
        });

        const newjoblist = { ...itemdetials, itemID, inventoryID, em, st, la };

        setsendjobitemlist((prevdata) => {
            let flag = 0;
            prevdata.forEach((item) => {
                if (item.itemID === newjoblist.itemID) {
                    toastError("Job already exist please delete it");
                    flag = 1;
                    return [...prevdata];
                }
            });
            if (flag === 0) {
                settotalpcspresent((prestate) => {
                    return prestate - newjoblist.pieces;
                });
                return [...prevdata, newjoblist];
            } else return [...prevdata];
        });
    };

    /*- - - - - - - - - - - - - - - - - - - - - -       ON FORM SUBMIT    - - - - - - - - - - - - - - - - - - - - */

    /*- - - - - - - - - - - - - - - - - - - - - -       ON BILL SUBMIT    - - - - - - - - - - - - - - - - - - - - */

    const onBillSubmit = async () => {
        const postdata = {
            challandetails,
            accountID,
            sendjobitemslist,
        };
        console.log(postdata);
        try {
            const res = await jobinstance.post("/addjobdetails", postdata);
            console.log(res);
            clearall();
            toastSuccess(res.data);
        } catch (e) {
            toastError(e.response.data);
        }
    };

    /*- - - - - - - - - - - - - - - - - - - - - -       ON BILL SUBMIT    - - - - - - - - - - - - - - - - - - - - */

    const viewjobitems = async () => {
        try {
            const res = await jobinstance.get("/viewjobitems");
            res.data.forEach((data, index) => {
                const date = new Date(data.challanDate);
                data.challanDate = date.toLocaleDateString("en-GB");
            });
            console.log(res.data);
            setViewItemData(res.data);
            setOnViewJobItemModal(true);
        } catch (e) {
            console.log(e.response.data);
        }
    };

    if (isAllowedLoading || isAccountsLoading) {
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

    // if (!isAllowed) {
    //     return (
    //         <div
    //             style={{
    //                 marginTop: "10vh",
    //             }}
    //         >
    //             <strong>You are not allowed access to this area.</strong>
    //         </div>
    //     );
    // }

    return (
        <div className={styles["main"]}>
            <h2>Send For Job</h2>
            <form onSubmit={onFormSubmit} className={styles["form"]}>
                <div className={styles["form--group"]}>
                    <div
                        className={styles["form--group"]}
                        style={{ width: "auto", margin: "0" }}
                    >
                        <input
                            type="number"
                            name="challanNo"
                            value={challandetails.challanNo}
                            id="challanNo"
                            disabled={sendjobitemslist.length}
                            onChange={onChallanChnageHandler}
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
                            value={challandetails.challanDate}
                            id="challanDate"
                            name="challanDate"
                            onChange={onChallanChnageHandler}
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => (e.target.type = "text")}
                            placeholder="Bill Date"
                            className={styles["form--input"]}
                            style={{ width: "150px", minWidth: "150px" }}
                            required
                        />
                    </div>
                    <select
                        id="accntname"
                        required
                        disabled={sendjobitemslist.length}
                        name="accntname"
                        onChange={onChallanChnageHandler}
                        value={challandetails.accntname}
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "20vw",
                            minWidth: "250px",
                            margin: "10px 0",
                        }}
                    >
                        <option value="" disabled hidden>
                            Select account...
                        </option>
                        {accntlist.map((obj, index) => {
                            return (
                                <option
                                    value={obj.AccName}
                                    key={index}
                                    id={obj.uid}
                                >
                                    {obj.AccName}
                                </option>
                            );
                        })}
                    </select>
                    <select
                        id="jobType"
                        name="jobType"
                        required
                        disabled={sendjobitemslist.length}
                        onChange={onChallanChnageHandler}
                        value={challandetails.jobType}
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "20vw",
                            minWidth: "250px",
                            margin: "10px 0",
                        }}
                    >
                        <option value="" disabled hidden>
                            Select job type...
                        </option>
                        <option value="Embroidery">Embroidery Work</option>
                        <option value="Lace">Lace Work</option>
                        <option value="Stone">Stone Work</option>
                    </select>
                </div>

                <div className={styles["form--group"]}>
                    <select
                        name="ItemFrom"
                        required
                        onChange={onitemChangeHandler}
                        value={itemdetials.ItemFrom}
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "17.5vw",
                            minWidth: "275px",
                            margin: "10px 0",
                        }}
                    >
                        <option value="" disabled hidden>
                            Select item from...
                        </option>
                        <option value="000">Mill Finished Stock</option>
                        <option value="100">Embroidery Finished Stock</option>
                        <option value="010">Lace Finished Stock</option>
                        <option value="001">Stone Finished Stock</option>
                        <option value="110">
                            Embroidery and Lace Finished Stock
                        </option>
                        <option value="101">
                            Embroidery and Stone Finished Stock
                        </option>
                        <option value="011">
                            Lace and Stone Finished Stock
                        </option>
                    </select>

                    <select
                        name="ItemName"
                        required
                        onChange={onitemChangeHandler}
                        value={itemdetials.ItemName}
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "15vw",
                            minWidth: "200px",
                            margin: "10px 0",
                        }}
                    >
                        <option value="" disabled hidden>
                            Seelct item...
                        </option>
                        {distinctitemlist.map((obj, index) => {
                            return (
                                <option
                                    value={obj.itemname}
                                    key={index}
                                    id={obj.itemID}
                                >
                                    {obj.itemname}
                                </option>
                            );
                        })}
                    </select>
                    <div
                        className={styles["form--group"]}
                        style={{
                            width: "auto",
                            margin: "0",
                            alignItems: "center",
                        }}
                    >
                        <label
                            htmlFor="pieces"
                            style={{ margin: "0 10px 0 10px" }}
                        >
                            Send
                        </label>
                        <input
                            id="pieces"
                            type="number"
                            name="pieces"
                            placeholder="Pieces"
                            required
                            max={totalpcspresent}
                            onChange={onitemChangeHandler}
                            value={itemdetials.pieces}
                            className={styles["form--input"]}
                            style={{
                                width: "5vw",
                                minWidth: "75px",
                            }}
                        />
                        <label
                            htmlFor="selectedTaka"
                            style={{ margin: "0 10px 0 10px" }}
                        >
                            of
                        </label>
                        <input
                            id="qty"
                            type="number"
                            name="QtyPresent"
                            value={totalpcspresent}
                            placeholder="?"
                            readOnly
                            className={styles["form--input"]}
                            style={{
                                width: "5vw",
                                minWidth: "75px",
                            }}
                        />
                    </div>
                    <input
                        id="jobRate"
                        type="number"
                        name="jobRate"
                        placeholder="Job Rate"
                        required
                        onChange={onitemChangeHandler}
                        value={itemdetials.jobRate}
                        className={styles["form--input"]}
                        style={{
                            width: "5vw",
                            minWidth: "75px",
                        }}
                    />
                    <button
                        className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                        style={{
                            width: "100px",
                            minWidth: "100px",
                            margin: "0 10px 0 10px",
                            alignSelf: "center",
                        }}
                    >
                        Add to list
                    </button>
                </div>

                <div style={{ paddingBottom: "20px" }}>
                    {/*         
            <div>
              <button
                className={`${styles["form--edit-btn"]} ${styles["form--btn"]}`}
                type="button"
                onClick={""}
              >
                Edit
              </button>
              <button
                className={`${styles["form--edit-btn"]} ${styles["form--btn"]}`}
                type="button"
                onClick={""}
              >
                Cancel
              </button>
            </div> */}
                </div>

                <div className={styles["form--table"]}>
                    <StickyTable
                        TableCol={purchasedCol}
                        TableData={sendjobitemslist}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "32.5vh",
                        }}
                    />
                </div>

                <div
                    className={styles["form--group"]}
                    style={{
                        justifyContent: "center",
                        marginTop: "auto",
                        marginBottom: "0",
                        position: "sticky",
                        bottom: "0",
                    }}
                >
                    <button
                        type="button"
                        className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                        style={{
                            width: "125px",
                            minWidth: "125px",
                            margin: "0 10px 0 10px",
                            alignSelf: "center",
                            fontSize: "0.9rem",
                        }}
                        onClick={viewjobitems}
                    >
                        View sent items
                    </button>
                    <button
                        type="button"
                        className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                        style={{
                            width: "125px",
                            minWidth: "125px",
                            margin: "0 10px 0 10px",
                            alignSelf: "center",
                        }}
                        onClick={onBillSubmit}
                        disabled={!sendjobitemslist.length}
                    >
                        Send
                    </button>
                </div>
            </form>

            <Modal
                open={onViewJobItemModal}
                onClose={() => setOnViewJobItemModal(false)}
            >
                <h2>Sent Items</h2>
                <div className={styles["form--table"]}>
                    <StickyTable
                        TableData={viewItemData}
                        TableCol={viewallitemscoldata}
                        style={{
                            maxWidth: "90vw",
                            width: "100%",
                            maxHeight: "90vh",
                        }}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default SendJobForWork;