// import { useState } from "react";
import TableComponent from "../components/Admin_components/TableComponent";
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
  {
    Header : "Action",
    accessor: "action"
  }
];
function CityMasterView() {
  return (
    <div>
      <h1>This is city master view</h1>
      <TableComponent TableCol={TableColData} TableData={CityData}/>
    </div>
  );
}

export default CityMasterView;
