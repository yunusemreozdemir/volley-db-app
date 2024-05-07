import axios from "axios";
import { useEffect, useState } from "react";

export default function ViewStadiums() {
    useEffect(() => {
        get_stadiums();
    }, []);
    
    const [stadiums, setStadiums] = useState("");

    function get_stadiums(){
        axios.get(`http://localhost:8000/api/get-stadiums/`)
            .then(function (response) {
                console.log(response.data.stadiums);
                setStadiums(response.data.stadiums);
                return response.data.stadiums;
            })
            .catch(function (error) {
                console.log(error);
                return [];
            });
    }

    return (
        <div>
            <h1>View Stadiums</h1>
            {stadiums}
        </div>
    )
}