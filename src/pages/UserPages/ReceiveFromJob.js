import React, { useEffect, useState } from "react";
import styles from "../../styles/SendJob.module.css";
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
const accinstance = Axios.create({
  baseURL: "http://localhost:3003/accountMaster",
});
const jobinstance = Axios.create({
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

function ReceiveFromJob() {
  const inventoryCol = [
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
            onClick={() => onSelectClick(tableProps)}
          >
            Select
          </button>
        </div>
      ),
      sticky: "left",
      Filter: "",
      // maxWidth: 100,
      // minWidth: 100,
      width: 100,
    },
    {
      Header: "Challan No",
      accessor: "challanNo",
      Filter: "",
      // width: "150px",
    },
    {
      Header: "Challan Date",
      accessor: "challanDate",
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
      Header: "Pieces",
      accessor: "pieces",
      Filter: "",
      // width: "90px",
    },
    {
      Header: "Job Rate",
      accessor: "jobRate",
      Filter: "",
      // width: "150px",
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
          {tableProps.row.original.pieces * tableProps.row.original.jobRate}
        </div>
      ),
    },
  ];

  /*- - - - - - - - - - - - - - - - - - - - - - Use states - - - - - - - - - - - - - - - - - - - - */

  const [state, setState] = useState({
    accntname: "",
    billdate: date,
  })
  const [totalamount,settotalamount] = useState("");
  const [challannumber,setchallannumber] = useState("");
  const [accntlist, setAccntList] = useState([]);
  const [accountID, setaccountID] = useState([]); // account id
  const [sentItems, setsentItems] = useState([]); // list of items fetched from inventory
  const [receivedItems, setreceivedItems] = useState([]); // used to populate the final table in the page

  /*- - - - - - - - - - - - - - - - - - - - - - Use states - - - - - - - - - - - - - - - - - - - - */

  //useEffect to fetch account names
  useEffect(() => {
    (async () => {
      try {
        const res = await accinstance.get("Creditors for job");
        setAccntList(res.data);
      } catch (e) {
        console.log(e.response.data);
      }
    })();
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

  const clearall = ()=>{
    settotalamount("");
    setchallannumber("");
    setreceivedItems("");
    setsentItems("");
    setState({
      accntname:"",
      billdate:date
    })
  }

  /*- - - - - - - - - - - - - - - - - - - - - - Receive button clicked on table function  - - - - - - - - - - - - - - - - - - - - */

  const onSelectClick = async (tableprops) => {
    const data = tableprops.row.original;
    console.log(data);
    setchallannumber(data.challanNo);
    let amt=0;
    let temp = []
    sentItems.forEach((item,index)=>{
      if(item.challanNo === data.challanNo){
        amt += data.jobRate * data.pieces
        temp = [...temp,item ]
      }
    })
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
      receivedItems
    }
    try{
      const res = await jobinstance.post("/jobreceiveitems",data);
      console.log(res.data);
      clearall();
      toastSuccess(res.data);
    }catch(e){
      console.log(e.response);
      // toastError(e);
    }

  };
  return (
    <div className={styles["main"]}>
      <form onSubmit={onFormSubmit} className={styles["form"]}>
        <h2>Receiv from Job</h2>
        <div className={styles["input-section"]}>
          {/* <input
            placeholder="Bill No"
            type="number"
            className={styles["input-text"]}
            value={state.billno}
            id="billno"
            name="billno"
            required
            onChange={onChangeHandler}
          /> */}
          <select
            className={styles["input-select"]}
            id="accntname"
            name="accntname"
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
          <select
            className={styles["input-select"]}
            name="ItemFrom"
            required
            onChange={onitemfromChangeHandler}
            value={state.ItemFrom}
          >
            <option value="">Item From</option>
            <option value="Embroidery">Receive from Embroidery Work</option>
            <option value="Lace">Receive from Lace Work</option>
            <option value="Stone">Receive from Stone Work</option>
          </select>
          <input
            placeholder="Bill Date"
            type="Date"
            className={styles["input-text"]}
            value={state.billdate}
            id="billdate"
            name="billdate"
            required
            onChange={onChangeHandler}
          ></input>
        </div>
        <div
          className={styles["form-table"]}
          style={{ padding: "20px", overflow: "auto" }}
        >
          <StickyTable
            TableData={sentItems}
            TableCol={inventoryCol}
            style={{
              maxWidth: "1023px",
              maxHeight: "300px",
              border: "2.5px solid black",
              borderRadius: "5px",
              overflow: "auto",
            }}
          />
        </div>
        <div className={styles["input-section"]}>
          <input
            placeholder="Challan Number"
            type="number"
            className={styles["input-text"]}
            value={challannumber}
            disabled
          />
          <input
            placeholder="Total Amount"
            type="number"
            className={styles["input-text"]}
            value={totalamount}
            disabled
          />
        </div>
        <div
          className={styles["form-table"]}
          style={{ padding: "20px", overflow: "auto" }}
        >
          <StickyTable
            TableCol={receivedCol}
            TableData={receivedItems}
            style={{
              maxWidth: "1023px",
              maxHeight: "300px",
              border: "2.5px solid black",
              borderRadius: "5px",
              overflow: "auto",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "50px",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {<button disabled = {!receivedItems.length} className={`${styles["add-btn"]} ${styles["btn"]}`} style={{width:"20%"}}>
            Receive
          </button>}
          {<button disabled = {!receivedItems.length} className={`${styles["add-btn"]} ${styles["btn"]}`} style={{width:"20%"}} onClick={()=>{
            setchallannumber("");
            settotalamount("");
            setreceivedItems([])}}
            type="button">
            Cancel
          </button>}
          <button
            type="button"
            className={`${styles["add-btn"]} ${styles["btn"]}`}
            style={{width:"20%"}}
          >
            View all received items
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReceiveFromJob;
