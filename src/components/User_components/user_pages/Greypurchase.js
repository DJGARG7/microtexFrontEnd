import React, { useState, useEffect } from "react";
import styles from "../../../styles/AccountMaster.module.css";
import "react-widgets/styles.css";
import "../../../styles/Greypurchase.css";
import Axios from "axios";
if (localStorage.getItem("userDetails") != null)
  Axios.defaults.headers.common["userID"] = JSON.parse(
    localStorage.getItem("userDetails")
  ).userID;
Axios.defaults.withCredentials = true;
const instance = Axios.create({
  baseURL: "http://localhost:3003/accountMaster/",
});
function Greypurchase() {
  const current = new Date();
  const date = `${current.getFullYear()}-0${
    current.getMonth() + 1
  }-${current.getDate()}`;
  const [accntdata, setacctdata] = useState([]); // for setting the account name returend in useEffect
  const [state, setState] = useState({
    SrNo: "0",
    BillNo: 0,
    BillDate: date,
    accntnames: "",
    RevCharge: "",
    RcmInvNo: "",
    ChallanNo: "",
    ChallanDate: date,
    Agent: "",
    Haste: "",
    OrderForm: "",
    EntryNo: "",
    ItemName: "",
    Marka: "",
    Taka: "",
    Mts: "",
    Fold: "",
    ActMts: 0,
    Rate: "",
    Amount: 0,
    Discount: "",
    DiscountAmt: "",
    IGST: "",
    CGST: "",
    SGST: "",
    IGSTamt: "",
    CGSTamt: "",
    SGSTamt: "",
    NetAmount: "",
  });
  // function to handle any changes
  const onchangeHandler = (event) => {
    console.log(event.target.name);
    const value = event.target.value;
    setState({
      ...state,
      [event.target.name]: value,
    });
  };
  // function to handle onsubmit form request
  const onSubmithandler = (event) => {
    event.preventDefault();
  };
  //   useEffect to fetch the account names
  useEffect(() => {
    (async function fetchaccntname() {
      const result = await instance.get("FetchAll");

      setacctdata(result.data);
    })();
  }, []);

  const amountCalc = (e)=>{
    const amt = state.ActMts * e.target.value;
    setState({
      ...state,
      Amount:amt,
    });
  }
  return (
    <form onSubmit={onSubmithandler} className="form--greypurchase">
      <div className="main">
        <div className="firstline--greypurchase">
          <label>
            SrNo
            <input
              type="text"
              value={state.SrNo}
              name="SrNo"
              onChange={onchangeHandler}
            />
          </label>
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
              style={{ width: "150px" }}
              required
              value={state.BillDate}
              name="BillDate"
              onChange={onchangeHandler}
            />
          </label>
        </div>
        <div className="secondline--greypurchase">
          <label>Supplier</label>
          <select name="accntnames" onChange={onchangeHandler}>
            <option value="none" selected disabled>
              Account Name...
            </option>
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
          <label>Challan date</label>
          <input
            style={{ width: "150px" }}
            type="date"
            value={state.ChallanDate}
            name="challanDate"
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
              <option value="none" selected disabled>
                Item Name
              </option>
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
              onChange={onchangeHandler}
            />
          </label>
          <label>
            Rate
            <input
              type="number"
              name="Rate"
              value={state.Rate}
              onChange={onchangeHandler}
              onInput={amountCalc}
            />
          </label>
          <label>
            Amount
            <input
              type="number"
              name="Amount"
              value={state.Rate * state.ActMts}
              disabled
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
              value={state.DiscountAmt}
              onChange={onchangeHandler}
              disabled
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
              value={state.IGSTamt}
              onChange={onchangeHandler}
              disabled
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
              value={state.CGSTamt}
              onChange={onchangeHandler}
              disabled
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
              value={state.SGSTamt}
              onChange={onchangeHandler}
              disabled
            />
          </label>
        </div>
        <div className="seventline--greypurchase">
          <label>
            Net Amount
            <input
              type="number"
              disabled
              name="NetAmount"
              value={state.NetAmount}
              onChange={onchangeHandler}
            />
          </label>
          <button>Add Purchase</button>
          <button type="button">View all purchase</button>
        </div>
        <div className="greypurchase--table"></div>
      </div>
    </form>
  );
}

export default Greypurchase;
