import React from "react";
import TableComponent from "../components/Reuse_components/TableComponent";
import { useState, useEffect } from "react";
import "../styles/CityMaster.css";
import Axios from "axios";
import { SortingMode } from "ka-table/enums";
import toast from "react-hot-toast";

// Include header and cookie with every request.
Axios.defaults.headers.common["userID"] = JSON.parse(
    localStorage.getItem("userDetails")
).userID;
Axios.defaults.withCredentials = true;

let index, oldcity;
function CityMaster({ userDetails }) {
    const [tabledata, setTabledata] = useState([]);
    const [city, setCitychange] = useState("");
    const [state, setStatechange] = useState("");
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        (async function fetchdata() {
            try {
                const res = await Axios.get(
                    "http://localhost:3001/cityMaster/get"
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
                                    "http://localhost:3001/cityMaster/delete",
                                    {
                                        City: tableProps.row.values.CityName,
                                    }
                                );
                                const dataCopy = [...tabledata];
                                // console.log(result);
                                dataCopy.splice(tableProps.row.index, 1);
                                setTabledata(dataCopy);
                                toast.success(
                                    `${tableProps.row.values.CityName} deleted successfully!`,
                                    {
                                        style: {
                                            borderRadius: "15px",
                                            background: "#333",
                                            color: "#fff",
                                        },
                                    }
                                );
                            } catch (e) {
                                console.log(e);
                                toast.error(e, {
                                    style: {
                                        borderRadius: "15px",
                                        background: "#333",
                                        color: "#fff",
                                    },
                                });
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
                            setCitychange(
                                dataCopy[tableProps.row.index].CityName
                            );
                            setStatechange(
                                dataCopy[tableProps.row.index].StateName
                            );
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
            const editData = async () => {
                try {
                    var result = await Axios.post(
                        "http://localhost:3001/cityMaster/update",
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
            editData()
                .then((result) => {
                    if (result.data == 1) {
                        setEditMode(false);
                        setTabledata((preExpense) => {
                            preExpense[index].CityName = newData.CityName;
                            preExpense[index].StateName = newData.StateName;
                            return [...preExpense];
                        });
                        toast.success(
                            `${newData.CityName}, ${newData.StateName} added successfully!`,
                            {
                                style: {
                                    borderRadius: "15px",
                                    background: "#333",
                                    color: "#fff",
                                },
                            }
                        );
                    } else {
                        if (result.data.sqlMessage)
                            toast.error(result.data.sqlMessage, {
                                style: {
                                    borderRadius: "15px",
                                    background: "#333",
                                    color: "#fff",
                                },
                            });
                        console.log(result.data.sqlMessage);
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            // function to add the data
            const addData = async function () {
                try {
                    var result = await Axios.post(
                        "http://localhost:3001/cityMaster/Add",
                        {
                            City: city.trim(),
                            State: state.trim(),
                        },
                        {
                            withCredentials: true,
                        }
                    );
                    return result;
                } catch (e) {
                    console.log(e);
                    return e;
                }
            };
            addData()
                .then((result) => {
                    if (result.data == 1) {
                        setTabledata((prestate) => {
                            return [...prestate, newData];
                        });
                        toast.success(
                            `${newData.CityName}, ${newData.StateName} added successfully!`,
                            {
                                style: {
                                    borderRadius: "15px",
                                    background: "#333",
                                    color: "#fff",
                                },
                            }
                        );
                    } else {
                        if (result.data.sqlMessage)
                            toast.error(result.data.sqlMessage, {
                                style: {
                                    borderRadius: "15px",
                                    background: "#333",
                                    color: "#fff",
                                },
                            });
                    }
                })
                .catch((e) => {
                    console.log(e);
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
