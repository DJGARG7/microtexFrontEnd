import React from "react";
import StickyTable from "../../components/Reuse_components/Table/StickyTable";
import { useState, useEffect } from "react";
import "../../styles/CityMaster.css";
import styles from "../../pages/UserPages/Mill/styles/Mill.module.css";

function TakaDetails({ takaList, onTakaHandler, totalMts }) {
    const [tabledata, setTableData] = useState(takaList);
    const [mts, setMts] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [totalmts, settotalmts] = useState(totalMts);

    const TableColData = [
        {
            Header: "SR NO.",
            accessor: "srno",
            Cell: (tableProps) => <div>{tableProps.row.index + 1}</div>,
            Filter: "",
        },
        {
            Header: "Meters",
            accessor: "Mts",
            Filter: "",
        },
        {
            Header: "Action",
            accessor: (str) => "delete",
            Cell: (tableProps) => (
                <div
                    className={styles["form--group"]}
                    style={{
                        width: "auto",
                        margin: "0",
                    }}
                >
                    <button
                        className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                        style={{
                            cursor: "pointer",
                            width: "50px",
                            height: "auto",
                            margin: "0 2.5px",
                            fontSize: "0.9rem",
                            textTransform: "uppercase",
                            fontWeight: "600",
                        }}
                        onClick={onEditHandler}
                    >
                        Edit
                    </button>
                    <button
                        className={`${styles["form--btn"]} ${styles["form--del-btn"]}`}
                        style={{
                            cursor: "pointer",
                            width: "70px",
                            height: "auto",
                            margin: "0 2.5px",
                            fontSize: "0.9rem",
                            textTransform: "uppercase",
                            fontWeight: "600",
                        }}
                        onClick={() => {
                            const dataCopy = [...tabledata];
                            settotalmts(
                                (pre) => pre - tableProps.row.original.Mts
                            );
                            dataCopy.splice(tableProps.row.index, 1);
                            setTableData(dataCopy);
                        }}
                    >
                        Delete
                    </button>
                </div>
            ),
            Filter: "",
            width: "140px",
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
        <>
            <form
                onSubmit={onClickHandler}
                className={styles["form"]}
                style={{ padding: "0", marginTop: "15px" }}
            >
                <div className={styles["form--group"]}>
                    <input
                        type="number"
                        onChange={(e) => setMts(parseInt(e.target.value))}
                        value={mts}
                        placeholder="Meters"
                        className={`${styles["form--input"]}`}
                        style={{
                            width: "125px",
                            minWidth: "125px",
                        }}
                        required
                    />
                    <input
                        value={totalmts}
                        placeholder="TotalMts"
                        className={`${styles["form--input"]}`}
                        style={{
                            width: "100px",
                            minWidth: "100px",
                        }}
                        readOnly
                    />
                    <div
                        className={styles["form--group"]}
                        style={{
                            width: "auto",
                            margin: "0",
                        }}
                    >
                        {!editMode && (
                            <button
                                className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                                style={{
                                    width: "75px",
                                    minWidth: "75px",
                                    marginRight: "10px",
                                }}
                            >
                                Add
                            </button>
                        )}
                        {editMode && (
                            <button
                                className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                                style={{
                                    width: "75px",
                                    minWidth: "75px",
                                    marginRight: "10px",
                                }}
                            >
                                Update
                            </button>
                        )}
                        {editMode && (
                            <button
                                type="Button"
                                onClick={() => setEditMode(false)}
                                className={`${styles["form--btn"]} ${styles["form--del-btn"]}`}
                                style={{
                                    width: "75px",
                                    minWidth: "75px",
                                }}
                            >
                                Cancel
                            </button>
                        )}
                        {!editMode && tabledata.length > 0 && (
                            <button
                                type="Button"
                                className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                                style={{
                                    width: "75px",
                                    minWidth: "75px",
                                }}
                                onClick={onSendDataToParent}
                            >
                                Save
                            </button>
                        )}
                    </div>
                </div>
            </form>
            <div className="table">
                <StickyTable
                    TableCol={TableColData}
                    TableData={tabledata}
                    style={{ maxHeight: "50vh" }}
                />
            </div>
        </>
    );
}

export default TakaDetails;
