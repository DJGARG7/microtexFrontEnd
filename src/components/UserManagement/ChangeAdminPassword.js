import { useEffect, useState } from "react";
import { toastError } from "../Reuse_components/toast";
import ReactLoading from "react-loading";
import axios from "./api/axios";
import commonStyles from "./styles/common.module.css";

export default function ChangeAdminPassword({ userDetails }) {
    console.log(userDetails.userID);

    const submitHandler = async (event) => {
        event.preventDefault();

        if (
            document.getElementById("newPassword").value !==
            document.getElementById("confirmPassword").value
        ) {
            // Toast if passwords don't match.
            toastError("Passwords do not match!");

            // Clear password fields.
            document.getElementById("oldPassword").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("confirmPassword").value = "";
        } else {
            console.log("hello");
            // const res = axios.put(`/${userDetails.userID}`, {

            // })
        }
    };

    return (
        <div className={commonStyles["main"]}>
            <h2>Change Admin Password</h2>
            <form onSubmit={submitHandler} className={commonStyles["form"]}>
                <input
                    type="password"
                    placeholder="Current Password"
                    className={commonStyles["form--inp-p"]}
                    id="oldPassword"
                    required
                />
                <input
                    type="password"
                    placeholder="New Password"
                    className={commonStyles["form--inp-p"]}
                    id="newPassword"
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    id="confirmPassword"
                    className={commonStyles["form--inp-p"]}
                    required
                />
                <strong className={commonStyles["form--password-warning"]}>
                    Password must be atleast 8 characters long and contain at
                    least one letter, one number and one special character.
                </strong>
                <button
                    className={`${commonStyles["form--btn"]} ${commonStyles["form--add-btn"]}`}
                >
                    Update
                </button>
            </form>
        </div>
    );
}
