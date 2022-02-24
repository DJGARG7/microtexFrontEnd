import "../../styles/TableComponent.css";
import { useTable } from "react-table";
import React from "react";


/* this module is used to create resuable tables

The component accepts two props 
 1. TableCol - how many colums and their name in JSON format 
 2. TableData - the rows in jason format. 

 */

function TableComponent({ TableCol, TableData, Unique }) {

  const Tableinsatance = useTable({
    columns : TableCol,
    data : TableData,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    Tableinsatance;
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroups) => (
          <tr {...headerGroups.getHeaderGroupProps()}>
            {headerGroups.headers.map((columns) => (
              <th {...columns.getHeaderProps()}>{columns.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cells) => {
                return <td key = {Math.random()} {...cells.getCellProps}>{cells.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TableComponent;
