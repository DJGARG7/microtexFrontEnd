import React from "react";
import TableComponent from "../components/Admin_components/TableComponent";
import { useState } from "react";
import "../styles/CityMaster.css";
import CityData from "../jsonData/CityData";


const TableColData = [
  {
    Header: "City Name",
    accessor: "cityname",
  },
  {
    Header: "State Name",
    accessor: "statename",
  },
];

function CityMasterAdd(props) {
  const [tabledata, setTabledata] =  useState(CityData)
  const [city, setCitychange] =  useState('')
  const [state, setStatechange] =  useState('')

  const cityHandler = (event) => {
    setCitychange(event.target.value);
  };
  const stateHandler = (event) => {
    setStatechange(event.target.value);
  };
  const onClickHandler = (event) => {
    event.preventDefault();
    const newData = 
      {
        cityname: city,
        statename: state
      }
      
    setTabledata(preExpense=>{
      return [...preExpense,newData];
    })
  }
  return (
    <div className="Citymaster">
      <div className="Inputs">
        <form onSubmit={onClickHandler}>
          <lable>City Name</lable> <input type="text" onChange={cityHandler} value = {city}></input>
          <lable>State Name</lable> <input type="text" onChange={stateHandler} value = {state}></input>
          <button> Add </button>
        </form>
      </div>
      <div className="table">
        <TableComponent TableCol={TableColData} TableData={tabledata} />
      </div>
    </div>
  );
}

export default CityMasterAdd;
