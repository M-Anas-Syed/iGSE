import React, {useEffect, useState} from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    MDBContainer,
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane,
    MDBBtn,
    MDBInput
  }
  from 'mdb-react-ui-kit';

export default function Registeration(){

    const navigate = useNavigate();

    const [customeridReg, setCustomeridReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const [addressReg, setAddressReg] = useState('');
    const [proptypeReg, setProptypeReg] = useState('');
    const [bedroomsReg, setBedrooms] = useState('');
    const [voucherReg, setVoucherReg] = useState('');

    
    Axios.defaults.withCredentials = true;

    const register = () => {
        Axios.post("http://localhost:3001/register", {
            customerid: customeridReg,
            password: passwordReg,
            address: addressReg,
            property_type: proptypeReg,
            no_of_bedrooms: bedroomsReg,
            voucher: voucherReg
        }).then((response) => {
            console.log(response);
        });
    }

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
        navigate("/");
    }

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            if(response.data.loggedIn == true){
                setLoginStatus(response.data.user[0].customer_id);
            }
        });
    }, []);

    const [justifyActive, setJustifyActive] = useState('tab1');;

    const handleJustifyClick = (value) => {
        if (value === justifyActive) {
        return;
        }

        setJustifyActive(value);
    };

    return(
        <div>
            <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
                <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
                    <MDBTabsItem>
                        <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
                            Login
                        </MDBTabsLink>
                    </MDBTabsItem>
                    <MDBTabsItem>
                        <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
                            Register
                        </MDBTabsLink>
                    </MDBTabsItem>
                </MDBTabs>
            </MDBContainer>

            <MDBTabsContent>

                <MDBTabsPane show={justifyActive === 'tab1'}>

                    <MDBInput wrapperClass='mb-4' label='Customer ID' type='email' onChange={(e) => {setCustomeridLogin(e.target.value);}}/>
                    <MDBInput wrapperClass='mb-4' label='Password' type='password' onChange={(e) => {setPasswordLogin(e.target.value);}}/>

                    <MDBBtn className="mb-4 w-100" onClick={login}>Sign in</MDBBtn>
                    <p className="text-center">Not a member? <a href="#!" onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'} >Register</a></p>

                </MDBTabsPane>

                <MDBTabsPane show={justifyActive === 'tab2'}>

                    <MDBInput wrapperClass='mb-4' label='Customer ID' type='text' onChange={(e) => {setCustomeridReg(e.target.value);}}/>
                    <MDBInput wrapperClass='mb-4' label='Password' type='password' onChange={(e) => {setPasswordReg(e.target.value);}}/>
                    <MDBInput wrapperClass='mb-4' label='Address' type='text' onChange={(e) => {setAddressReg(e.target.value);}}/>
                    <MDBInput wrapperClass='mb-4' label='Property type' type='text' onChange={(e) => {setProptypeReg(e.target.value);}}/>
                    <MDBInput wrapperClass='mb-4' label='Number of bedrooms' type='number' onChange={(e) => {setBedrooms(e.target.value);}}/>
                    <MDBInput wrapperClass='mb-4' label='Energy Voucher Code' type='text' onChange={(e) => {setVoucherReg(e.target.value);}}/>

                    <MDBBtn className="mb-4 w-100" onClick={register}>Sign up</MDBBtn>

                </MDBTabsPane>

            </MDBTabsContent>
            
        </div>
    );
}