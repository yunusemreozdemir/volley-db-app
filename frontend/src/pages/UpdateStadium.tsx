import React from "react";

export default function UpdateStadium() {
    return (
        <div>
            <h1>Update Stadium</h1>
            <form>
                <label>
                    Stadium Name:
                    <input type="text" />
                </label>
                <br />
                <button type="submit">Update</button>
            </form>
        </div>
    );
}