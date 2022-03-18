import React, { useState, useEffect } from "react";
import styles from "../../../styles/AccountMaster.module.css";
import "react-widgets/styles.css";
import "../../../styles/Greypurchase.css";
import DropdownList from "react-widgets/DropdownList";
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
  const [accntdata, setacctdata] = useState([]); // for setting the account name returend in useEffect

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

  return (
    <form onSubmit={onSubmithandler}>
      <div className="main">
        <div className="firstline--greypurchase">
          <label>Sr No</label>
          <input type="text" required />
          <label>Purchase Type</label>
          <input type="text" required disabled value="Grey Purchase" />
          <label>Bill no</label>
          <input type="text" required />
          <label>Bill date</label>
          <input type="text" required />
        </div>
        <div className="secondline--greypurchase">
          <label>Supplier</label>
          <select
            className={`${styles["in-top-bar"]} ${styles["input-select"]}`}
            name="accntnames"
            onDoubleClick={() => {
              console.log("ufeefe");
            }}
          >
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
          <button>add account</button>
        </div>
      </div>
    </form>
  );
}

export default Greypurchase;
