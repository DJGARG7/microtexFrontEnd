import React, { useState, useEffect } from "react";
import "react-widgets/styles.css";
import "../../../styles/Greypurchase.css";
import Modal from "../../Modal/Modal";
import Axios from "axios";
import toast from "react-hot-toast";
import StickyTable from "../../Reuse_components/Table/StickyTable";
import { GSTdescription } from "../../../jsonData/GSTdescription";


if (localStorage.getItem("userDetails") != null)
  Axios.defaults.headers.common["userID"] = JSON.parse(
    localStorage.getItem("userDetails")
  ).userID;

//axios instances
Axios.defaults.withCredentials = true;
const accinstance = Axios.create({
  baseURL: "http://localhost:3003/accountMaster/",
});
const usrinstance = Axios.create({
  baseURL: "http://localhost:3004/userservice/",
});

function Greypurchase() {
  const TableColData = [
    {
      Header: "Action",
      accessor: (str) => "edit",
      Cell: (tableProps) => (
        <div>
          <button
            style={{
              cursor: "pointer",
            }}
            type="submit"
            onClick={() => {
              onEditHandler(tableProps);
            }}
          >
            edit
          </button>
        </div>
      ),
      sticky: "left",
      Filter: "",
    },
    {
      Header: "Unique Id",
      accessor: "uid",
      show: false,
    },
    {
      Header: "Bill No",
      accessor: "BillNo",
    },
    {
      Header: "Account Name",
      accessor: "accntnames",
    },
    {
      Header: "Rev Charge",
      accessor: "RevCharge",
      Filter: "",
    },
    {
      Header: "RcmInvNo",
      accessor: "RcmInvNo",
      Filter: "",
    },
    {
      Header: "Challan No",
      accessor: "ChallanNo",
      Filter: "",
    },
    {
      Header: "ChallanDate",
      accessor: "ChallanDate",
    },
    {
      Header: "Agent",
      accessor: "Agent",
      Filter: "",
    },
    {
      Header: "Haste",
      accessor: "Haste",
      Filter: "",
    },
    {
      Header: "OrderForm",
      accessor: "OrderForm",
      Filter: "",
    },
    {
      Header: "EntryNo",
      accessor: "EntryNo",
      Filter: "",
    },
    {
      Header: "ItemName",
      accessor: "ItemName",
      Filter: "",
    },
    {
      Header: "Marka",
      accessor: "Marka",
      Filter: "",
    },
    {
      Header: "Taka",
      accessor: "Taka",
      Filter: "",
    },
    {
      Header: "Mts",
      accessor: "Mts",
      Filter: "",
    },
    {
      Header: "Fold",
      accessor: "Fold",
      Filter: "",
    },
    {
      Header: "ActMts",
      accessor: "ActMts",
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
    {
      Header: "Discount",
      accessor: "Discount",
      Filter: "",
    },

    {
      Header: "IGST",
      accessor: "IGST",
      Filter: "",
    },
    {
      Header: "CGST",
      accessor: "CGST",
      Filter: "",
    },
    {
      Header: "SGST",
      accessor: "SGST",
      Filter: "",
    },
    {
      Header: "NetAmount",
      accessor: "NetAmount",
      Filter: "",
    },
  ];

  // col data for purchased items
  const purchasedListCol = [
    {
      Header: "Action",
      accessor: (str) => "edit",
      Cell: (tableProps) => (
        <div>
          <button
            style={{
              cursor: "pointer",
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
      maxWidth:10 ,
      minWidth:60,
      width: 40,
    },
    {
      Header: "Unique Id",
      accessor: "uid",
      show: false,
      maxWidth:10 ,
      minWidth:60,
      width: 40,
    },
    {
      Header: "Item",
      accessor: "Item",
      Filter: "",
      maxWidth:250,
      minWidth:200,
      width:100,
    },
    {
      Header: "Marka",
      accessor: "Marka",
      Filter: "",
      maxWidth:150 ,
      minWidth:100,
      width: 100,
    },
    {
      Header: "Taka",
      accessor: "Taka",
      Filter: "",
      maxWidth:150 ,
      minWidth:100,
      width: 100,
    },
    {
      Header: "Mts",
      accessor: "Mts",
      Filter: "",
      maxWidth:150 ,
      minWidth:100,
      width: 100,
    },
    {
      Header: "Fold",
      accessor: "Fold",
      Filter: "",
      maxWidth:150 ,
      minWidth:100,
      width: 100,
    },
    {
      Header: "ActMts",
      accessor: "ActMts",
      Filter: "",
      maxWidth:150 ,
      minWidth:100,
      width: 100,
    },
    {
      Header: "Rate",
      Filter: "",
      accessor: "Rate",
      maxWidth:150 ,
      minWidth:100,
      width: 40,
    },
    {
      Header: "Amount",
      accessor: "Amount",
      Filter: "",
      maxWidth:150 ,
      minWidth:100,
      width: 100,
    },
  ];

  // For getting the current date
  const current = new Date();
  const date = `${current.getFullYear()}-0${
    current.getMonth() + 1
  }-${current.getDate()}`;


  const [tabledata, settabledata] = useState([]); // for modal table
  const [purchaseditems, setpurchaseditems] = useState([]); // list of purchased items

  const [accntdata, setacctdata] = useState([]); // for setting the account name returend in useEffect
  const [state, setState] = useState({
    BillNo: "",
    BillDate: date,
    accntnames: "",
    RevCharge: "",
    RcmInvNo: 0,
    ChallanNo: 0,
    ChallanDate: date,
    Agent: "",
    Haste: "",
    OrderForm: 0,
    EntryNo: 0,
    ItemName: "",
    Marka: 0,
    Taka: 0,
    Mts: 0,
    Fold: 0,
    ActMts: 0,
    Rate: 0,
    Amount: 0,
    Discount: 0,
    DiscountAmt: 0,
    IGST: 0,
    CGST: 0,
    SGST: 0,
    IGSTamt: 0,
    CGSTamt: 0,
    SGSTamt: 0,
    NetAmount: 0,
  });
  
  const [greyitemadd,setgretitemadd] = useState(false); //toggles modal for greyitem adder
  const [modalstate, setmodalstate] = useState(false); // use state to handle modal toggle
  // function to handle any changes
  const onchangeHandler = (event) => {
    let value = event.target.value;
    if (!Number.isNaN(parseFloat(value))) {
      value = parseFloat(value);
    }
    console.log(typeof value);
    setState({
      ...state,
      [event.target.name]: value,
    });
  };

  // funtion to close modal
  const closeHandler = () => {
    setmodalstate(false);
  };


  // function to handle onsubmit form request
  const onSubmithandler = async (event) => {
    event.preventDefault();
    // const res = await usrinstance.post("addgreypurchase", state);
    const res = 1;

    const newItem = {
      ItemName: state.ItemName,
      Marka: state.Marka,
      Taka: state.Taka,
      Mts: state.Mts,
      Fold: state.Fold,
      ActMts: state.ActMts,
      Rate: state.Rate,
      Amount: state.Amount,
    };
    setpurchaseditems((preitems) => {
      setState({
        ...state,
        ItemName:"",
        Taka : "",
        Mts : "",
        Fold : "",
        ActMts : "",
        Rate :"",
        Amount:"",
        Discount:"",
        IGST:"",
        CGST:"",
        SGST:"",
      })
      return [...preitems, newItem];
    });

    if (res.data.status === "1") {
      console.log("toast");
      toast.success("Purchase added successfully!", {
        style: {
          borderRadius: "15px",
          background: "#333",
          color: "#fff",
        },
      });
    } else {
      toast.error(`Error ${res.data.sqlMessage}`, {
        style: {
          borderRadius: "15px",
          background: "#333",
          color: "#fff",
        },
      });
    }

    //for clearing out the field 
    
  };

  //   useEffect to fetch the account names
  useEffect(() => {
    (async function fetchaccntname() {
      const result = await accinstance.get(" ");

      setacctdata(result.data);
    })();
  }, []);

  // if edit is selected when the edit button is clicked on the table
  const onEditHandler = (tableprops) => {
    setmodalstate(false);
    const data = tableprops.row.original;
    const disamt = Math.round((data.Discount / 100) * data.Amount);
    // setting the data back to the form
    setState({
      ...data,
      DiscountAmt: Math.round((data.Discount / 100) * data.Amount),
      IGSTamt: ((data.Amount - disamt) * data.IGST) / 100,
      CGSTamt: ((data.Amount - disamt) * data.CGST) / 100,
      SGSTamt: ((data.Amount - disamt) * data.SGST) / 100,
    });
  };

  //to handle greyitem add handler
  const greyitemcloseHandler = ()=>{
    setgretitemadd(false);
  }
  return (
    <form onSubmit={onSubmithandler} className="form--greypurchase">
      <div className="main">
        <div className="firstline--greypurchase">
          <label>
            Purchase Type
            <input type="text" disabled value="Grey Purchase" />
          </label>
          <label>
            Bill No
            <input
              type="text"
              value={state.BillNo}
              name="BillNo"
              onChange={onchangeHandler}
              required
            />
          </label>
          <label>
            Bill date
            <input
              type="date"
              style={{ width: "140px" }}
              required
              value={state.BillDate}
              name="BillDate"
              onChange={onchangeHandler}
            />
          </label>
          <label>Challan date</label>
          <input
            style={{ width: "140px" }}
            type="date"
            value={state.ChallanDate}
            name="challanDate"
            onChange={onchangeHandler}
          />
        </div>
        <div className="secondline--greypurchase">
          <label>Supplier</label>
          <select
            name="accntnames"
            onChange={onchangeHandler}
            required
            value={state.accntnames}
          >
            <option value="">Account Names</option>
            {accntdata.map((acct, index) => {
              return (
                <option value={acct.AccName} key={index}>
                  {acct.AccName}
                </option>
              );
            })}
          </select>
          <label>Rev. Charge</label>
          <input
            type="text"
            name="RevCharge"
            onChange={onchangeHandler}
            value={state.RevCharge}
          />
          <label>RCM Inv.No</label>
          <input
            type="text"
            value={state.RcmInvNo}
            name="RcmInvNo"
            onChange={onchangeHandler}
          />
          <label>Challan No.</label>
          <input
            type="text"
            value={state.ChallanNo}
            name="ChallanNo"
            onChange={onchangeHandler}
          />
        </div>
        <div className="thirdline--greypurchase">
          <label>
            Agent:
            <input
              type="text"
              name="Agent"
              value={state.Agent}
              onChange={onchangeHandler}
            />
          </label>
          <label>
            Haste:
            <input
              type="text"
              name="Haste"
              value={state.Haste}
              onChange={onchangeHandler}
            />
          </label>
          <label>
            Order Form:
            <input
              type="text"
              name="OrderForm"
              value={state.OrderForm}
              onChange={onchangeHandler}
            />
          </label>
          <label>
            Entery No.:
            <input
              type="text"
              name="EntryNo"
              value={state.EntryNo}
              onChange={onchangeHandler}
            />
          </label>
        </div>
        <div className="fourthline--greypurchase">
          <label>
            Item Name
            <select
              name="ItemName"
              value={state.ItemName}
              onChange={onchangeHandler}
            >
              <option value="">Item Names</option>
            </select>
            <button type="button" onClick={()=>{setgretitemadd(true)}}>Add Item</button>
          </label>
          <label>
            Marka
            <input
              type="number"
              name="Marka"
              value={state.Marka}
              onChange={onchangeHandler}
            />
          </label>
          <label>
            Taka
            <input
              type="number"
              name="Taka"
              value={state.Taka}
              onChange={onchangeHandler}
            />
            <button type="button">Add peices</button>
          </label>
        </div>
        <div className="fifthline--greypurchase">
          <label>
            Mts.
            <input
              type="number"
              name="Mts"
              value={state.Mts}
              onChange={onchangeHandler}
            />
          </label>
          <label>
            Fold
            <input
              type="number"
              name="Fold"
              value={state.Fold}
              onChange={onchangeHandler}
            />
          </label>
          <label>
            Act. Mts
            <input
              type="number"
              name="ActMts"
              value={parseInt(state.ActMts)}
              id="mts"
              required
              onChange={onchangeHandler}
            />
          </label>
          <label>
            Rate
            <input
              type="number"
              id="rate"
              name="Rate"
              value={parseInt(state.Rate)}
              onChange={onchangeHandler}
            />
          </label>
          <label>
            Amount
            <input
              type="number"
              name="Amount"
              value={parseInt(state.ActMts * state.Rate)}
              readOnly
              onSelect={onchangeHandler}
              id="Amount"
              required
            />
          </label>
        </div>
        <div className="sixthline--greypurchase">
          <label>
            Discount (%)
            <input
              type="text"
              name="Discount"
              value={state.Discount}
              onChange={onchangeHandler}
            />
            <input
              type="text"
              name="DiscountAmt"
              id="DiscountAmt"
              readOnly
              value={Math.round((state.Discount / 100) * state.Amount)}
              onSelect={onchangeHandler}
            />
          </label>
          <label>
            IGST(%)
            <input
              type="text"
              name="IGST"
              value={state.IGST}
              onChange={onchangeHandler}
            />
            <input
              type="text"
              name="IGSTamt"
              id="IGSTamt"
              readOnly
              value={Math.round(
                ((state.Amount - state.DiscountAmt) * state.IGST) / 100
              )}
              onSelect={onchangeHandler}
            />
          </label>
          <label>
            CGST(%)
            <input
              type="text"
              name="CGST"
              value={state.CGST}
              onChange={onchangeHandler}
            />
            <input
              type="text"
              name="CGSTamt"
              id="CGSTamt"
              readOnly
              value={Math.round(
                ((state.Amount - state.DiscountAmt) * state.CGST) / 100
              )}
              onSelect={onchangeHandler}
            />
          </label>
          <label>
            SGST(%)
            <input
              type="text"
              name="SGST"
              value={state.SGST}
              onChange={onchangeHandler}
            />
            <input
              type="text"
              name="SGSTamt"
              readOnly
              id="SGSTamt"
              value={Math.round(
                ((state.Amount - state.DiscountAmt) * state.SGST) / 100
              )}
              onSelect={onchangeHandler}
            />
          </label>
        </div>
        <div className="seventline--greypurchase">
          <label>
            Net Amount
            <input
              type="number"
              name="NetAmount"
              readOnly
              id="NetAmount"
              value={Math.round(
                parseInt(state.Amount) -
                  state.DiscountAmt +
                  state.CGSTamt +
                  state.IGSTamt +
                  state.SGSTamt
              )}
              onSelect={onchangeHandler}
              required
            />
          </label>
          <input type="submit" value="Add Purchase" />
          <button
            onClick={async () => {
              const res = await usrinstance.get("fetchall");
              settabledata(res.data);
              setmodalstate(true);
            }}
            type="button"
          >
            View all purchase
          </button>
        </div>
        <Modal open={modalstate} onClose={closeHandler}>
          <StickyTable TableCol={TableColData} TableData={tabledata} />
        </Modal>
        <div className="greypurchase--itemtable">
          <StickyTable TableCol={purchasedListCol} TableData={purchaseditems} />
        </div>
        <Modal open={greyitemadd} onClose={greyitemcloseHandler}>
          <form className="greypurchase--itemadd">
            <label>
              Item Name:
              <input type="text" required />
            </label>
            <label>
              Opening pcs:
              <input type="number" />
            </label>
            <label>
              Opening Mts:
              <input type="number" />
            </label>
            <label>
              Opening Value:
              <input type="number" />
            </label>
            <label>
              Rate per pcs:
              <input type="number" />
            </label>
            <label>
              Rate per Mts:
              <input type="number" />
            </label>
            <label>
              HSN code:
              <input type="number" required />
            </label>
            <label>
              GST (%):
              <input type="number" required />
            </label>
            <select required>
              <option value="" >Description for GST</option>
              {GSTdescription.map((Item,Index)=>{
                return <option value={Item} key={Index}>{Item}</option>
              })}
            </select>
          </form>
        </Modal>
      </div>
    </form>
  );
}

export default Greypurchase;
