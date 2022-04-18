import React, { useEffect, useState } from "react";
import styles from "../../styles/SendJob.module.css";
import Modal from "../../components/Reuse_components/Modal";
import StickyTable from "../../components/Reuse_components/Table/StickyTable";
import { JobTypes } from "../../jsonData/userData/JobToWork/JobTypes";
import { ItemFrom } from "../../jsonData/userData/JobToWork/ItemFrom";

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
  baseURL: "http://localhost:3005/userservice/",
});
const accinstance = Axios.create({
  baseURL: "http://localhost:3003/accountMaster",
});

function convertDate(inputFormat) {
  function pad(s) {
    return s < 10 ? "0" + s : s;
  }
  var d = new Date(inputFormat);
  return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
}

const date = convertDate(new Date());

function SendJobForWork() {
  const purchasedCol = [
    {
      Header: "Item From",
      accessor: "ItemFame",
      Filter: "",
      // width: "150px",
    },
    {
      Header: "Item Name",
      accessor: "ItemName",
      Filter: "",
      // width: "150px",
    },
    {
      Header: "Job Quality",
      accessor: "JobQuality",
      Filter: "",
      // width: "150px",
    },
    // {
    //   Header: "Cut",
    //   accessor: "Cut",
    //   Filter: "",
    //   width: "90px",
    // },
    // {
    //   Header: "Pcs",
    //   accessor: "Pcs",
    //   Filter: "",
    //   width: "90px",
    // },
    {
      Header: "Mts",
      accessor: "Mts",
      Filter: "",
      // width: "90px",
    },
    {
      Header: "JobRate",
      accessor: "JobRate",
      Filter: "",
      // width: "90px",
    },
  ];

  // statevariables
  const [state, setState] = useState({
    ChallanNo: "",
    JobType: "",
    ChallanDate: date,
    inventory: "",
    ItemName: "",
    ItemFrom: "",
    JobQuality: "",
    Cut: "",
    Pcs: "",
    Mts: "",
    JobRate: "",
  });

  const [editmode, setEditmode] = useState(false);
  const [totalamount, setTotalAmount] = useState(0);
  const [accntlist, setAccntList] = useState([]);
  const [tabledata, setTableData] = useState([]);
  const [modal, setModal] = useState(false);
  const [totalmtspresent, settotalmtspresent] = useState([]);
  const [distinctitemlist, setdistinctitemlist] = useState([]);
  const [totalpcspresent, settotalpcspresent] = useState([]);

  //useEffect to fetch account names
  useEffect(() => {
    (async () => {
      const res = await accinstance.get(" ");

      setAccntList(res.data);
    })();
  }, []);

  // On input change
  const onChangeHandler = async (e) => {
    let res;
    let value = e.target.value;
    const name = e.target.name;
    if (name === "ItemFrom") {
      if (value === "Grey Godown Stock") {
        res = await usrinstance("fetchDistinctItems");
        setdistinctitemlist(res.data);
      } else {
        setdistinctitemlist([]);
      }
    }
    // if an item is selected this loads all the mts in the inventory
    if (name === "ItemName" && value !== "") {
      if (state.ItemFrom === "Grey Godown Stock") {
        res = await usrinstance.get(`/stockDetails/${value}`);
        console.log(res.data[0].totaltaka);
        settotalmtspresent(res.data[0].totalmts);
        settotalpcspresent(res.data[0].totaltaka);
      }
    }

    let mts;
    //if item selected is cut or pcs
    if (name === "Cut" || name === "Pcs") {
      const cut = parseFloat(document.getElementById("Cut").value);
      const pcs = parseFloat(document.getElementById("Pcs").value);
      mts = cut * pcs;
      console.log(cut);
    }

    // sanity check to convert integer entered to integer
    if (!Number.isNaN(parseFloat(value))) {
      value = parseFloat(value);
    }
    setState({
      ...state,
      [e.target.name]: value,
      Mts: mts,
    });
  };

  // when the form is submitted
  const onFormSubmit = () => {};
  return (
    <div className={styles["main"]}>
      <form onSubmit={onFormSubmit} className={styles["form"]}>
        <div className={styles["input-section"]}>
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
                <option value={obj.AccName} key={index}>
                  {obj.AccName}
                </option>
              );
            })}
          </select>
          <select
            className={styles["input-select"]}
            id="jobType"
            required
            onChange={onChangeHandler}
            value={state.jobType}
          >
            <option value="">Job Types</option>
            {JobTypes.map((obj, index) => {
              return (
                <option value={obj} key={index}>
                  {obj}
                </option>
              );
            })}
          </select>
          <input
            placeholder="Challan No"
            type="number"
            className={styles["input-text"]}
            value={state.itemname}
            id="itemname"
            required
            onChange={onChangeHandler}
          ></input>
          <input
            placeholder="ChallanDate"
            type="Date"
            className={styles["input-text"]}
            value={state.ChallanDate}
            id="ChallanDate"
            name="ChallanDate"
            required
            onChange={onChangeHandler}
          ></input>
        </div>
        <div className={styles["input-section"]}>
          <input
            id=""
            type="number"
            name="QtyPresent"
            value={totalpcspresent}
            placeholder="Qty Present"
            disabled
            className={styles["input-text"]}
          />
          <input
            id=""
            type="number"
            name="MtsPresent"
            placeholder="Mts Present"
            value={totalmtspresent}
            disabled
            className={styles["input-text"]}
          />
        </div>
        <div className={styles["input-section"]}>
          <select
            className={styles["input-select"]}
            name="ItemFrom"
            required
            onChange={onChangeHandler}
            value={state.ItemFrom}
          >
            <option value="">Item From</option>
            {ItemFrom.map((obj, index) => {
              return (
                <option value={obj} key={index}>
                  {obj}
                </option>
              );
            })}
          </select>
          <select
            className={styles["input-select"]}
            name="ItemName"
            required
            onChange={onChangeHandler}
            value={state.ItemName}
          >
            <option value="">Item Name</option>
            {distinctitemlist.map((obj, index) => {
              return (
                <option value={obj.ItemName} key={index}>
                  {obj.ItemName}
                </option>
              );
            })}
          </select>
          <select
            className={styles["input-select"]}
            name="JobQuality"
            required
            onChange={onChangeHandler}
            value={state.JobQuality}
          >
            <option value="">Job Quality</option>
            {/* {accntlist.map((obj, index) => {
                return (
                  <option value={obj.AccName} key={index}>
                    {obj.AccName}
                  </option>
                );
              })} */}
          </select>
          {/* <input
            id="Cut"
            type="number"
            name="Cut"
            placeholder="Cut"
            required
            onChange={onChangeHandler}
            value={state.Cut}
            className={styles["input-text"]}
          />
          <input
            id="Pcs"
            type="number"
            name="Pcs"
            placeholder="Pcs"
            required
            onChange={onChangeHandler}
            value={state.Pcs}
            className={styles["input-text"]}
          /> */}
          <input
            id="Mts"
            type="number"
            name="Mts"
            placeholder="Mts"
            required
            onChange={onChangeHandler}
            value={state.Mts}
            className={styles["input-text"]}
          />
          <input
            id="JobRate"
            type="number"
            name="JobRate"
            placeholder="Job Rate"
            required
            onChange={onChangeHandler}
            value={state.JobRate}
            className={styles["input-text"]}
          />
        </div>
        <div className={styles["input-section"]}>
          <StickyTable
            TableCol={purchasedCol}
            TableData={tabledata}
            style={{
              maxWidth: "100%",

              maxHeight: "300px",
              border: "1px Solid black",
              borderRadius: "10px",
            }}
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
              onClick={""}
            >
              Edit
            </button>
            <button
              className={`${styles["edit-btn"]} ${styles["btn"]}`}
              type="button"
              onClick={""}
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
              setTableData(res.data);
            })();
            setModal(true);
          }}
        >
          View all items
        </button>
      </form>
    </div>
  );
}

export default SendJobForWork;
