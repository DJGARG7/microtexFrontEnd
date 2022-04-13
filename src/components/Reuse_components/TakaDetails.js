import React from "react";
import StickyTable from "../../components/Reuse_components/Table/StickyTable";
import { useState, useEffect } from "react";
import "../../styles/CityMaster.css";

function TakaDetails({ takaList, onTakaHandler, totalMts }) {
  const [tabledata, setTableData] = useState(takaList);
  const [mts, setMts] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [totalmts, settotalmts] = useState(totalMts);
  const TableColData = [
    {
      Header: "Sr No",
      accessor: "srno",
      Cell: (tableProps) => <div>{tableProps.row.index + 1}</div>,
      Filter: "",
    },
    {
      Header: "Mts",
      accessor: "Mts",
      Filter: "",
    },
    {
      Header: "Action",
      accessor: (str) => "delete",
      Cell: (tableProps) => (
        <div className="btn-grp">
          <button
            onClick={() => {
              const dataCopy = [...tabledata];
              settotalmts((pre) => pre - tableProps.row.original.Mts);
              dataCopy.splice(tableProps.row.index, 1);
              setTableData(dataCopy);
            }}
          >
            Delete
          </button>
          <button onClick={onEditHandler}>Edit</button>
        </div>
      ),
      Filter: "",
    },
  ];

  // funtion executes when the form is submitted
  const onClickHandler = async (event) => {
    event.preventDefault();
    const newdata = { Mts: mts };
    settotalmts((pre) => pre + mts);
    setTableData((predata) => {
      return [...predata, newdata];
    });

    setMts("");
  };

  // when edit is selected
  const onEditHandler = () => {
    setEditMode(true);
  };

  const onSendDataToParent = () => {
    const data = {
      tabledata,
      totalmts,
    };
    onTakaHandler(data);
  };
  return (
    <div className="citymaster">
      <h2>Taka details</h2>
      <div className="Inputs">
        <form onSubmit={onClickHandler}>
          <input
            type="number"
            onChange={(e) => setMts(parseInt(e.target.value))}
            value={mts}
            placeholder="Mts"
            className="input-city"
            required
          ></input>
          <input
            value={totalmts}
            className="input-city"
            placeholder="TotalMts"
            disabled
          />
          {!editMode && <button className="btn add-btn"> Add </button>}
          {editMode && <button className="btn update-btn"> Update </button>}
          {editMode && (
            <button
              type="Button"
              className="btn update-btn"
              onClick={() => setEditMode(false)}
            >
              {" "}
              Cancel{" "}
            </button>
          )}
          {!editMode && tabledata.length > 0 && (
            <button
              type="Button"
              className="btn add-btn"
              onClick={onSendDataToParent}
            >
              Save
            </button>
          )}
        </form>
      </div>
      <div className="table">
        <StickyTable
          TableCol={TableColData}
          TableData={tabledata}
          style={{
            maxWidth: "452px",
            maxHeight: "500px",
            border: "1px Solid black",
            borderRadius: "10px",
          }}
        />
      </div>
    </div>
  );
}

export default TakaDetails;
