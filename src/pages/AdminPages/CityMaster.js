import React from "react";
import TableComponent from "../../components/Reuse_components/Table/TableComponent";
import StickyTable from "../../components/Reuse_components/Table/StickyTable";
import { useState, useEffect } from "react";
import "../../styles/CityMaster.css";
import Axios from "axios";
import toast from "react-hot-toast";

const toastStyle = {
    style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
    },
};

// Include header and cookie with every request.
if (localStorage.getItem("userDetails") != null)
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
            let cityToast;
            try {
                cityToast = toast.loading("Fetching cities...", toastStyle);
                const res = await Axios.get(
                    "http://localhost:3001/cityMaster/get"
                );
                setTabledata(res.data);
                toast.success("Cities fetched.", { id: cityToast });
            } catch (e) {
                console.log(e);
                toast.success("Failed to fetch cities.", { id: cityToast });
            }
        })();
    }, []);

    console.log(tabledata);

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
                <div className="btn-grp">
                    <button
                        className="btn del-btn"
                        onClick={async () => {
                            try {
                                const result = await Axios.post(
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
                        className="btn edit-btn"
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
    const onClickHandler = async (event) => {
        event.preventDefault();
        const newData = {
            CityName: city.trim(),
            StateName: state.trim(),
        };
        // checks wether the mode is edit or not if edit --> updates the exsisting selected row in the table and if !edit-> adds new data into the table if not present.
        if (editMode) {
            let editCityToast;
            try {
                // editCityToast = toast.loading(
                //     `Editing to ${newData.CityName}, ${newData.StateName}...`,
                //     toastStyle
                // );

                const result = await Axios.post(
                    "http://localhost:3001/cityMaster/update",
                    {
                        City: city.trim(),
                        State: state.trim(),
                        oldcity: oldcity.trim(),
                    }
                );

                if (result.data == 1) {
                    setEditMode(false);
                    setTabledata((preExpense) => {
                        preExpense[index].CityName = newData.CityName;
                        preExpense[index].StateName = newData.StateName;
                        return [...preExpense];
                    });
                    toast.success(
                        `${newData.CityName}, ${newData.StateName} edited successfully!`,
                        toastStyle,
                        { id: editCityToast }
                    );
                } else {
                    if (result.data)
                        toast.error(result.data, toastStyle, {
                            id: editCityToast,
                        });
                    console.log(result.data);
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            let addCityToast;
            // function to add the data
            try {
                // addCityToast = toast.loading(
                //     `Adding ${newData.CityName}, ${newData.StateName}...`,
                //     toastStyle
                // );
                const result = await Axios.post(
                    "http://localhost:3001/cityMaster/Add",
                    {
                        City: city.trim(),
                        State: state.trim(),
                    },
                    {
                        withCredentials: true,
                    }
                );
                if (result.data == 1) {
                    setTabledata((prestate) => {
                        return [...prestate, newData];
                    });
                    toast.success(
                        `${newData.CityName}, ${newData.StateName} added successfully!`,
                        toastStyle,
                        { id: addCityToast }
                    );
                } else {
                    if (result.data.sqlMessage)
                        toast.error(result.data.sqlMessage, toastStyle, {
                            id: addCityToast,
                        });
                }
            } catch (e) {
                console.log(e);
            }
        }
    };
    return (
        <div className="citymaster">
            <h2>City Master</h2>
            <div className="Inputs">
                <form onSubmit={onClickHandler}>
                    {/* <label>City Name</label>{" "} */}
                    <input
                        type="text"
                        onChange={cityHandler}
                        value={city}
                        placeholder="City"
                        className="input-city"
                        required
                    ></input>
                    {/* <label>State Name</label>{" "} */}
                    <input
                        type="text"
                        onChange={stateHandler}
                        value={state}
                        placeholder="State"
                        className="input-state"
                        required
                    ></input>
                    {!editMode && (
                        <button className="btn add-btn"> Add </button>
                    )}
                    {editMode && (
                        <button className="btn update-btn"> Update </button>
                    )}
                </form>
            </div>
            <div className="table">
                <TableComponent TableCol={TableColData} TableData={tabledata} />
            </div>
        </div>
    );
}

export default CityMaster;
