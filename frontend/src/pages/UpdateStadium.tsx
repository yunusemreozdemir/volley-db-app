import React from "react";
import axios from "axios";

export default function UpdateStadium() {
    function onSubmit(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        axios.post(`http://localhost:8000/api/update-stadium/`, form)
            .then(function (response) {
                // TODO display this message in the frontend
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        console.log("Update Stadium");
    }

    return (
        <div>
            <h1>Update Stadium</h1>
            <form onSubmit={onSubmit}>
                <label>
                    Stadium Name:
                    <input type="text" name="name"/>
                </label><br />
                <label>
                    Previous Name:
                    <input type="text" name="previous_name" />
                </label>
                <br />
                <button type="submit">Update</button>
            </form>
        </div>
    );
}