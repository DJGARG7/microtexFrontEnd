import React, { useEffect, useState } from "react";
import styles from "../../../styles/jobreport.module.css";
import StickyTable from "../../../components/Reuse_components/Table/StickyTable";
import Axios from 'axios';

Axios.defaults.withCredentials = true;
Axios.defaults.headers.common["userID"] = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails")).userID
    : "";

const reports = Axios.create({
    baseURL: "http://localhost:3005/reports/",
});
function JobReport() {
  const sentItemCol = [
    {
      Header:"Item Name",
      accessor: "itemName"
    },
    {
      Header:"Total Pieces",
      accessor: "pieces"
    },

  ]
    const [itemsentlist, setitemsentlist] = useState([]);
    const [itemlist, setitemlist] = useState([]);
    const [selectedjob,setselectedjob] = useState();
    



    const getSentItemList = async (jobtype) =>{
      try{
        const res = await reports.get(`/getitemsent/${jobtype}`);
        console.log(res.data);
        setitemsentlist(res.data);
      }catch(e){
        console.log(e);
      }
    }


    const onChangeJobType = (e) =>{
        getSentItemList(e.target.value);
    } 



    // useEffect(()=>{
      
    // },[])

    return (
        <div className={styles["main"]}>
            <div className={styles["row"]}>
              <div className={styles["question"]}>
                1. Show items sent to &nbsp;
                <select onChange={onChangeJobType}>
                    <option value="">Select Work type</option>
                    <option value="Embroidery">Embroidery</option>
                    <option value="Stone">Stone Work</option>
                    <option value="Lace">Lace Work</option>
                </select>
              </div>
                <StickyTable TableCol={sentItemCol} TableData={itemsentlist} style={{width:"302px"}}/>
            </div>
            <div className={styles["row"]}>
              <div className={styles["question"]}>
                2. Show items available in  &nbsp;
                <select onChange={onChangeJobType}>
                    <option value="">Select Work type</option>
                    <option value="Embroidery">Embroidery</option>
                    <option value="Stone">Stone Work</option>
                    <option value="Lace">Lace Work</option>
                </select>
              </div>
                <StickyTable TableCol={sentItemCol} TableData={itemsentlist} style={{width:"302px"}}/>
            </div>
        </div>
    );
}

export default JobReport;
