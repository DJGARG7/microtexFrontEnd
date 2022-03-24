import React, { useState, useEffect } from "react";
import "react-widgets/styles.css";
import "../../../styles/Greypurchase.css";
import Modal from "../../Modal/Modal";
import Axios from "axios";
import toast from "react-hot-toast";

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
  // For getting the current date
  const current = new Date();
  const date = `${current.getFullYear()}-0${
    current.getMonth() + 1
  }-${current.getDate()}`;

  const [accntdata, setacctdata] = useState([]); // for setting the account name returend in useEffect
  const [state, setState] = useState({
    BillNo: 0,
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
    ActMts: "",
    Rate: "",
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
    console.log(state);
    const res = await usrinstance.post("addgreypurchase", state);
    console.log(res.data.status);
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
      toast.success(`Error ${res.data}`, {
        style: {
          borderRadius: "15px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  //   useEffect to fetch the account names
  useEffect(() => {
    (async function fetchaccntname() {
      const result = await accinstance.get("FetchAll");

      setacctdata(result.data);
    })();
  }, []);

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
          <select name="accntnames" onChange={onchangeHandler} required>
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
            <button type="button">Add Item</button>
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
              value={state.ActMts}
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
              value={state.Rate}
              onChange={onchangeHandler}
            />
          </label>
          <label>
            Amount
            <input
              type="number"
              name="Amount"
              value={state.ActMts * state.Rate}
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
              value={Math.round(
                state.Amount -
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
            onClick={() => {
              setmodalstate(true);
            }}
            type="button"
          >
            View all purchase
          </button>
        </div>
        <Modal open={modalstate} onClose={closeHandler}>
          
        </Modal>
      </div>
    </form>
  );
}

export default Greypurchase;
