import React from "react";
import TableComponent from "../components/Admin_components/TableComponent";
import { useState, useEffect } from "react";
import "../styles/CityMaster.css";
import Axios from "axios";
let index, oldcity;
function CityMaster({ c_id }) {
  const [tabledata, setTabledata] = useState([]);
  const [city, setCitychange] = useState("");
  const [state, setStatechange] = useState("");
  const [editMode, setEditMode] = useState(false);
  // for gettig the data when the page loads for the first time
  useEffect(() => { 
    (async function (){
      try{
        const res = await Axios.get("http://localhost:3001/cityMaster/Add",{
          firmname : c_id
        })
        setTabledata(res.data);
      }
      catch(e){
        console.log(e);
      }
  })()
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
              const dataCopy = [...tabledata];
              console.log(dataCopy);
              setEditMode(true);
              setCitychange(dataCopy[tableProps.row.index].CityName);
              setStatechange(dataCopy[tableProps.row.index].StateName);
              // captures the city name and index of the row selected for editing and stores them globally which is used in onClickhandler funtion
              index = tableProps.row.index;
              oldcity = dataCopy[tableProps.row.index].CityName;
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

  // funtion executes when the form is submitted
  const onClickHandler = (event) => {
    event.preventDefault();
    if (city.length === 0) return alert("Enter City Name");
    if (state.length === 0) return alert("Enter State Name");
    const newData = {
      CityName: city.trim(),
      StateName: state.trim(),
    };
    // checks wether the mode is edit or not if edit --> updates the exsisting selected row in the table and if !edit-> adds new data into the table if not present.
    if (editMode) {
      setTabledata((preExpense) => {
        for (const i in preExpense) {
          if (
            preExpense[i].CityName.toLowerCase() ===
            newData.CityName.toLowerCase()
          ) {
            alert("City present");
            return [...preExpense];
          }
        }
        // updates the backend table
        Axios.post("http://localhost:3001/cityMaster/Update", {
          City: city.trim(),
          State: state.trim(),
          oldcity: oldcity.trim(),
        });
        preExpense[index].CityName = newData.CityName;
        preExpense[index].StateName = newData.StateName;
        setEditMode(false);
        return [...preExpense];
      });
    } else {
      setTabledata((preExpense) => {
        for (const i in preExpense) {
          if (
            preExpense[i].CityName.toLowerCase() ===
            newData.CityName.toLowerCase()
          ) {
            alert("City present");
            return [...preExpense];
          }
        }
        // adds value to the backend table
        Axios.post("http://localhost:3001/cityMaster/Add", {
          City: city.trim(),
          State: state.trim(),
        });
        return [...preExpense, newData];
      });
    }
  };
  return (
    <div className="Citymaster">
      <div className="Inputs">
        <form onSubmit={onClickHandler}>
          <label>City Name</label>{" "}
          <input type="text" onChange={cityHandler} value={city}></input>
          <label>State Name</label>{" "}
          <input type="text" onChange={stateHandler} value={state}></input>
          {!editMode && <button> Add </button>}
          {editMode && <button> Update </button>}
        </form>
      </div>
      <div className="table">
        <TableComponent TableCol={TableColData} TableData={tabledata} />
      </div>
    </div>
  );
}

export default CityMaster;
