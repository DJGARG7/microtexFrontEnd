import React, { useEffect, useState } from "react";
import styles from "../../styles/SendJob.module.css";
import Modal from "../../components/Reuse_components/Modal";
import StickyTable from "../../components/Reuse_components/Table/StickyTable";
import styles2 from "./Mill/styles/Mill.module.css";
import Axios from "axios";
import {
  toastError,
  toastSuccess,
} from "../../components/Reuse_components/toast";

if (localStorage.getItem("userDetails") != null)
  Axios.defaults.headers.common["userID"] = JSON.parse(
    localStorage.getItem("userDetails")
  ).userID;
Axios.defaults.withCredentials = true;
const usrinstance = Axios.create({
  baseURL: "http://localhost:3005/purchases/",
});
const accinstance = Axios.create({
  baseURL: "http://localhost:3003/accountMaster",
});

// helper function to get the current date
function convertDate(inputFormat) {
  function pad(s) {
    return s < 10 ? "0" + s : s;
  }
  var d = new Date(inputFormat);
  return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
}

function GeneralPurchases({ userDetails }) {
  //table data
  const tablecoldata = [
    {
      Header: "Unique Id",
      accessor: "uid",
      show: false,
    },
    {
      Header: "Account name",
      accessor: "accntname",
    },
    {
      Header: "Item Name",
      accessor: "itemname",
    },
    {
      Header: "Quantity",
      accessor: "quantity",
      Filter: "",
    },
    {
      Header: "Price Per Qty",
      accessor: "priceperqty",
      Filter: "",
    },
    {
      Header: "Total Amount",
      accessor: "totalamount",
      Filter: "",
    },
    {
      Header: "Action",
      accessor: (str) => "Delete",
      Cell: (tableProps) => (
        <div className="btn-grp">
          <button
            className={`${styles2["form--btn"]} ${styles2["form--del-btn"]}`}
            onClick={() => {
              onDeleteRow(tableProps);
            }}
          >
            Delete
          </button>
          <button
            className={`${styles2["form--btn"]} ${styles2["form--edit-btn"]}`}
            onClick={() => {
              onEditrow(tableProps);
            }}
          >
            Edit
          </button>
        </div>
      ),
      sticky: "left",
      Filter: "",
    },
  ];

  const [isAllowed, setIsAllowed] = useState(false);
  const [modal, setModal] = useState(false);
  const [tabledata, settabledata] = useState([]);
  const [accntid, setaccntid] = useState("");
  const [state, setState] = useState({
    uuid: "",
    billno: "",
    accntname: "",
    billdate: convertDate(new Date()),
    itemname: "",
    quantity: "",
    priceperqty: "",
  });
  const [editmode, setEditmode] = useState(false);
  const [totalamount, setTotalamount] = useState(0);
  const [accntlist, setaccntlist] = useState([]);
  // clearing all fields
  const clearall = () => {
    setState({
      uuid: "",
      accntname: "",
      billno: "",
      billdate: convertDate(new Date()),
      itemname: "",
      priceperqty: "",
      quantity: "",
    });
    setTotalamount(0);
    setaccntid("");
  };
  // On input change
  const onChangeHandler = (e) => {
    let val = e.target.value;
    const name = e.target.id;
    if (name === "billno") {
      val = parseInt(val);
    }

    if (name === "quantity" || name === "priceperqty") {
      const value =
        document.getElementById("quantity").value *
        document.getElementById("priceperqty").value;
      setTotalamount(value);
    }
    if (name === "accntname") {
      const index = e.target.selectedIndex;
      const el = e.target.childNodes[index];
      const uid = el.getAttribute("id");
      console.log("UUID of item selected ", uid);
      setaccntid(uid);
    }

    setState({
      ...state,
      [name]: val,
    });
  };
  //on deleting a row from the table
  const onDeleteRow = async (tableProps) => {
    const res = await usrinstance.delete(
      `/deletegeneralpurchase/${tableProps.row.original.uuid}`
    );

    if (res.data == "1") {
      toastSuccess("Item Deleted");
      const datacopy = [...tabledata];
      datacopy.splice(tableProps.row.index, 1);
      settabledata(datacopy);
    } else {
      toastError(`Error ${res.data.sqlMessage}`);
    }
  };

  const onEditrow = async (tableProps) => {
    setModal(false);
    setState({
      uuid: tableProps.row.original.uuid,
      accntname: tableProps.row.original.accntname,
      itemname: tableProps.row.original.itemname,
      quantity: tableProps.row.original.quantity,
      priceperqty: tableProps.row.original.priceperqty,
    });
    setTotalamount(tableProps.row.original.totalamount);
    setEditmode(true);
  };

  // handling of userpermission
  const checkPermission = async () => {
    try {
      const res = await Axios.get(
        `http://localhost:3002/permissions/${userDetails.uuid}/2`
      );

      setIsAllowed(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkPermission();
    (async () => {
      const accntType = "Creditors for expenses";
      const res = await accinstance.get(`${accntType}`);

      setaccntlist(res.data);
    })();
  }, []);
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

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const data = {
      state,
      totalamount,
      CrDr: "Cr",
      accntType: "Creditors for expenses",
      accntid: accntid,
    };
    console.log(data);
    (async () => {
      const res = await usrinstance.post("addgeneralpurchase", data);
      if (res.data.status === "1") {
        toastSuccess("Item added");
        clearall();
      } else {
        toastError(`Error ${res.data.sqlMessage}`);
      }
    })();
  };

  // cancels the edit mode
  const onEditCancel = () => {
    setEditmode(false);
    clearall();
  };

  // submits the data form given by the user
  const onEditData = async () => {
    const data = {
      ...state,
      totalamount,
    };
    const res = await usrinstance.put(
      `updategeneralpurchase/${state.uuid}`,
      data
    );

    if (res.data == "1") {
      toastSuccess("Edited Successfully");
      clearall();
    } else {
      toastError(`Error ${res.data.sqlMessage}`);
    }
    setEditmode(false);
  };
  return (
    <div className={styles["main"]}>
      <form onSubmit={onFormSubmit} className={styles["form"]}>
        <h2>General Purchase</h2>
        <div className={styles["input-section"]}>
          <input
            placeholder="Bill No"
            type="number"
            className={styles["input-text"]}
            value={state.billno}
            id="billno"
            required
            onChange={onChangeHandler}
          />
          <input
            placeholder="Bill Date"
            type="date"
            className={styles["input-text"]}
            value={state.billdate}
            id="billdate"
            required
            onChange={onChangeHandler}
          />
          <select
            className={styles["input-select"]}
            id="accntname"
            required
            onChange={onChangeHandler}
            value={state.accntname}
          >
            <option value="">Account Names</option>
            {accntlist.map((obj, index) => {
              return (
                <option value={obj.AccName} key={index} id={obj.uid}>
                  {obj.AccName}
                </option>
              );
            })}
          </select>
        </div>
        <div className={styles["input-section"]}>
          <input
            placeholder="Item Name"
            type="text"
            className={styles["input-text"]}
            value={state.itemname}
            id="itemname"
            required
            onChange={onChangeHandler}
          />
          <input
            placeholder="Quantity"
            type="number"
            className={styles["input-text"]}
            value={state.quantity}
            id="quantity"
            required
            onChange={onChangeHandler}
          ></input>
          <input
            placeholder="Price per Quantity"
            type="number"
            className={styles["input-text"]}
            value={state.priceperqty}
            id="priceperqty"
            required
            onChange={onChangeHandler}
          ></input>
          <input
            id="totalamount"
            type="number "
            required
            value={totalamount === 0 ? "Total Amount" : totalamount}
            className={styles["input-text"]}
            disabled
          />
        </div>

        {!editmode && (
          <button className={`${styles["add-btn"]} ${styles["btn"]}`}>
            Submit
          </button>
        )}
        {editmode && (
          <div>
            <button
              className={`${styles["edit-btn"]} ${styles["btn"]}`}
              type="button"
              onClick={onEditData}
            >
              Edit
            </button>
            <button
              className={`${styles["edit-btn"]} ${styles["btn"]}`}
              type="button"
              onClick={onEditCancel}
            >
              Cancel
            </button>
          </div>
        )}
        <button
          type="button"
          className={`${styles["add-btn"]} ${styles["btn"]}`}
          onClick={() => {
            (async function fetchdata() {
              const res = await usrinstance.get("fetchgeneralpurchase");
              settabledata(res.data);
            })();
            setModal(true);
          }}
        >
          View all items
        </button>
      </form>
      <Modal open={modal} onClose={() => setModal(false)}>
        <StickyTable
          TableCol={tablecoldata}
          TableData={tabledata}
          style={{
            maxWidth: "1000px",

            maxHeight: "500px",
            border: "1px Solid black",
            borderRadius: "10px",
          }}
        />
      </Modal>
    </div>
  );
}

export default GeneralPurchases;
