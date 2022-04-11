import React, { useState, useEffect } from "react";
import "react-widgets/styles.css";
import "../../styles/Greypurchase.css";
import Modal from "../../components/Reuse_components/Modal";
import Axios from "axios";
import {
  toastError,
  toastSuccess,
} from "../../components/Reuse_components/toast";
import StickyTable from "../../components/Reuse_components/Table/StickyTable";

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
  baseURL: "http://localhost:3005/userservice/",
});

function Greypurchase({ userDetails }) {
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
      width: "90px",
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
      Header: "Challan No",
      accessor: "ChallanNo",
      Filter: "",
    },
    {
      Header: "ChallanDate",
      accessor: "ChallanDate",
    },
    {
      Header: "ItemName",
      accessor: "ItemName",
      Filter: "",
    },

    {
      Header: "Mts",
      accessor: "Mts",
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
  ];

  const [isAllowed, setIsAllowed] = useState(false);

  const checkPermission = async () => {
    try {
      const res = await Axios.get(
        `http://localhost:3002/permissions/${userDetails.uuid}/1`
      );

      setIsAllowed(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // col data for purchased items
  const purchasedListCol = [
    {
      Header: "Action",
      accessor: (str) => "delete",
      Cell: (tableProps) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            "justify-content": "center",
          }}
        >
          <button
            style={{
              cursor: "pointer",
            }}
            type="submit"
            onClick={() => {
              settotalamount((preamount) => {
                return parseInt(
                  preamount - purchaseditems[tableProps.row.index].Amount
                );
              });
              setpurchaseditems((prestate) => {
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
      maxWidth: 100,
      minWidth: 100,
      width: 100,
    },
    {
      Header: "Unique Id",
      accessor: "uid",
      show: false,
      maxWidth: 10,
      minWidth: 60,
      width: 40,
    },
    {
      Header: "Item",
      accessor: "ItemName",
      Filter: "",
      maxWidth: 250,
      minWidth: 200,
      width: 100,
    },
    {
      Header: "Mts",
      accessor: "Mts",
      Filter: "",
      maxWidth: 150,
      minWidth: 100,
      width: 100,
    },
    {
      Header: "Rate",
      Filter: "",
      accessor: "Rate",
      maxWidth: 150,
      minWidth: 100,
      width: 40,
    },
    {
      Header: "Amount",
      accessor: "Amount",
      Filter: "",
      maxWidth: 150,
      minWidth: 100,
      width: 100,
    },
  ];

  // For getting the current date
  function convertDate(inputFormat) {
    function pad(s) {
      return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
  }

  const date = convertDate(new Date());

  const [totalamount, settotalamount] = useState(0); // THIS IS THE FINAL AMOUNT OF THE BILL

  const [tabledata, settabledata] = useState([]); // for modal table
  const [purchaseditems, setpurchaseditems] = useState([]); // list of purchased items


  const [accntdata, setacctdata] = useState([]); // for setting the account name returend in useEffect
  const [state, setState] = useState({
    BillNo: "",
    BillDate: date,
    accntnames: "",
    ChallanNo: "",
    ChallanDate: date,
    ItemName: "",
    Mts: "",
    Rate: "",
    Amount: "",
    Discount: "",
    DiscountAmt: "",
    NetAmount: "",
  });

  // useeffect to upadte the data
  useEffect(() => {
    const dis =
      Math.round(
        ((state.Discount / 100) * state.Amount + Number.EPSILON) * 100
      ) / 100;
    setState({
      ...state,
      Amount: state.Rate * state.Mts,
      DiscountAmt: dis,
    });
  }, [state.Rate, state.Mts, state.Discount]);

  // for adding a new item
  const [itemdetails, setItemdetails] = useState({
    itemname: "",
    openingmts: "",
    ratepermts: "",
  });

  // list of items to choose that will render from backend
  const [listofitems, setlistofitems] = useState([]);

  const [greyitemadd, setgretitemadd] = useState(false); //toggles modal for greyitem adder
  const [modalstate, setmodalstate] = useState(false); // use state to handle modal toggle
  // function to handle any changes
  const onchangeHandler = (event) => {
    let value = event.target.value;
    if (!Number.isNaN(parseFloat(value))) {
        console.log("float")
      value = parseFloat(value);
    }
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

    const newItem = {
      ItemName: state.ItemName,
      Mts: state.Mts,
      Rate: state.Rate,
      Amount: parseFloat(document.getElementById("NetAmount").value),
      BillNo: state.BillNo,
      Discount: state.Discount,
    };
    setpurchaseditems((preitems) => {
      return [...preitems, newItem];
    });

    if (1) {
      toastSuccess("Item Added to the list!");
      settotalamount((presamount) => {
        return parseInt(presamount + newItem.Amount);
      });
      setState({
        ...state,
        ItemName: "",
        Mts: "",
        Rate: "",
        Amount: "",
        Discount: "",
        NetAmount: "",
        DiscountAmt: "",
      });
    }
  };

  //   useEffect to fetch the account names
  useEffect(() => {
    (async function fetchaccntname() {
      let accType = "Sundry Creditors";
      const result = await accinstance.get(`${accType}`);
      const items = await usrinstance.get("fetchitems");

      setlistofitems(items.data);
      setacctdata(result.data);
    })();
    checkPermission();
  }, []);

  // if edit is selected when the edit button is clicked on the table
  const onEditHandler = (tableprops) => {
    setmodalstate(false);
  };

  //to handle greyitem add handler
  const greyitemcloseHandler = () => {
    setgretitemadd(false);
  };

  const onMainSubmit = async () => {
    const datasend = {
      state,
      purchaseditems,
      totalamount,
    };
    const res = await usrinstance.post("addbilldetails", datasend); // adds data about the bill
    
    if (res.data.status === "1") {
      toastSuccess("Bill added successfully!");
      setState({
        ...state,
        BillNo: "",
        accntnames: "",
        ChallanNo:state.ChallanNo+1
      });
      setpurchaseditems([]);
      settotalamount(0);
    } else {
      toastError(`Error ${res.data.sqlMessage}`);
    }
  };

  // useeffct to set challan No
  useEffect(() => {
    (async () => {
      const challanNo = await usrinstance.get("fetchChallanNo");
      let varChallan = 0;
      if (challanNo.data[0].challanNo !== null)
        varChallan = challanNo.data[0].challanNo;
      setState({
        ...state,
        ChallanNo: varChallan + 1,
      });
    })();
  }, [settotalamount]);

  // handles when new item is added to the db
  const onItemaddform = async (e) => {
    e.preventDefault();
    const res = await usrinstance.post("additems", itemdetails);
    if (res.data.status === "1") {
      toastSuccess("Item added successfully!");
    } else {
      toastError(`Error ${res.data.sqlMessage}`);
    }
    greyitemcloseHandler();
    const items = await usrinstance.get("fetchitems");
    setlistofitems(items.data);
  };

  // when view all pucrchased isclicked
  const onViewBillhandler = async () => {
    setmodalstate(true);
    const res = await usrinstance.get("fetchGreyBills");
    console.log(res);
    res.data.forEach((item, index) => {
      const date = new Date(item.BillDate);
      const date2 = new Date(item.ChallanDate);
      item.BillDate = date.toLocaleDateString();
      item.ChallanDate = date2.toLocaleDateString();
    });
    settabledata(res.data);
  };

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

  return (
    <div>
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
                type="number"
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
            <label>
              Supplier
              <select
                name="accntnames"
                onChange={onchangeHandler}
                required
                value={state.accntnames}
              >
                <option value="">Account Names</option>
                {accntdata &&
                  !!accntdata.length &&
                  accntdata.map((acct, index) => {
                    return (
                      <option value={acct.AccName} key={index}>
                        {acct.AccName}
                      </option>
                    );
                  })}
              </select>
            </label>
            <label>
              Challan No.
              <input
                type="text"
                value={state.ChallanNo}
                name="ChallanNo"
                disabled
                required
                onChange={onchangeHandler}
              />
            </label>
            <label>
              Item Name
              <select
                name="ItemName"
                value={state.ItemName}
                onChange={onchangeHandler}
                required
              >
                <option value="" id="">Item Names</option>
                {listofitems &&
                  !!listofitems.length &&
                  listofitems.map((item) => {
                    return (
                      <option value={item.itemname} key={item.uuid} id={item.uuid}>
                        {item.itemname}
                      </option>
                    );
                  })}
              </select>
              <button
                type="button"
                onClick={() => {
                  setgretitemadd(true);
                }}
              >
                Add Item
              </button>
            </label>
          </div>
          <div className="fifthline--greypurchase">
            <label>
              Mts
              <input
                type="number"
                name="Mts"
                value={parseInt(state.Mts)}
                id="mts"
                required
                min="0"
                onChange={onchangeHandler}
              />
            </label>
            <label>
              Rate
              <input
                type="number"
                id="rate"
                name="Rate"
                min="0"
                value={parseInt(state.Rate)}
                onChange={onchangeHandler}
              />
            </label>
            <label>
              Amount
              <input
                type="number"
                name="Amount"
                value={state.Amount}
                readOnly
                id="Amount"
                required
                disabled
              />
            </label>
          </div>
          <div className="sixthline--greypurchase">
            <label>
              Discount (%)
              <input
                type="number"
                name="Discount"
                value={state.Discount}
                onChange={onchangeHandler}
                min="0"
                max="100"
              />
              <input
                type="text"
                name="DiscountAmt"
                id="DiscountAmt"
                readOnly
                value={state.DiscountAmt}
                disabled
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
                value={state.Amount - state.DiscountAmt}
                disabled
                required
              />
            </label>
            <input type="submit" value="Add Purchase" />
            <button onClick={onViewBillhandler} type="button">
              View all purchase
            </button>
          </div>
          <Modal open={modalstate} onClose={closeHandler}>
            <StickyTable
              TableCol={TableColData}
              TableData={tabledata}
              style={{
                maxWidth: "1000px",
                width: "900px",
                maxHeight: "500px",
                border: "1px Solid black",
                borderRadius: "10px",
              }}
            />
          </Modal>
          <div className="greypurchase--itemtable">
            <StickyTable
              TableCol={purchasedListCol}
              TableData={purchaseditems}
              style={{
                marginLeft: "70px",
                width: "602px",
                border: "1px Solid black",
                borderRadius: "10px",
              }}
            />
          </div>
        </div>
        <div className="form--button">
          <label>
            Final Amount:
            <input
              type="text"
              disabled
              placeholder="Total Amount"
              value={totalamount}
            />
          </label>
          <button type="button" onClick={onMainSubmit}>
            Save Purchases
          </button>
        </div>
      </form>
      <Modal open={greyitemadd} onClose={greyitemcloseHandler}>
        <form className="greypurchase--itemadd" onSubmit={onItemaddform}>
          <label>
            Item Name:
            <input
              type="text"
              required
              value={itemdetails.itemname}
              onChange={(e) =>
                setItemdetails({
                  ...itemdetails,
                  itemname: e.target.value,
                })
              }
            />
          </label>
          <label>
            Opening Mts:
            <input
              type="number"
              value={itemdetails.openingmts}
              onChange={(e) =>
                setItemdetails({
                  ...itemdetails,
                  openingmts: e.target.value,
                })
              }
            />
          </label>
          <label>
            Rate per Mts:
            <input
              type="number"
              value={itemdetails.ratepermts}
              onChange={(e) =>
                setItemdetails({
                  ...itemdetails,
                  ratepermts: e.target.value,
                })
              }
            />
          </label>
          
          
          <button>Add item</button>
        </form>
      </Modal>
    </div>
  );
}

export default Greypurchase;
