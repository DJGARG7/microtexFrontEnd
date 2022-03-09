import React from "react";
import TableComponent from "../components/Reuse_components/TableComponent";
import { useState, useEffect } from "react";
import "../styles/CityMaster.css";
import Axios from "axios";
import { SortingMode } from "ka-table/enums";
let index, oldcity;
function CityMaster({ userDetails }) {
  const [tabledata, setTabledata] = useState([]);
  const [city, setCitychange] = useState("");
  const [state, setStatechange] = useState("");
  const [editMode, setEditMode] = useState(false);
  // // for gettig the data when the page loads for the first time
  useEffect(() => {
    (async function fetchdata() {
      try {
        const res = await Axios.get(
          "http://localhost:3001/cityMaster/getdata",
          {
            withCredentials: true,
          }
        );
        setTabledata(res.data);
      } catch (e) {
        console.log(e);
      }
    })();
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
            onClick={async () => {
              try {
                var result = await Axios.post(
                  "http://localhost:3001/cityMaster/Delete",
                  {
                    City: tableProps.row.values.CityName,
                  }
                );
                const dataCopy = [...tabledata];
                console.log(result);
                dataCopy.splice(tableProps.row.index, 1);
                setTabledata(dataCopy);
              } catch (e) {
                console.log(e);
              }
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
    const newData = {
      CityName: city.trim(),
      StateName: state.trim(),
    };
    // checks wether the mode is edit or not if edit --> updates the exsisting selected row in the table and if !edit-> adds new data into the table if not present.
    if (editMode) {
      // function to edit the data and creating an edit request
      const editData = async () => {
        try {
          var result = await Axios.post(
            "http://localhost:3001/cityMaster/Update",
            {
              City: city.trim(),
              State: state.trim(),
              oldcity: oldcity.trim(),
            }
          );
          return result;
        } catch (e) {
          console.log(e);
          return e;
        }
      };
      editData().then((result) => {
        // this will recice 1 as data if exwcuted successfully
        if (result.data == 1) {
          setEditMode(false);
          setCitychange("");
          setStatechange("");
          setTabledata((preExpense) => {
            preExpense[index].CityName = newData.CityName;
            preExpense[index].StateName = newData.StateName;
            return [...preExpense];
          });
        } else {
          if (result.data.sqlMessage) alert("City Already present");
          console.log(result.data.sqlMessage);
        }
      });
    } else {
      //  this handles if the edit mode is off ie add mode is on
      // function to add the data
      const addData = async function () {
        try {
          var result = await Axios.post(
            "http://localhost:3001/cityMaster/Add",
            {
              City: city.trim(),
              State: state.trim(),
            }
          );
          return result;
        } catch (e) {
          console.log(e);
          return e;
        }
      };
      addData().then((result) => {
        if (result.data == 1) {
          setCitychange("");
          setStatechange("");
          setTabledata((prestate) => {
            return [...prestate, newData];
          });
        } else {
          if (result.data.sqlMessage) alert("City Already present");
          console.log(result.data.sqlMessage);
        }
      });
    }
  };
  return (
    <div className="Citymaster">
      <div className="Inputs">
        <form onSubmit={onClickHandler}>
          <label>City Name</label>{" "}
          <input
            type="text"
            onChange={cityHandler}
            value={city}
            required
          ></input>
          <label>State Name</label>{" "}
          <input
            type="text"
            onChange={stateHandler}
            value={state}
            required
          ></input>
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
