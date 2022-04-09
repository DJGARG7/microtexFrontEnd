import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/AccountMaster.module.css";
import "../../styles/CityMaster.css";
import Modal from "../../components/Reuse_components/Modal";
import StickyTable from "../../components/Reuse_components/Table/StickyTable";
import Axios from "axios";
import { toastError, toastSuccess } from "../../components/Reuse_components/toast";


if (localStorage.getItem("userDetails") != null)
  Axios.defaults.headers.common["userID"] = JSON.parse(
    localStorage.getItem("userDetails")
  ).userID;
Axios.defaults.withCredentials = true;
const usrinstance = Axios.create({
  baseURL: "http://localhost:3005/userservice/",
});
function GeneralPurchases({ userDetails }) {
  //table data
  const tablecoldata = [
   
    {
      Header: "Unique Id",
      accessor: "uid",
      show: false,
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
              style={{
                cursor: "pointer",
              }}
              className="btn del-btn"
              type="submit"
              onClick={() => {
                onDeleteRow(tableProps);
              }}
            >
              Delete
            </button>
            <button 
            className="btn edit-btn"
            style={{
                cursor: "pointer",
              }}
              type="submit"
              onClick={() => {
                onEditrow(tableProps);
              }}>
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
  const [state, setState] = useState({
    itemname: "",
    quantity: "",
    priceperqty: "",
  });
  const [totalamount, setTotalamount] = useState(0);
  // On input change
  const onChangeHandler = (e) => {
    let val = e.target.value;
    if (e.target.id === "quantity" || e.target.id === "priceperqty") {
      const value =
        document.getElementById("quantity").value *
        document.getElementById("priceperqty").value;
      setTotalamount(value);
    }
    console.log(val);
    setState({
      ...state,
      [e.target.id]: val,
    });
  };
  //on deleting a row from the table
  const onDeleteRow = async (tableProps) => {
      const res = await usrinstance.delete(`${tableProps.row.original.uuid}`);
      console.log(res.data);
      if (res.data == "1") {
        toastSuccess("Item Deleted");
        const datacopy = [...tabledata];
        datacopy.splice(tableProps.row.index,1);
        settabledata(datacopy);
      } else {
        toastError(`Error ${res.data.sqlMessage}`);
    }
  }

  const onEditrow = async (tableProps) =>{

  }

  // handling of userpermission
  const checkPermission = async () => {
    try {
      const res = await axios.get(
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
    };
    (async () => {
      const res = await usrinstance.post("addgeneralpurchase", data);
      if (res.data.status === "1") {
        toastSuccess("Item added");
        setState({
          itemname: "",
          priceperqty: "",
          quantity: "",
        });
        setTotalamount(0);
      } else {
        toastError(`Error ${res.data.sqlMessage}`)
      }
    })();
  };
  return (
    <div className={styles["main"]}>
      <h1>General Purchase</h1>
      <form onSubmit={onFormSubmit} className={styles["form"]}>
        <div className={styles["input-grid"]}>
          <div className={styles["input-group"]}>
            <input
              placeholder="Item Name"
              type="text"
              className={styles["input-text"]}
              value={state.itemname}
              id="itemname"
              required
              onChange={onChangeHandler}
            ></input>
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
            ></input>
          </div>
        </div>
        <button className={`${styles["add-btn"]} ${styles["btn"]}`}>
          Submit
        </button>
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
        <StickyTable TableCol={tablecoldata} TableData={tabledata} />
      </Modal>
    </div>
  );
}

export default GeneralPurchases;
