import React, { useEffect, useState } from 'react';
import {
    MDBContainer,
    MDBBtn,
    MDBInput
  }
  from 'mdb-react-ui-kit';
import Axios from 'axios';
import Alert from 'react-bootstrap/Alert';

function Topup() {

    Axios.defaults.withCredentials = true;
    const [evc, setEvc] = useState('');
    const [vouchers, setVouchers] = useState({});
    const [balance, setBalance] = useState(0);
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        Axios.get("http://localhost:3001/topup").then((response) => {
            setVouchers(response.data.allVouchers);
            setBalance(response.data.user[0].balance);
            // console.log(response.data.user);
        })
    }, []);

    console.log(vouchers);
    // const valid = vouchers.some(el => el.EVC_code === evc);
    // if(valid){
    //     const x = balance+200;
    //     setBalance(x);
    // }
    console.log(balance);

    

    // console.log()
    const addCredit = (e) => {
        e.preventDefault();
        const valid = vouchers.some(el => el.EVC_code === evc);
        var x;
        if(valid){
            x = balance+200;
            Axios.post("http://localhost:3001/topup",{
                total_balance: x,
                voucher_num: evc,
            }).then((response) => {
                console.log(response);
                // if(response.data.message){

                // } 
            });
        }else{
            setErrMsg('Invalid Evergy Voucher Code!');
        }
        // console.log(x);
    }


    return (
        <div>
            <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
                <form>
                    {errMsg && <Alert variant='danger' onClose={() => setErrMsg('')} dismissible><p>{errMsg}</p></Alert>}
                    <MDBInput wrapperClass='mb-4' label='Energy Voucher Code' maxLength={8} minLength={8} type='text' onChange={(e) => {setEvc(e.target.value);}} required/>
                    <MDBBtn className="mb-4 w-100" onClick={addCredit}>Submit</MDBBtn>
                </form>
            </MDBContainer>
        </div>
    );
}

export default Topup;