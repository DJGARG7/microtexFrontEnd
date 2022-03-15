import { useTable, useBlockLayout } from "react-table";
import React from "react";
import { columnIsLastLeftSticky, useSticky } from "react-table-sticky";
import { useMemo } from "react/cjs/react.development";
import { Styles } from "./TableStyle";

/* this module is used to create resuable tables
The component accepts two props 
 1. TableCol - how many colums and their name in JSON format 
 2. TableData - the rows in jason format. 
 */

function StickyTable({ TableCol, TableData}) {
  // use memo is used to stop running table everysecond and the [] is dependecy added and when it should run
  const columns = useMemo(() => [...TableCol], [TableCol]);
  const data = useMemo(() => [...TableData], [TableData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState:{
          hiddenColumns : columns.map(column => {
            if(column.show === false) return column.accessor || column.id;
          }),
        },
      },

      useBlockLayout,
      useSticky
    );
  return (
    <Styles>
      <div
        {...getTableProps()}
        className="table--sticky sticky"
        style={{ width: 1000, height: 500 }}
      >
        <div className="header--sticky">
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr--sticky">
              {headerGroup.headers.map((column) => (
                <div {...column.getHeaderProps()} className="th--sticky">
                  {column.render("Header")}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()} className="body--sticky">
          {rows.map((row) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className="tr--sticky">
                {row.cells.map((cell) => (
                  <div {...cell.getCellProps()} className="td--sticky">
                    {cell.render("Cell")}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Styles>
  );
}

export default StickyTable;
