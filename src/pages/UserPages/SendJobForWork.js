import React, { useEffect, useState } from "react";
import styles from "../../styles/AccountMaster.module.css";
import "../../styles/CityMaster.css";
import Modal from "../../components/Reuse_components/Modal";
import StickyTable from "../../components/Reuse_components/Table/StickyTable";
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

function SendJobForWork() {


  // statevariables 
  const [state,setState] = useState(
    {
      challanNo:"",
      jobType:"",
      challanDate:"",
      inventory:"",
      Itemname:"",
      jobQuality:"",
      cut:"",
      taka:"",
      mts:"",
      rate:"",
    }
  );


  const [editmode,setEditmode] = useState(false);
  const [totalamount,setTotalAmount] = useState(0);
  const [accntlist,setAccntList] = useState([]);
  const [tabledata,setTableData] = useState([]);
  const [modal, setModal] = useState(false);

  //useEffect to fetch account names 
  useEffect(() => {
    (async () => {
      const res = await accinstance.get(" "); 
   
      setAccntList(res.data);
    })();
  }, []);

  // On input change
  const onChangeHandler = (e) => {
    let val = e.target.value;
    if (e.target.id === "quantity" || e.target.id === "priceperqty") {
      const value =
        document.getElementById("quantity").value *
        document.getElementById("priceperqty").value;
      setTotalAmount(value);
    }
    setState({
      ...state,
      [e.target.id]: val,
    });
  };


  // when the form is submitted
  const onFormSubmit = ()=>{

  }
  return (
    <div className={styles["main"]}>
      <form onSubmit={onFormSubmit} className={styles["form"]}>
        <div className={styles["input-grid"]}>
          <div className={styles["input-group"]}>
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
              {/* {accntlist.map((obj, index) => {
                return (
                  <option value={obj.AccName} key={index}>
                    {obj.AccName}
                  </option>
                );
              })} */}
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
