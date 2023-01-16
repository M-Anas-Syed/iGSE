import React, {useState} from "react";
import Axios from "axios";

export default function Login(){

    const [customeridLogin, setCustomeridLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');

    const [loginStatus, setLoginStatus] = useState("");

    const login = () => {
        Axios.post("http://localhost:3001/login", {
            customerid: customeridLogin,
            password: passwordLogin,
        }).then((response) => {
            if(response.data.message){
                setLoginStatus(response.data.message);
            }else{
                setLoginStatus(response.data[0].customer_id)
            }
        });
    }

    return(

        <div>
            <h1>Login</h1>
            <label>Customer ID</label>
            <input type="text" placeholder="Customer ID" onChange={(e) => {setCustomeridLogin(e.target.value);}}/>
            <label>Password</label>
            <input type="text" placeholder="Password" onChange={(e) => {setPasswordLogin(e.target.value);}}/>
            <button onClick={login}>Login</button>
            <div>
                <h1>{loginStatus}</h1>
            </div>
        </div>
       
    );
};