import { useState, useEffect } from "react";
import Modal from "../components/Modal/Modal";
import AccountTypeData from "../jsonData/AccountTypeData";
import styles from "../styles/AccountMaster.module.css";
import Axios from "axios";
import toast from "react-hot-toast";
import AccountMasterTable from "../components/Admin_components/AccountMasterTable";

if (localStorage.getItem("userDetails") != null)
  Axios.defaults.headers.common["userID"] = JSON.parse(
    localStorage.getItem("userDetails")
  ).userID;
Axios.defaults.withCredentials = true;
const instance = Axios.create({
  baseURL: "http://localhost:3003/accountMaster/",
});

const controller = new AbortController();

const AccountMaster = ({ userDetails }) => {

    
  const [isOpen, setIsOpen] = useState(false);

  const [isEntering, setIsEntering] = useState(true);
  const [uuid, setuuid] = useState(0);

  const [accName, setAccName] = useState("");
  const [accType, setType] = useState("none");

  const [addline1, setAddLine1] = useState("");
  const [addline2, setAddLine2] = useState("");
  const [addline3, setAddLine3] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [city, setCity] = useState("none");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [gstin, setGstin] = useState("");
  const [regDate, setRegDate] = useState("");
  const [propName, setPropName] = useState("");
  const [pan, setPan] = useState("");
  const [dist, setDist] = useState("");

  const [transport, setTransport] = useState("");

  const [openBal, setOpenBal] = useState(0);
  const [crdr, setCrdr] = useState("");

  const [beneficiary, setBeneficiary] = useState("");
  const [accNum, setAccNum] = useState(0);
  const [ifsc, setIfsc] = useState("");

  const [share, setShare] = useState(0);

  const [boolList, setBoolList] = useState([]);
  const [disMode, setDisMode] = useState(0);

  const [citydata, setcitydata] = useState([]);
  const buttonModes = {
    0: [
      { dis: true, label: "Delete" },
      { dis: false, label: "Add" },
      { dis: false, label: "View all data" },
      { dis: true, label: "Cancel" },
      { dis: false, label: "Exit" },
    ],
    1: [
      { dis: false, label: "Delete" },
      { dis: true, label: "Add" },
      { dis: false, label: "Edit" },
      { dis: true, label: "Cancel" },
      { dis: false, label: "Exit" },
    ],
    2: [
      { dis: true, label: "Delete" },
      { dis: false, label: "Save" },
      { dis: true, label: "Edit" },
      { dis: false, label: "Cancel" },
      { dis: false, label: "Exit" },
    ],
  };
  //fetch cities from cityService
  useEffect(() => {
    (async function fetchdata() {
      try {
        const res = await Axios.get(
          "http://localhost:3001/cityMaster/get"
          // {
          //     signal: controller.signal,
          // }
        );
        setcitydata(
          Object.keys(res.data).map((city) => {
            return res.data[city].CityName;
          })
        );
      } catch (e) {
        // if (e.name === "AbortError") return;
        toast.error("Error loading city data", {
          style: {
            borderRadius: "15px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    })();

    return () => {
      // controller.abort();
    };
  }, []);

  const changeHandler = (e) => {
    setBoolList(AccountTypeData[e.target.value]);
    setType(e.target.value);
  };

  const addSaveHandler = async (event) => {
    event.preventDefault();
    const data = {
      AccName: accName.trim(),
      AccType: accType.trim(),
      address1: addline1.trim(),
      address2: addline2.trim(),
      address3: addline3.trim(),
      city: city.trim(),
      pincode: pinCode,
      phoneNo: phone,
      email: email.trim(),
      GSTIN: gstin.trim(),
      RegDate: regDate,
      propName: propName.trim(),
      PAN: pan.trim(),
      dist: dist,
      transport: transport.trim(),
      openingBal: openBal,
      CrDr: crdr.trim(),
      beneName: beneficiary.trim(),
      AccountNum: accNum,
      IFSC: ifsc.trim(),
      shares: share,
    };
    if (disMode === 0) {
      // axios requet to add the data
      try {
        const res = await instance.post("postdata", data);
        setuuid(res.data.uuid);
        if (res.data.status == 1) {
          console.log("data added to db");
          toast.success("Account added successfully!", {
            style: {
              borderRadius: "15px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      } catch (error) {
        console.log(error);
        toast.error("Addition failed!", {
          style: {
            borderRadius: "15px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    }

    if (disMode === 2) {
      // axios request to update the data
      try {
        var res1 = await instance.post("updatedata", data);
      } catch (error) {
        console.log(error);
      }
      res1.then((res) => {
        console.log(res);
      });
      const status = res1.request.status;
      if (status === 200) console.log("data added to db");
      else alert("error occured");
    }
    setDisMode(1);
    setIsEntering(false);
  };
  const deleteHandler = async () => {
    // uuid i am getting when i add a data to the database and using it to delete that data from the database
    if (disMode === 1) {
      const data = {
        uuid: uuid,
      };
      // axios to delete the data
      try {
        const res = await instance.post("deletedata", data);
        if (res.data == 1) {
          toast.success("Deleted successfully!", {
            style: {
              borderRadius: "15px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      } catch (err) {
        console.log(err);
      }
      exitHandler();
    }
  };
  const editViewHandler = async () => {
    if (disMode === 0) {
      // select * all data in modal
      // const res = await instance.get("FetchAll");
      // console.log(res);
      setIsOpen(true);
    }
    if (disMode === 1) {
      setDisMode(2);
      setIsEntering(true);
    }
  };
  const cancelHandler = () => {
    if (disMode === 2) {
      setDisMode(1);
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
  const closeHandler = () => {
    setIsOpen(false);
  };
  const showHandler = (rowdetails) => {
    console.log(rowdetails);
    setDisMode(1);
    setIsEntering(false);
    setIsOpen(false);
    setAccName(rowdetails.AccName);
    setType(rowdetails.AccType);
    setBoolList(AccountTypeData[rowdetails.AccType]);
  };
  // console.log(isopen)
  return (
    <div className={styles["main"]}>
      <h2>Account Master</h2>
      <div className={styles["form-main"]}>
        <form onSubmit={addSaveHandler} className={styles["form"]}>
          <div className={styles["input-section"]}>
            <input
              type="text"
              name="AccName"
              value={accName}
              placeholder="Account Name"
              onChange={(e) => setAccName(e.target.value)}
              disabled={!isEntering}
              className={`${styles["input-text"]} ${styles["in-top-bar"]}`}
              required
            />
            <select
              className={`${styles["in-top-bar"]} ${styles["input-select"]}`}
              name="AccType"
              value={accType}
              onChange={changeHandler}
              disabled={!isEntering}
            >
              <option value="none" disabled hidden>
                Account type...
              </option>
              {Object.keys(AccountTypeData).map((key1) => {
                return (
                  <option value={key1} key={key1}>
                    {key1}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={styles["input-grid"]}>
            {boolList.includes("AddressGroup") && (
              <div className={styles["input-group"]}>
                <h3 className={styles["input-group-title"]}>Address</h3>
                <input
                  type="text"
                  name="addline1"
                  value={addline1}
                  placeholder="Address line 1"
                  onChange={(e) => setAddLine1(e.target.value)}
                  //required
                  className={styles["input-text"]}
                  disabled={!isEntering}
                />
                <input
                  type="text"
                  name="addline2"
                  value={addline2}
                  placeholder="Address line 2"
                  onChange={(e) => setAddLine2(e.target.value)}
                  className={styles["input-text"]}
                  //required
                  disabled={!isEntering}
                />
                <input
                  type="text"
                  name="addline2"
                  value={addline3}
                  placeholder="Address line 3"
                  onChange={(e) => setAddLine3(e.target.value)}
                  className={styles["input-text"]}
                  //required
                  disabled={!isEntering}
                />
                <select
                  name="cityName"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!isEntering}
                  className={styles["input-select"]}
                >
                  <option value="none" disabled hidden>
                    City...
                  </option>
                  {citydata.map((city) => {
                    return <option value={city}>{city}</option>;
                  })}
                </select>
                <input
                  type="text"
                  name="pincode"
                  value={pinCode}
                  placeholder="Pincode"
                  onChange={(e) => setPinCode(e.target.value)}
                  pattern="[0-9]{6}"
                  className={styles["input-text"]}
                  //required
                  disabled={!isEntering}
                />
              </div>
            )}
            {boolList.includes("ContactGroup") && (
              <div className={styles["input-group"]}>
                <h3 className={styles["input-group-title"]}>Contact</h3>
                <input
                  type="text"
                  name="Phone number"
                  value={phone}
                  placeholder="Phone No."
                  onChange={(e) => setPhone(e.target.value)}
                  className={styles["input-text"]}
                  //required
                  disabled={!isEntering}
                />
                <input
                  type="text"
                  name="Email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles["input-text"]}
                  //required
                  disabled={!isEntering}
                />
              </div>
            )}

            {boolList.includes("GstGroup") && (
              <div className={styles["input-group"]}>
                <h3 className={styles["input-group-title"]}>GST Information</h3>
                <input
                  type="text"
                  name="gstin"
                  value={gstin}
                  placeholder="GSTIN"
                  onChange={(e) => setGstin(e.target.value)}
                  className={styles["input-text"]}
                  //required
                  disabled={!isEntering}
                />
                <input
                  type="date"
                  name="RegDate"
                  value={regDate}
                  placeholder="Registration date"
                  onChange={(e) => setRegDate(e.target.value)}
                  className={styles["input-text"]}
                  //required
                  disabled
                />
                <input
                  type="text"
                  name="propName"
                  value={propName}
                  placeholder="prop Name"
                  onChange={(e) => setPropName(e.target.value)}
                  className={styles["input-text"]}
                  //required
                  disabled
                />
                <input
                  type="text"
                  name="PAN"
                  value={pan}
                  placeholder="PAN"
                  onChange={(e) => setPan(e.target.value)}
                  className={styles["input-text"]}
                  //required
                  disabled
                />
                <input
                  type="text"
                  name="dist"
                  value={dist}
                  placeholder="Distance"
                  onChange={(e) => setDist(e.target.value)}
                  className={styles["input-text"]}
                  pattern="[0-9]*"
                  //required
                  disabled
                />
              </div>
            )}
            {boolList.includes("transport") && (
              <div className={styles["input-group"]}>
                <h3 className={styles["input-group-title"]}>
                  Transport Information
                </h3>
                <input
                  type="text"
                  name="transport"
                  value={transport}
                  placeholder="Transport"
                  onChange={(e) => setTransport(e.target.value)}
                  className={styles["input-text"]}
                  //required
                  disabled={!isEntering}
                />
              </div>
            )}
            {boolList.includes("OBGroup") && (
              <div className={styles["input-group"]}>
                <h3 className={styles["input-group-title"]}>Opening Balance</h3>
                <input
                  type="number"
                  name="openBal"
                  value={openBal}
                  placeholder="Opening Bal"
                  onChange={(e) => setOpenBal(e.target.value)}
                  className={styles["input-text"]}
                  //required
                  disabled={!isEntering}
                />
                <select
                  name="crdr"
                  value={crdr}
                  onChange={(e) => setCrdr(e.target.value)}
                  className={styles["input-select"]}
                  disabled={!isEntering}
                >
                  <option value="none" disabled hidden>
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
                <h3 className={styles["input-group-title"]}>
                  Bank Information
                </h3>
                <input
                  type="text"
                  name="beneficiary"
                  value={beneficiary}
                  placeholder="beneficiary name"
                  onChange={(e) => setBeneficiary(e.target.value)}
                  className={styles["input-text"]}
                  //required
                  disabled={!isEntering}
                />
                <input
                  type="number"
                  name="accNum"
                  value={accNum}
                  placeholder="Account Number"
                  onChange={(e) => setAccNum(e.target.value)}
                  className={styles["input-text"]}
                  //required
                  disabled={!isEntering}
                />
                <input
                  type="text"
                  name="ifsc"
                  value={ifsc}
                  placeholder="IFSC code"
                  onChange={(e) => setIfsc(e.target.value)}
                  className={styles["input-text"]}
                  //required
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
                  className={styles["input-text"]}
                  //required
                  disabled={!isEntering}
                  min={0}
                  max={100}
                />
              </div>
            )}
          </div>
          <button
            disabled={buttonModes[disMode][1].dis}
            className={`${styles["add-btn"]} ${styles["btn"]}`}
          >
            {buttonModes[disMode][1].label}
          </button>
        </form>
        <div className={styles["button-group"]}>
          <button
            disabled={buttonModes[disMode][0].dis}
            onClick={deleteHandler}
            className={`${styles["btn"]} ${styles["del-btn"]}`}
          >
            {buttonModes[disMode][0].label}
          </button>

          <button
            disabled={buttonModes[disMode][2].dis}
            onClick={editViewHandler}
            className={`${styles["btn"]} ${styles["view-all-data-btn"]}`}
          >
            {buttonModes[disMode][2].label}
          </button>
          <button
            disabled={buttonModes[disMode][3].dis}
            onClick={cancelHandler}
            className={`${styles["btn"]} ${styles["del-btn"]}`}
          >
            {buttonModes[disMode][3].label}
          </button>
          <button
            disabled={buttonModes[disMode][4].dis}
            onClick={exitHandler}
            className={`${styles["btn"]} ${styles["del-btn"]}`}
          >
            {buttonModes[disMode][4].label}
          </button>
        </div>
      </div>
      <Modal open={isOpen} onClose={closeHandler}>
        <AccountMasterTable showclick={showHandler} />
      </Modal>
    </div>
  );
};
export default AccountMaster;
