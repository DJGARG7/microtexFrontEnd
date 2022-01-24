import "../../styles/TableComponent.css";
import { useTable } from "react-table";
import React from "react";
import { useMemo } from "react";

function TableComponent({ TableCol, TableData }) {

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
                return <td {...cells.getCellProps}>{cells.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TableComponent;