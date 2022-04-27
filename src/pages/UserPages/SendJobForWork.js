import React, { useEffect, useState } from "react";
import styles from "../../styles/SendJob.module.css";
import Modal from "../../components/Reuse_components/Modal";
import StickyTable from "../../components/Reuse_components/Table/StickyTable";
import { ItemFrom } from "../../jsonData/userData/JobToWork/ItemFrom";
import { JobQuality } from "../../jsonData/userData/JobToWork/JobQuality";

import Axios from "axios";
import {
  toastError,
  toastSuccess,
} from "../../components/Reuse_components/toast";
import toast from "react-hot-toast";

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

function SendJobForWork() {
  const purchasedCol = [
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
              settotalpcspresent((preamount) => {
                return parseInt(
                  preamount + tabledata[tableProps.row.index].pieces
                );
              });
              setTableData((prestate) => {
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
      Header: "Job Quality",
      accessor: "jobQuality",
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
      Header: "Mts",
      accessor: "meters",
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
      Header: "Job Qulaity",
      accessor: "jobQuality",
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
      Header: "Mts",
      accessor: "meters",
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

  const [state, setState] = useState({
    challanNo: "",
    jobType: "",
    challanDate: date,
    ItemName: "",
    ItemFrom: "",
    jobQuality: "",
    pieces: "",
    jobRate: "",
    accntname: "",
  });
  const [editmode, setEditmode] = useState(false);
  const [accntlist, setAccntList] = useState([]);
  const [accountID, setaccountID] = useState([]);
  const [tabledata, setTableData] = useState([]);
  const [totalmtspresent, settotalmtspresent] = useState([]); // total mts in inventory
  const [distinctitemlist, setdistinctitemlist] = useState([]); // distinct list of items in inventory
  const [totalpcspresent, settotalpcspresent] = useState([]); // total pcs in inventory
  const [jobTypeModal, setJobTypeModal] = useState(false); // used to open and close job type modal
  const [jobtypelist, setjobtypelist] = useState([]); // used to render job types in select
  const [jobtype, setjobtype] = useState(""); // used in adding job type in modal
  const [jobtypeID, setjobtypeID] = useState(""); // for getting ID of job type
  const [itemID, setItemID] = useState(""); //ID of the item added to the list
  const [meters, setMeters] = useState(""); // meters by users = pcs * 10
  const [viewItemData, setViewItemData] = useState([]); // when view all items is clicked
  const [onViewJobItemModal, setOnViewJobItemModal] = useState(false); // controls the view all items modal
  /*- - - - - - - - - - - - - - - - - - - - - - Use states - - - - - - - - - - - - - - - - - - - - */

  //useEffect to fetch account names
  useEffect(() => {
    (async () => {
      try {
        const res = await accinstance.get("Creditors for job");
        setAccntList(res.data);
        getjobtypes();
      } catch (e) {
        console.log(e.response.data);
      }
    })();
  }, []);

  const clearall = () => {
    setState({
      challanNo: "",
      jobType: "",
      ItemName: "",
      ItemFrom: "",
      jobQuality: "",
      pieces: "",
      jobRate: "",
      accntname: "",
    });
    settotalpcspresent("");
    setTableData("");
    setMeters("");
  };

  /*- - - - - - - - - - - - - - - - - - - - - - Input change function  - - - - - - - - - - - - - - - - - - - - */

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

    // for getting the account id
    if (name === "accntname") {
      const index = e.target.selectedIndex;
      const el = e.target.childNodes[index];
      const id = el.getAttribute("id");
      console.log(id);
      setaccountID(id);
    }

    if (name === "jobType") {
      const index = e.target.selectedIndex;
      const el = e.target.childNodes[index];
      const id = el.getAttribute("id");
      console.log(id);
      setjobtypeID(id);
    }

    // if an item is selected this loads all the mts in the inventory
    if (name === "ItemName" && value !== "") {
      const index = e.target.selectedIndex;
      const el = e.target.childNodes[index];
      const id = el.getAttribute("id");
      console.log(id);
      setItemID(id);
      if (state.ItemFrom === "Grey Godown Stock") {
        try {
          res = await usrinstance.get(`/stockDetails/${id}`);
          const totalpcs = parseInt(res.data[0].totalmts / 10);
          settotalpcspresent(totalpcs);
        } catch (err) {
          console.log(err.response.data);
        }
      }
    }

    // set meters pcs * 10
    if (name === "pieces") {
      setMeters(value * 10);
    }

    // sanity check to convert integer entered to integer
    if (!Number.isNaN(parseFloat(value))) {
      value = parseFloat(value);
    }
    setState({
      ...state,
      [name]: value,
    });
  };

  /*- - - - - - - - - - - - - - - - - - - - - - Input change function  - - - - - - - - - - - - - - - - - - - - */

  /*- - - - - - - - - - - - - - - - - - - - - -       ON FORM SUBMIT    - - - - - - - - - - - - - - - - - - - - */

  const onFormSubmit = (e) => {
    e.preventDefault();
    const newjoblist = { ...state, itemID, meters };
    setTableData((prevdata) => {
      let flag = 0;
      prevdata.forEach((item) => {
        if (
          item.itemID === newjoblist.itemID &&
          item.jobQuality === newjoblist.jobQuality
        ) {
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

  const getjobtypes = async () => {
    try {
      const jobtypes = await jobinstance.get("getjobtype");
      setjobtypelist(jobtypes.data);
    } catch (e) {
      console.log(e.response.data);
    }
  };

  // when jobtype modal form is submitted
  const onJobTypeSubmit = async (e) => {
    e.preventDefault();
    const data = {
      jobtype: jobtype,
    };

    try {
      const res = await jobinstance.post("/addjobtype", data);
      toastSuccess(res.data);
      setJobTypeModal(false);
      setjobtype("");
      getjobtypes();
    } catch (error) {
      toastError(error.response.data);
    }
  };

  /*- - - - - - - - - - - - - - - - - - - - - -       ON BILL SUBMIT    - - - - - - - - - - - - - - - - - - - - */

  const onBillSubmit = async () => {
    const postdata = {
      state,
      accountID,
      jobtypeID,
      tabledata,
    };

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

  return (
    <div className={styles["main"]}>
      <form onSubmit={onFormSubmit} className={styles["form"]}>
        <h2>Send For Job</h2>
        <div className={styles["input-section"]}>
          <select
            className={styles["input-select"]}
            id="accntname"
            required
            name="accntname"
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
            id="jobType"
            name="jobType"
            required
            onChange={onChangeHandler}
            value={state.jobType}
          >
            <option value="">Job Types</option>
            {jobtypelist.map((obj, index) => {
              return (
                <option value={obj.jobType} key={index} id={obj.jobId}>
                  {obj.jobType}
                </option>
              );
            })}
          </select>
          <button
            type="button"
            onClick={() => setJobTypeModal(true)}
            className={`${styles["add-btn"]} ${styles["btn"]}`}
          >
            Add Job Type
          </button>
          <input
            placeholder="Challan No"
            type="number"
            name="challanNo"
            className={styles["input-text"]}
            value={state.challanNo}
            id="challanNo"
            required
            onChange={onChangeHandler}
          />
          <input
            placeholder="challanDate"
            type="Date"
            className={styles["input-text"]}
            value={state.challanDate}
            id="challanDate"
            name="challanDate"
            required
            onChange={onChangeHandler}
          ></input>
        </div>
        <div className={styles["input-section"]}>
          <input
            id="qty"
            type="number"
            name="QtyPresent"
            value={totalpcspresent}
            placeholder="Qty Present"
            disabled
            className={styles["input-text"]}
          />
          <input
            id="MtsPresent"
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
                <option value={obj.itemName} key={index} id={obj.itemID}>
                  {obj.itemName}
                </option>
              );
            })}
          </select>
          <select
            className={styles["input-select"]}
            name="jobQuality"
            required
            onChange={onChangeHandler}
            value={state.jobQuality}
          >
            <option value="">Job Quality</option>
            {JobQuality.map((obj, index) => {
              return (
                <option value={obj} key={index}>
                  {obj}
                </option>
              );
            })}
          </select>
          <input
            id="pieces"
            type="number"
            name="pieces"
            placeholder="Pieces"
            required
            max={totalpcspresent}
            onChange={onChangeHandler}
            value={state.pieces}
            className={styles["input-text"]}
          />
          <input
            id="Mts"
            type="number"
            name="Mts"
            disabled
            placeholder="Mts"
            required
            value={meters}
            className={styles["input-text"]}
          />
          <input
            id="jobRate"
            type="number"
            name="jobRate"
            placeholder="Job Rate"
            required
            onChange={onChangeHandler}
            value={state.jobRate}
            className={styles["input-text"]}
          />
        </div>
        <div style={{ paddingBottom: "20px" }}>
          {!editmode && (
            <button
              className={`${styles["add-btn"]} ${styles["btn"]}`}
              style={{ width: "150px" }}
            >
              Add to the list
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
        </div>
        <div className={styles["form-table"]}>
          <StickyTable
            TableCol={purchasedCol}
            TableData={tabledata}
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              border: "2.5px solid black",
              borderRadius: "5px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "20px",
            marginTop: "50px",
            width: "100%",
            justifyContent: "space-evenly",
          }}
        >
          <button
            type="button"
            className={`${styles["add-btn"]} ${styles["btn"]}`}
            style={{ width: "150px" }}
            onClick={onBillSubmit}
          >
            Submit
          </button>
          <button
            type="button"
            className={`${styles["add-btn"]} ${styles["btn"]}`}
            style={{ width: "150px" }}
            onClick={viewjobitems}
          >
            View all items
          </button>
        </div>
      </form>
      <Modal open={jobTypeModal} onClose={() => setJobTypeModal(false)}>
        <h2>Add Job type</h2>
        <form className={styles["form-modal"]} onSubmit={onJobTypeSubmit}>
          <input
            type="text"
            placeholder="Job Type"
            className={styles["input-text"]}
            required
            style={{ width: "200px" }}
            value={jobtype}
            onChange={(e) => setjobtype(e.target.value)}
          />
          <button
            style={{ width: "150px" }}
            className={`${styles["add-btn"]} ${styles["btn"]}`}
          >
            {" "}
            Add Job
          </button>
        </form>
        <select className={styles["input-select"]}>
          <option value="">Job types</option>
          {jobtypelist.map((obj, index) => {
            return (
              <option value={obj.jobType} key={index}>
                {" "}
                {obj.jobType}{" "}
              </option>
            );
          })}
        </select>
      </Modal>
      <Modal
        open={onViewJobItemModal}
        onClose={() => setOnViewJobItemModal(false)}
      >
        <h2>Job Items sent</h2>
        <StickyTable
          TableData={viewItemData}
          TableCol={viewallitemscoldata}
          style={{
            maxWidth: "90vw",
            width: "100%",
            maxHeight: "90vh",
          }}
        />
      </Modal>
    </div>
  );
}

export default SendJobForWork;
