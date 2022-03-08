import { useState, useEffect } from "react";
import AccountTypeData from "../jsonData/AccountTypeData";
import styles from "../styles/AccountMaster.module.css";
import Axios from "axios";
const instance = Axios.create({
  baseURL: "http://localhost:3003/accountMaster/",
  headers: {
    authtoken: "djnnbfn",
  },
});
var oldaccountname;

const AccountMaster = ({ userDetails }) => {
  const headers = {
    accessToken: userDetails.token,
  };
  const [isEntering, setIsEntering] = useState(true);

  const [accName, setAccName] = useState("");
  const [accType, setType] = useState("none");

  const [addline1, setAddLine1] = useState("");
  const [addline2, setAddLine2] = useState("");
  const [addline3, setAddLine3] = useState("");
  const [pinCode, setPinCode] = useState(0);
  const [city, setCity] = useState("");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [gstin, setGstin] = useState("");
  const [regDate, setRegDate] = useState("");
  const [propName, setPropName] = useState("");
  const [pan, setPan] = useState("");
  const [dist, setDist] = useState("");

  const [transport, setTransport] = useState("");

  const [openBal, setOpenBal] = useState("");
  const [crdr, setCrdr] = useState("");

  const [beneficiary, setBeneficiary] = useState("");
  const [accNum, setAccNum] = useState("");
  const [ifsc, setIfsc] = useState("");

  const [share, setShare] = useState(0);

  const [boolList, setBoolList] = useState([]);
  const [disMode, setDisMode] = useState(0);

  const [citydata, setcitydata] = useState([]);
  const buttonModes = {
    0: [
      { dis: true, label: "delete" },
      { dis: false, label: "add" },
      { dis: false, label: "view all data" },
      { dis: true, label: "cancel" },
      { dis: false, label: "exit" },
    ],
    1: [
      { dis: false, label: "delete" },
      { dis: true, label: "add" },
      { dis: false, label: "edit" },
      { dis: true, label: "cancel" },
      { dis: false, label: "exit" },
    ],
    2: [
      { dis: true, label: "delete" },
      { dis: false, label: "save" },
      { dis: true, label: "edit" },
      { dis: false, label: "cancel" },
      { dis: false, label: "exit" },
    ],
  };
  //from city service in useeffect
  var data1 = [];
  useEffect(() => {
    (async function fetchdata() {
      try {
        const res = await Axios.post(
          "http://localhost:3001/cityMaster/getdata",
          {
            firmname: userDetails.c_id,
          },
          {
            headers: headers,
          }
        );
        for (var ch in res.data) {
          // console.log(res.data[ch].CityName);
          data1.push(res.data[ch].CityName);
        }
        setcitydata(data1);
        console.log("inside useeffect", data1);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [userDetails.token]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(accName);
    console.log(accType);
    console.log(boolList);
  };
  const changeHandler = (e) => {
    setBoolList(AccountTypeData[e.target.value]);
    setType(e.target.value);
  };
  const deleteHandler = async () => {
    if (disMode === 1) {
      // sanity check
      if (!accName || accType === "none") {
        alert("Enter account name or select account type");
        return;
      }
      const data = {
        accountname: accName,
      };
      // axios to delete the data
      try {
        var res = await instance.post("deletedata", data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
      console.log("deleted from database");
      exitHandler();
    }
  };
  const addSaveHandler = async () => {
    // sanity check
    if (!accName || accType === "none") {
      alert("Enter account name or select account type");
      return;
    }
    //getting required data to send the request
    const data = {
      accountname: accName.trim(),
      accounttype: accType.trim(),
      address_1: addline1.trim(),
      address_2: addline2.trim(),
      address_3: addline3.trim(),
      city: city.trim(),
      pincode: pinCode,
    };
    if (disMode === 0) {
      oldaccountname = accName.trim();
      console.log(data);
      // axios requet to add the data
      try {
        var res = await instance.post("postdata", data);
      } catch (error) {
        console.log(error);
      }
      const status = res.request.status;
      if (status === 200) console.log("data added to db");
      else console.log("error occured");
    }
    if (disMode === 2) {
      const data1 = {
        ...data,
        oldaccountname: oldaccountname,
      };
      // axios request to update the data
      try {
        var res1 = await instance.post("updatedata", data1);
      } catch (error) {
        console.log(error);
      }
      const status = res1.request.status;
      if (status === 200) console.log("data added to db");
      else console.log("error occured");
    }
    setDisMode(1);
    setIsEntering(false);
  };
  const editViewHandler = () => {
    if (disMode === 0) {
      // select * all data in modal
      console.log("data displayed in modal");
    }
    if (disMode === 1) {
      setDisMode(2);
      setIsEntering(true);
    }
  };
  const cancelHandler = () => {
    if (disMode === 2) {
      setDisMode(1);
      setAccName(oldaccountname);
      setIsEntering(false);
    }
  };
  const exitHandler = () => {
    // return to default screen like on reload
    setDisMode(0);
    setType("none");
    setBoolList([]);
    setIsEntering(true);
    setAccName("");
  };

  return (
    <div className={styles["main"]}>
      <h2 className={styles["title"]}>This is Account Master</h2>

      <form onSubmit={addSaveHandler} className={styles["form"]}>
        <div className={styles["input-section"]}>
          <input
            type="text"
            name="AccName"
            value={accName}
            placeholder="Account Name"
            onChange={(e) => setAccName(e.target.value)}
            disabled={!isEntering}
            required
          />
          <select
            name="AccType"
            value={accType}
            onChange={changeHandler}
            disabled={!isEntering}
          >
            <option value="none" selected disabled hidden>
              Select AccType
            </option>
            {Object.keys(AccountTypeData).map((key1) => {
              return <option value={key1}>{key1}</option>;
            })}
          </select>
        </div>
        <div className={styles["input-grid"]}>
          {boolList.includes("AddressGroup") && (
            <div className={styles["input-group"]}>
              <input
                type="text"
                name="addline1"
                value={addline1}
                placeholder="Address line1"
                onChange={(e) => setAddLine1(e.target.value)}
                required
                disabled={!isEntering}
              />
              <input
                type="text"
                name="addline2"
                value={addline2}
                placeholder="Address line2"
                onChange={(e) => setAddLine2(e.target.value)}
                required
                disabled={!isEntering}
              />
              <input
                type="text"
                name="addline2"
                value={addline3}
                placeholder="Address line3"
                onChange={(e) => setAddLine3(e.target.value)}
                required
                disabled={!isEntering}
              />
              <select
                name="cityName"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!isEntering}
              >
                <option value="none" selected disabled hidden>
                  Select City
                </option>
                {citydata.map((city) => {
                  return <option value={city}>{city}</option>;
                })}
              </select>
              <input
                type="number"
                name="pincode"
                value={pinCode}
                placeholder="pincode"
                onChange={(e) => setPinCode(e.target.value)}
                min={100000}
                max={999999}
                required
                disabled={!isEntering}
              />
            </div>
          )}
          {boolList.includes("ContactGroup") && (
            <div className={styles["input-group"]}>
              <input
                type="text"
                name="Phone No."
                value={phone}
                placeholder="Phone No."
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={!isEntering}
              />
              <input
                type="text"
                name="Email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!isEntering}
              />
            </div>
          )}

          {boolList.includes("GstGroup") && (
            <div className={styles["input-group"]}>
              <input
                type="text"
                name="gstin"
                value={gstin}
                placeholder="GSTIN"
                onChange={(e) => setGstin(e.target.value)}
                required
                disabled={!isEntering}
              />
              <input
                type="text"
                name="RegDate"
                value={regDate}
                placeholder="RegDate"
                onChange={(e) => setRegDate(e.target.value)}
                required
                disabled
              />
              <input
                type="text"
                name="propName"
                value={propName}
                placeholder="prop Name"
                onChange={(e) => setPropName(e.target.value)}
                required
                disabled
              />
              <input
                type="text"
                name="PAN"
                value={pan}
                placeholder="PAN no."
                onChange={(e) => setPan(e.target.value)}
                required
                disabled
              />
              <input
                type="number"
                name="dist"
                value={dist}
                placeholder="Distance"
                onChange={(e) => setDist(e.target.value)}
                required
                disabled
              />
            </div>
          )}
          {boolList.includes("transport") && (
            <div className={styles["input-group"]}>
              <input
                type="text"
                name="transport"
                value={transport}
                placeholder="Transport"
                onChange={(e) => setTransport(e.target.value)}
                required
                disabled={!isEntering}
              />
            </div>
          )}
          {boolList.includes("OBGroup") && (
            <div className={styles["input-group"]}>
              <input
                type="number"
                name="openBal"
                value={openBal}
                placeholder="Opening Bal"
                onChange={(e) => setOpenBal(e.target.value)}
                required
                disabled={!isEntering}
              />
              <select
                name="crdr"
                value={crdr}
                onChange={(e) => setCrdr(e.target.value)}
                disabled={!isEntering}
              >
                <option value="none" selected disabled hidden>
                  Cr./Dr.
                </option>
                <option value="CR">Cr.</option>
                <option value="DR">Dr.</option>
                {/* {CityData.map((city) => {
                                    return <option value={city}>{city}</option>;
                                })} */}
              </select>
            </div>
          )}
          {boolList.includes("bankdetail") && (
            <div className={styles["input-group"]}>
              <input
                type="text"
                name="beneficiary"
                value={beneficiary}
                placeholder="beneficiary name"
                onChange={(e) => setBeneficiary(e.target.value)}
                required
                disabled={!isEntering}
              />
              <input
                type="number"
                name="accNum"
                value={accNum}
                placeholder="Account Number"
                onChange={(e) => setAccNum(e.target.value)}
                required
                disabled={!isEntering}
              />
              <input
                type="text"
                name="ifsc"
                value={ifsc}
                placeholder="IFSC code"
                onChange={(e) => setIfsc(e.target.value)}
                required
                disabled={!isEntering}
              />
            </div>
          )}
          {/* {boolList.includes("GstCat") && <p>GstCat</p>} */}
          {boolList.includes("shares") && (
            <div className={styles["input-group"]}>
              <input
                type="number"
                name="share"
                value={share}
                placeholder="Share %"
                onChange={(e) => setShare(e.target.value)}
                required
                disabled={!isEntering}
                min={0}
                max={100}
              />
            </div>
          )}
        </div>
        <button disabled={buttonModes[disMode][1].dis} onClick={addSaveHandler}>
          {buttonModes[disMode][1].label}
        </button>
      </form>
      <div className={styles["button-group"]}>
        <button disabled={buttonModes[disMode][0].dis} onClick={deleteHandler}>
          {buttonModes[disMode][0].label}
        </button>

        <button
          disabled={buttonModes[disMode][2].dis}
          onClick={editViewHandler}
        >
          {buttonModes[disMode][2].label}
        </button>
        <button disabled={buttonModes[disMode][3].dis} onClick={cancelHandler}>
          {buttonModes[disMode][3].label}
        </button>
        <button disabled={buttonModes[disMode][4].dis} onClick={exitHandler}>
          {buttonModes[disMode][4].label}
        </button>
      </div>
    </div>
  );
};
export default AccountMaster;
