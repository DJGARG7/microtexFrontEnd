import { useTable, useBlockLayout,useFilters,useGlobalFilter } from "react-table";
import React from "react";
import { columnIsLastLeftSticky, useSticky } from "react-table-sticky";
import { useMemo } from "react/cjs/react.development";
import { Styles } from "./TableStyle";

/* this module is used to create resuable tables
The component accepts two props 
 1. TableCol - how many colums and their name in JSON format 
 2. TableData - the rows in jason format. 
 */

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      style={{height:"20px",width: "100%",border: "2.5px solid black",borderRadius:"5px"}}
      placeholder={`Search ${count} records...`}
    />
  );
}
function StickyTable({ TableCol, TableData, style }) {
  // use memo is used to stop running table everysecond and the [] is dependecy added and when it should run
  const columns = useMemo(() => [...TableCol], [TableCol]);
  const data = useMemo(() => [...TableData], [TableData]);
  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          hiddenColumns: columns.map((column) => {
            if (column.show === false) return column.accessor || column.id;
          }),
        },
        defaultColumn
      },
      useBlockLayout,
      useSticky,
      useFilters,
      useGlobalFilter
    );
  return (
    <Styles>
      <div
        {...getTableProps()}
        className="table--sticky sticky"
        style={style}
      >
        <div className="header--sticky">
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps() }  className="tr--sticky">
              {headerGroup.headers.map((column) => (
                <div {...column.getHeaderProps({
                  style: { minWidth: column.minWidth, width: column.width},
                })} className="th--sticky">
                  {column.render("Header")}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
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
                  <div {...cell.getCellProps({
                    style: {
                      minWidth: cell.column.minWidth,
                      width: cell.column.width,
                    },
                  })} className="td--sticky">
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
