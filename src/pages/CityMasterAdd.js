import React from "react";
import TableComponent from "../components/Admin_components/TableComponent";
import { useState, useEffect } from "react";
import "../styles/CityMaster.css";
import CityData from "../jsonData/CityData";
import Axios from "axios";

function CityMasterAdd({ props }) {
  const [tabledata, setTabledata] = useState(CityData);
  const [city, setCitychange] = useState("");
  const [state, setStatechange] = useState("");
  const submitData = () => {
    Axios.post("http://localhost:3001/cityMaster/Add", {
      City: city,
      State: state,
    })
  };
  useEffect(() => {
    Axios.get("http://localhost:3001/cityMaster/Add").then((res) => {
      setTabledata(res.data);
    });
  }, []);
  const TableColData = [
    {
      Header: "City Name",
      accessor: "CityName",
    },
    {
      Header: "State Name",
      accessor: "StateName",
    },
    {
      Header: "Action",
      accessor: (str) => "delete",
      Cell: (tableProps) => (
        <div>
          <button
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              Axios.post("http://localhost:3001/cityMaster/Delete", {
                City: tableProps.row.values.CityName,
              });
              const dataCopy = [...tabledata];
              dataCopy.splice(tableProps.row.index, 1);
              setTabledata(dataCopy);
            }}
          >
            Delete
          </button>
          <button
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              console.log(tableProps);
              const dataCopy = [...tabledata];
              dataCopy.splice(tableProps.row.index, 1);
              console.log(dataCopy);
              setTabledata(dataCopy);
            }}
          >
            Edit
          </button>
        </div>
      ),
    },
  ];
  const cityHandler = (event) => {
    setCitychange(event.target.value);
  };
  const stateHandler = (event) => {
    setStatechange(event.target.value);
  };
  const onClickHandler = (event) => {
    event.preventDefault();
    const newData = {
      CityName: city,
      StateName: state,
    };

    setTabledata((preExpense) => {
      return [...preExpense, newData];
    });
  };
  return (
    <div className="Citymaster">
      <div className="Inputs">
        <form onSubmit={onClickHandler}>
          <label>City Name</label>{" "}
          <input type="text" onChange={cityHandler} value={city}></input>
          <label>State Name</label>{" "}
          <input type="text" onChange={stateHandler} value={state}></input>
          <button onClick={submitData}> Add </button>
        </form>
      </div>
      <div className="table">
        <TableComponent TableCol={TableColData} TableData={tabledata} />
      </div>
    </div>
  );
}

export default CityMasterAdd;
