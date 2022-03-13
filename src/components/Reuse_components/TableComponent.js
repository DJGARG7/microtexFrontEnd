import "../../styles/TableComponent.css";
import { useTable } from "react-table";
import React from "react";
import { useMemo } from "react/cjs/react.development";

/* this module is used to create resuable tables

The component accepts two props 
 1. TableCol - how many colums and their name in JSON format 
 2. TableData - the rows in jason format. 

 */

function TableComponent({ TableCol, TableData, Unique }) {
  const columns = useMemo(() => [...TableCol], [TableCol]);
  const data = useMemo(() => [...TableData], [TableData]);

  const Tableinstance = useTable({
    columns,
    data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    Tableinstance;
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
                return (
                  <td key={Math.random()} {...cells.getCellProps}>
                    {cells.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TableComponent;
