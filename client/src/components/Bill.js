import React, { useEffect, useState } from 'react';
import {
    MDBContainer,
    MDBBtn
  }
  from 'mdb-react-ui-kit';
import Axios from 'axios';

function Bill() {

    Axios.defaults.withCredentials = true;

    const [newBill, setNewBill] = useState({});
    const [oldBill, setOldBill] = useState({});
    const [dayRate, setDayRate] = useState(0);
    const [nightRate, setNightRate] = useState(0);
    const [gasRate, setGasRate] = useState(0);
    const [standingCharge, setStandingCharge] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState('');

    var total_elec;
    var total_gas;
    var total_standing;

    useEffect(() => {
        Axios.get("http://localhost:3001/bill").then((response) => {
            if(response.data.billExists === true){
                setNewBill(response.data.newbill);
                setOldBill(response.data.oldbill);
                setPaymentStatus(response.data.newbill.status);
            }
        });
    }, []);

    useEffect(() => {
        Axios.get("http://localhost:3001/tariff").then((response) => {
            setDayRate(response.data.tariff[0]['rate']);
            setNightRate(response.data.tariff[1]['rate']);
            setGasRate(response.data.tariff[2]['rate']);
            setStandingCharge(response.data.tariff[3]['rate']);
        })
    }, []);

    const calculateBill = (obill,nbill) => {
        const latestBill = nbill;
        const prevBill = obill;

        const readingDays = Math.abs(latestBill['elec_readings_day'] - prevBill['elec_readings_day']);
        const readingNight = Math.abs(latestBill['elet_reading_night'] - prevBill['elet_reading_night']);
        const readingGas = Math.abs(latestBill['gas_reading'] - prevBill['gas_reading']);

        const time1 = new Date(latestBill['submission_date']);
        const time2 = new Date(prevBill['submission_date']);
        const days = Math.ceil(Math.abs((time1.getTime() - time2.getTime()) / (1000 * 60 * 60 * 24)));

        total_elec = Math.round(((dayRate*readingDays) + (nightRate * readingNight))*100)/100;
        total_gas = Math.round((gasRate * readingGas)*100)/100;
        total_standing = Math.round((days * standingCharge)*100)/100;

        const total = Math.round((total_elec + total_gas + total_standing)*100)/100;
        // console.log(latestBill);
        return total;

    }
    
    // console.log(newBill);
    // console.log(oldBill);

    const total_bill = calculateBill(oldBill, newBill);

    const to = new Date(newBill['submission_date']);
    const todate = to.toLocaleDateString('en-CA');
    const from = new Date(oldBill['submission_date']);
    const fromdate = from.toLocaleDateString('en-CA');

    const makePayment = (e) =>{
        e.preventDefault();
        setPaymentStatus('paid');
    }

    return (
        <div>
            <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
                <h5>Breakdown</h5>
                <ul>
                    <li>Total Electricity Charge: £{total_elec}</li>
                    <li>Total Gas Charge: £{total_gas}</li>
                    <li>Standing Charge: £{total_standing}</li>
                </ul>
                <p>Period: {fromdate} - {todate}</p>
                <p>Amount: £{total_bill}</p>
                <p>Status: {paymentStatus}</p>
                {paymentStatus === 'pending'? <MDBBtn className="mb-4 w-100" onClick={(e) => makePayment(e)}>Pay</MDBBtn>: <MDBBtn className="mb-4 w-100" disabled>Pay</MDBBtn>}
                
            </MDBContainer>
        </div>
    );
}

export default Bill;