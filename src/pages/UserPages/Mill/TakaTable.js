import { useState } from "react";
import { toastSuccess } from "../../../components/Reuse_components/toast";
import styles from "../../../components/UserManagement/styles/common.module.css";
import "./styles/Table.css";

export default function TakaTable({ data, setTaka, setTotal, closeTakaModal }) {
    const [selectedTaka, setSelectedTaka] = useState(new Set());

    const selectTakaHandler = (event) => {
        let temp = selectedTaka;

        if (event.target.checked) {
            setSelectedTaka(temp.add(parseInt(event.target.value)));
        } else {
            temp.delete(parseInt(event.target.value));
            temp.size === 0
                ? setSelectedTaka(new Set())
                : setSelectedTaka(temp);
        }

        console.log(selectedTaka);
    };

    const calculateTotalMeters = () => {
        let sum = 0;

        data.forEach((taka) => {
            if (Array.from(selectedTaka).includes(taka.takaID))
                sum += taka.meters;
        });

        return sum;
    };

    const submitHandler = (e) => {
        e.preventDefault();
        toastSuccess("Taka selected!");
        setTotal(calculateTotalMeters());
        setTaka(Array.from(selectedTaka));
        closeTakaModal();
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>SR No.</th>
                        <th>Taka ID</th>
                        <th>Bill No</th>
                        <th>Item ID</th>
                        <th>Meters</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((bill, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{bill.takaID}</td>
                                <td>{bill.billNumber}</td>
                                <td>{bill.itemID}</td>
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
                style={{ width: "100px", marginTop: "25px" }}
                onClick={submitHandler}
            >
                Select Taka
            </button>
        </>
    );
}
