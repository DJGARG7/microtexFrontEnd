import React, { useEffect, useState } from "react";
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

function convertDate(inputFormat) {
    function pad(s) {
        return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
}

const date = convertDate(new Date());

function ReceiveFromJob({ userDetails }) {
    const inventoryCol = [
        {
            Header: "Action",
            accessor: (str) => "delete",
            Cell: (tableProps) => (
                <button
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
                    type="button"
                    onClick={() => onSelectClick(tableProps)}
                >
                    Select
                </button>
            ),
            sticky: "left",
            Filter: "",
            width: 100,
        },
        {
            Header: "Challan No.",
            accessor: "challanNo",
            Filter: "",
        },
        {
            Header: "Challan Date",
            accessor: "challanDate",
            Filter: "",
        },
        {
            Header: "Item Name",
            accessor: "itemName",
            Filter: "",
        },
        {
            Header: "Pieces",
            accessor: "pieces",
            Filter: "",
        },
        {
            Header: "Job Rate",
            accessor: "jobRate",
            Filter: "",
        },
    ];

    const receivedCol = [
        {
            Header: "Item Name",
            accessor: "itemName",
            Filter: "",
            // width: "150px",
        },

        {
            Header: "Pieces",
            accessor: "pieces",
            Filter: "",
            // width: "90px",
        },
        {
            Header: "Job Rate",
            accessor: "jobRate",
            Filter: "",
            // width: "90px",
        },
        {
            Header: "Total Price",
            accessor: "amount",
            Filter: "",
            Cell: (tableProps) => (
                <div>
                    {tableProps.row.original.pieces *
                        tableProps.row.original.jobRate}
                </div>
            ),
        },
    ];

    /*- - - - - - - - - - - - - - - - - - - - - - Use states - - - - - - - - - - - - - - - - - - - - */

    const [state, setState] = useState({
        accntname: "",
        billdate: date,
        ItemFrom: "",
    });

    const [totalamount, settotalamount] = useState("");
    const [challannumber, setchallannumber] = useState("");
    const [accntlist, setAccntList] = useState([]);
    const [accountID, setaccountID] = useState([]); // account id
    const [sentItems, setsentItems] = useState([]); // list of items fetched from inventory
    const [receivedItems, setreceivedItems] = useState([]); // used to populate the final table in the page

    // Authorization state.
    const [isAllowed, setIsAllowed] = useState(false);

    // Loading states.
    const [isAllowedLoading, setIsAllowedLoading] = useState(true);
    const [isAccountsLoading, setIsAccountsLoading] = useState(true);

    /*- - - - - - - - - - - - - - - - - - - - - - Use states - - - - - - - - - - - - - - - - - - - - */

    const checkPermission = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3002/permissions/${userDetails.uuid}/9`
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

    /*- - - - - - - - - - - - - - - - - - - - - - Input change function  - - - - - - - - - - - - - - - - - - - - */

    const onChangeHandler = async (e) => {
        let value = e.target.value;
        const name = e.target.name;

        if (name === "accntname") {
            const index = e.target.selectedIndex;
            const el = e.target.childNodes[index];
            const id = el.getAttribute("id");
            console.log(id);
            setaccountID(id);
        }

        setState({
            ...state,
            [name]: value,
        });
    };

    const onitemfromChangeHandler = async (e) => {
        const value = e.target.value;
        if (value !== "") {
            try {
                const res = await jobinstance.get(
                    `/getitemsforjobreceive/${value}/${accountID}`
                );
                res.data.forEach((data, index) => {
                    const date = new Date(data.challanDate);
                    data.challanDate = date.toLocaleDateString("en-GB");
                });
                setsentItems(res.data);
            } catch (e) {
                console.log(e);
            }
        } else {
            setsentItems("");
        }
    };
    /*- - - - - - - - - - - - - - - - - - - - - - Input change function  - - - - - - - - - - - - - - - - - - - - */

    const clearall = () => {
        settotalamount("");
        setchallannumber("");
        setreceivedItems("");
        setsentItems("");
        setState({
            accntname: "",
            billdate: date,
        });
    };

    /*- - - - - - - - - - - - - - - - - - - - - - Receive button clicked on table function  - - - - - - - - - - - - - - - - - - - - */

    const onSelectClick = async (tableprops) => {
        const data = tableprops.row.original;
        console.log(data);
        setchallannumber(data.challanNo);
        let amt = 0;
        let temp = [];
        sentItems.forEach((item, index) => {
            if (item.challanNo === data.challanNo) {
                amt += data.jobRate * data.pieces;
                temp = [...temp, item];
            }
        });
        console.log(temp);
        settotalamount(amt);
        setreceivedItems(temp);
    };

    /*- - - - - - - - - - - - - - - - - - - - - - Receive button clicked on table function  - - - - - - - - - - - - - - - - - - - - */

    const onFormSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...state,
            challannumber,
            totalamount,
            receivedItems,
        };
        try {
            const res = await jobinstance.post("/jobreceiveitems", data);
            console.log(res.data);
            clearall();
            toastSuccess(res.data);
        } catch (e) {
            console.log(e.response);
            // toastError(e);
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
            <h2>Receive from Job</h2>
            <form onSubmit={onFormSubmit} className={styles["form"]}>
                <div
                    className={styles["form--group"]}
                    style={{ justifyContent: "space-around" }}
                >
                    <select
                        id="accntname"
                        name="accntname"
                        required
                        onChange={onChangeHandler}
                        value={state.accntname}
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "25%",
                            minWidth: "200px",
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
                        name="ItemFrom"
                        required
                        onChange={onitemfromChangeHandler}
                        value={state.ItemFrom}
                        className={`${styles["form--input"]} ${styles["form--input-select"]}`}
                        style={{
                            width: "25%",
                            minWidth: "200px",
                            margin: "10px 0",
                        }}
                    >
                        <option value="" disabled hidden>
                            Select item from...
                        </option>
                        <option value="Embroidery">
                            Receive from Embroidery Work
                        </option>
                        <option value="Lace">Receive from Lace Work</option>
                        <option value="Stone">Receive from Stone Work</option>
                    </select>
                    <input
                        type="text"
                        onChange={onChangeHandler}
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => (e.target.type = "text")}
                        placeholder="Receive Date"
                        value={state.billdate}
                        id="billdate"
                        name="billdate"
                        className={styles["form--input"]}
                        style={{ width: "150px", minWidth: "150px" }}
                        required
                    />
                </div>

                <div
                    className={styles["form--table"]}
                    style={{ padding: "20px", overflow: "auto" }}
                >
                    <StickyTable
                        TableData={sentItems}
                        TableCol={inventoryCol}
                        style={{
                            maxWidth: "1023px",
                            maxHeight: "300px",
                        }}
                    />
                </div>

                <div
                    className={styles["form--group"]}
                    style={{ justifyContent: "center" }}
                >
                    <div
                        className={styles["form--group"]}
                        style={{
                            width: "auto",
                            margin: "0",
                            alignItems: "center",
                        }}
                    >
                        <label htmlFor="Amount" style={{ margin: "0 1vw" }}>
                            Selected Challan
                        </label>
                        <input
                            placeholder="?"
                            type="number"
                            value={challannumber}
                            className={styles["form--input"]}
                            style={{
                                width: "250px",
                                minWidth: "250px",
                                marginRight: "1vw",
                            }}
                            readOnly
                        />
                        <input
                            placeholder="?"
                            type="number"
                            value={totalamount}
                            className={styles["form--input"]}
                            style={{
                                width: "250px",
                                minWidth: "250px",
                                marginLeft: "1vw",
                                textAlign: "right",
                            }}
                            readOnly
                        />
                        <label htmlFor="Amount" style={{ margin: "0 1vw" }}>
                            Job Rate
                        </label>
                    </div>
                </div>

                <div className={styles["form--table"]}>
                    <StickyTable
                        TableCol={receivedCol}
                        TableData={receivedItems}
                        style={{
                            maxWidth: "1023px",
                            maxHeight: "300px",
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
                    {
                        <button
                            disabled={!receivedItems.length}
                            className={`${styles["form--add-btn"]} ${styles["form--btn"]}`}
                            style={{ width: "150px", margin: "10px 0.5vw" }}
                        >
                            Receive
                        </button>
                    }
                    {
                        <button
                            disabled={!receivedItems.length}
                            className={`${styles["form--del-btn"]} ${styles["form--btn"]}`}
                            style={{ width: "150px", margin: "10px 0.5vw" }}
                            onClick={() => {
                                setchallannumber("");
                                settotalamount("");
                                setreceivedItems([]);
                            }}
                            type="button"
                        >
                            Cancel
                        </button>
                    }
                    <button
                        type="button"
                        className={`${styles["form--edit-btn"]} ${styles["form--btn"]}`}
                        style={{
                            backgroundColor: "#2297be",
                            width: "150px",
                            fontSize: "0.9rem",
                            margin: "10px 0.5vw",
                        }}
                    >
                        View received items
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ReceiveFromJob;
