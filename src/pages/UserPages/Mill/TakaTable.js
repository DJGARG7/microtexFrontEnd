import { useState } from "react";
import { toastSuccess } from "../../../components/Reuse_components/toast";
import styles from "../../../components/UserManagement/styles/common.module.css";
import "./styles/Table.css";

export default function TakaTable({ data, setTaka, setTotal, closeTakaModal }) {
    const [selectedTaka, setSelectedTaka] = useState(new Set());

    const selectTakaHandler = (e) => {
        console.log(e);

        let temp = selectedTaka;

        if (e.target.checked) {
            setSelectedTaka(temp.add(parseInt(e.target.value)));
        } else {
            temp.delete(parseInt(e.target.value));
            temp.size === 0
                ? setSelectedTaka(new Set())
                : setSelectedTaka(temp);
        }
    };

    const selectAllCheckboxHandler = (e) => {
        let checkboxes = document.getElementsByName("taka");
        let temp = selectedTaka;

        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = e.target.checked;

            if (e.target.checked) {
                setSelectedTaka(temp.add(parseInt(checkboxes[i].value)));
            } else {
                temp.delete(parseInt(checkboxes[i].value));
                temp.size === 0
                    ? setSelectedTaka(new Set())
                    : setSelectedTaka(temp);
            }
        }
    };

    // Calculate total length of selected taka.
    const calculateTotalMeters = () => {
        let sum = 0;

        data.forEach((taka) => {
            if (Array.from(selectedTaka).includes(taka.takaID))
                sum += taka.meters;
        });

        return sum;
    };

    // Add taka length to selectedTaka.
    const addMetersToTaka = () => {
        let temp = [];

        data.forEach((taka) => {
            if (Array.from(selectedTaka).includes(taka.takaID))
                temp.push({ takaID: taka.takaID, meters: taka.meters });
        });

        return temp;
    };

    const submitHandler = (e) => {
        e.preventDefault();
        toastSuccess("Taka selected!");
        setTotal(calculateTotalMeters());
        setTaka(addMetersToTaka());
        closeTakaModal();
    };

    return (
        <div style={{ maxHeight: "60vh", overflow: "auto" }}>
            <table style={{ margin: "0 10px 0 0" }}>
                <thead>
                    <tr>
                        <th>SR No.</th>
                        {/* <th>Taka ID</th> */}
                        <th>Bill No</th>
                        {/* <th>Item ID</th> */}
                        <th>Meters</th>
                        <th>
                            <input
                                type="checkbox"
                                onChange={selectAllCheckboxHandler}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((bill, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                {/* <td>{bill.takaID}</td> */}
                                <td>{bill.billNumber}</td>
                                {/* <td>{bill.itemID}</td> */}
                                <td>{bill.meters}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        name="taka"
                                        value={bill.takaID}
                                        onChange={selectTakaHandler}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <button
                className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                style={{ width: "100px", margin: "25px 0 2.5px 0" }}
                onClick={submitHandler}
            >
                Select Taka
            </button>
        </div>
    );
}
