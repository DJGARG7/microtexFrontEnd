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
const usrinstance = Axios.create({
  baseURL: "http://localhost:3005/purchases/",
});
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
            onClick={() => onReceiveClick(tableProps)}
          >
            Receive
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
      Header: "Item Name",
      accessor: "itemname",
      Filter: "",
      // width: "150px",
    },
    {
      Header: "Meters",
      accessor: "meters",
      Filter: "",
      // width: "90px",
    },
    {
      Header: "Pieces",
      accessor: "pieces",
      Filter: "",
      // width: "90px",
      Cell : (tableprops) => (
       <div>
         {tableprops.row.original.meters/10}
       </div>
      )
    },
    {
      Header: "Embroidery Done",
      accessor: "Embroidery",
      Filter: "",
      // width: "90px",
    },
    {
      Header: "Stone Done",
      accessor: "Stone",
      Filter: "",
      // width: "90px",
    },
    {
      Header: "Lace Done",
      accessor: "Lace",
      Filter: "",
      // width: "90px",
    },
  ];

  const receivedCol = [
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
            // onClick={() => onReceiveClick(tableProps)}
          >
            Delete
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
      Header: "Meters",
      accessor: "meters",
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
    },
  ];

  /*- - - - - - - - - - - - - - - - - - - - - - Use states - - - - - - - - - - - - - - - - - - - - */

  const [state, setState] = useState({
    billno: "",
    accntname: "",
    billdate: date,
  });
  const [itemfrom,setitemfrom] = useState("");
  const [editmode, setEditmode] = useState(false);
  const [totalamount, setTotalAmount] = useState(0);
  const [accntlist, setAccntList] = useState([]);
  const [sent, setsendjobitemslist] = useState([]);
  const [jobsentlist, setjobsentlist] = useState([]); // populates the sent job item table
  const [accountID, setaccountID] = useState([]); // account id
  const [jobtypelist, setjobtypelist] = useState([]); // used to render job types in select
  const [jobtypeID, setjobtypeID] = useState(""); // for getting ID of job type
  const [receiveditemlist, setreceiveditemlist] = useState([]); // list of items fetched from inventory
  const [received, setreceived] = useState({
    itemID:"",
    itemName: "",
    rowindex:"",
  });
  const [receivedpcs, setreceivedpcs] = useState("");
  const [receivedjobrate, setreceivedjobrate] = useState("");
  const [amount, setamount] = useState("");

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

    if (name === "accntname" || name === "jobType") {
      const index = e.target.selectedIndex;
      const el = e.target.childNodes[index];
      const id = el.getAttribute("id");

      if (name === "accntname") setaccountID(id);
      else setjobtypeID(id);
    }



    setState({
      ...state,
      [name]: value,
    });
  };


  const onitemfromChangeHandler = async (e) => {
    const value = e.target.value;
    if(value!=="")
    {
      try{
        const res = await jobinstance.get(`/getitemsforjobreceive/${value}`)
        console.log(res.data);
        setreceiveditemlist(res.data);
      }catch(e){
        console.log(e);
      }
    }else{
      setreceiveditemlist("");
    }
  }
  /*- - - - - - - - - - - - - - - - - - - - - - Input change function  - - - - - - - - - - - - - - - - - - - - */



  /*- - - - - - - - - - - - - - - - - - - - - - Receive button clicked on table function  - - - - - - - - - - - - - - - - - - - - */

  const onReceiveClick = (tableprops) => {
    const data = tableprops.row.original;
  };

  /*- - - - - - - - - - - - - - - - - - - - - - Receive button clicked on table function  - - - - - - - - - - - - - - - - - - - - */


  const onFormSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className={styles["main"]}>
      <form onSubmit={onFormSubmit} className={styles["form"]}>
        <h2>Receiv from Job</h2>
        <div className={styles["input-section"]}>
          <input
            placeholder="Bill No"
            type="number"
            className={styles["input-text"]}
            value={state.billno}
            id="billno"
            name="billno"
            required
            onChange={onChangeHandler}
          />
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
        <div className={styles["input-section"]}>
          <input
            placeholder="Item Name"
            type="text"
            className={styles["input-text"]}
            value={received.itemname}
            id="itemname"
            name="itemname"
            required
            disabled
          />
          <input
            placeholder="Pieces"
            type="number"
            className={styles["input-text"]}
            value={receivedpcs}
            id="pcs"
            name="pcs"
            required
            onChange={(e) => {
              setreceivedpcs(e.target.value);
            }}
          />
          <input
            placeholder="Meters"
            type="number"
            className={styles["input-text"]}
            value={receivedpcs * 10}
            id="meters"
            name="meters"
            required
            disabled
          />
          <input
            placeholder="Job Rate"
            type="number"
            className={styles["input-text"]}
            value={receivedjobrate}
            id="jobrate"
            name="jobrate"
            required
            onChange={(e) => {
              setreceivedjobrate(e.target.value);
            }}
          />
          <input
            placeholder="Amount"
            type="number"
            className={styles["input-text"]}
            value={receivedpcs * receivedjobrate}
            id="amount"
            name="amount"
            disabled
            required
          />
        <button type = "submit" className={`${styles["add-btn"]} ${styles["btn"]}`}>
          Add
        </button>
        </div>
        <div
          className={styles["form-table"]}
          style={{ padding: "20px", overflow: "auto" }}
        >
          <StickyTable
            TableData={receiveditemlist}
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
        <div
          className={styles["form-table"]}
          style={{ padding: "20px", overflow: "auto" }}
        >
          <StickyTable
            TableCol={receivedCol}
            TableData={receiveditemlist}
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
            flexDirection: "column",
            marginTop: "50px",
            justifyContent: "center",
          }}
        >
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
                // onClick={""}
              >
                Edit
              </button>
              <button
                className={`${styles["edit-btn"]} ${styles["btn"]}`}
                type="button"
                // onClick={""}
              >
                Cancel
              </button>
            </div>
          )}
          <button
            type="button"
            className={`${styles["add-btn"]} ${styles["btn"]}`}
          >
            View all items
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReceiveFromJob;
