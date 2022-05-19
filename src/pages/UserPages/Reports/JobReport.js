import React, { useEffect, useState } from "react";
import styles from "../../../styles/jobreport.module.css";
import styles2 from "../Mill/styles/Mill.module.css";
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
      accessor: "pieces",
      Filter:"",
    },
  ];
  const rowDisplayHandler = (cellData) => {
    if (cellData.row.values[cellData.column.id] == 1) {
        return <>Done</>;
    } else {
        return <>---</>;
    }
};
  const godownstockcol = [
    {
        Header: "Inventory ID",
        accessor: "InventoryID",
        Filter: "",
    },
    {
        Header: "Pieces",
        accessor: "pieces",
        Filter: "",
    },
    {
        Header: "Embroidery",
        Cell: (tableProps) => {
            return rowDisplayHandler(tableProps);
        },
        accessor: "Embroidery",
        Filter: "",
    },
    {
        Header: "Stone",
        Cell: (tableProps) => {
            return rowDisplayHandler(tableProps);
        },
        accessor: "Stone",
        Filter: "",
    },
    {
        Header: "Lace",
        Cell: (tableProps) => {
            return rowDisplayHandler(tableProps);
        },
        accessor: "Lace",
        Filter: "",
    },
];
    const [itemsentlist, setitemsentlist] = useState([]);
    const [itemreceivedlist,setitemreceivedlist] = useState([]);
    const [godownstock,setgodownstock] = useState([]);
    const [itemlist,setitemlist] = useState([]);



    const getSentItemList = async (jobtype) =>{
      try{
        const res = await reports.get(`/getitemsent/${jobtype}`);
        console.log(res.data);
        setitemsentlist(res.data);
      }catch(e){
        console.log(e);
      }
    }

    const getitemreceived = async (jobtype) =>{
      try{
        const res = await reports.get(`/getitemreceived/${jobtype}`);
        console.log(res.data);
        setitemreceivedlist(res.data);
      }catch(e){
        console.log(e);
      }
    }

    const getgodownstock = async (itemname)=>{
      try{
        const res = await reports.get(`/getgodownitem/${itemname}`);
        setgodownstock(res.data)
        console.log(res.data);
      }catch(e){
        console.log(e);
      }
    }

    const getitemlist = async () =>{
      try{
        const res = await reports.get("/getitemlist");
        setitemlist(res.data);
        console.log(res.data);
      }catch(e){
        console.log(e);
      }
    }

    const onChangeJobType = (e) =>{
        getSentItemList(e.target.value);
    } 

    useEffect(()=>{
      getitemlist();
    },[])

    const onChangeItemlist = (e) =>{
      getgodownstock(e.target.value);
    }

    return (
        <div className={styles["main"]}>
          <div className={styles["row"]}>
              <div className={styles["question"]}>
                1. Show &nbsp;
                <select onChange={onChangeItemlist} >
                    <option value="NaN">Select Item Name</option>
                    {itemlist.map((item,key)=>{
                      return <option key={key}value={item.itemName}>{item.itemName}</option>
                    })}
                </select>
                &nbsp; present in godown 
              </div>
                <StickyTable TableCol={godownstockcol} TableData={godownstock} style={{width:"752px"}}/>
            </div>
            <div className={styles["row"]}>
              <div className={styles["question"]}>
                1. Show items sent to &nbsp;
                <select onChange={onChangeJobType}  >
                    <option value="NaN">Select Work type</option>
                    <option value="Embroidery">Embroidery</option>
                    <option value="Stone">Stone Work</option>
                    <option value="Lace">Lace Work</option>
                </select>
              </div>
                <StickyTable TableCol={sentItemCol} TableData={itemsentlist} style={{width:"302px"}}/>
            </div>
            <div className={styles["row"]}>
              <div className={styles["question"]}>
                2. Show items received from &nbsp;
                <select onChange={(e)=>getitemreceived(e.target.value)}>
                    <option value="NaN">Select Work type</option>
                    <option value="Embroidery">Embroidery</option>
                    <option value="Stone">Stone Work</option>
                    <option value="Lace">Lace Work</option>
                </select>
              </div>
                <StickyTable TableCol={sentItemCol} TableData={itemreceivedlist} style={{width:"302px"}}/>
            </div>
        </div>
    );
}

export default JobReport;
