import React, { useEffect, useState } from "react";
import Axios from "axios";
import Customer from "../components/Customer";
import Admin from "../components/Admin";

export default function Main(){

    const [type, setType] = useState("");

    Axios.defaults.withCredentials = true;

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn == true){
                setType(response.data.user[0].type);
            }
        })
    }, []);

    return (
        <div>
            {type == 'customer' && <Customer />} {type == 'admin' && <Admin />}
        </div>
    );
}