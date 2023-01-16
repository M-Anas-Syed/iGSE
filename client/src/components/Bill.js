import React, { useEffect, useState } from 'react';
import {
    MDBContainer,
    MDBBtn,
    MDBInput
  }
  from 'mdb-react-ui-kit';
import Axios from 'axios';

function Bill() {

    Axios.defaults.withCredentials = true;

    const [lastBill, setLastBill] = useState([]);
    const [prevBill, setPrevBill] = useState([]);
    const [dayRate, setDayRate] = useState(0);
    const [nightRate, setNightRate] = useState(0);
    const [gasRate, setGasRate] = useState(0);
    const [standingCharge, setStandingCharge] = useState(0);

    useEffect(() => {
        Axios.get("http://localhost:3001/bill").then((response) => {
            // console.log(response.data);
            if(response.data.billExists == true){
                    setLastBill((b) => [...b, response.data.newbill]);
                    setPrevBill((x) => [...x, response.data.oldbill]);
                    // console.log(response.data.newbill);
                }
            });
    },[]);

    useEffect(() => {
        Axios.get("http://localhost:3001/tariff").then((response) => {
            setDayRate(response.data.tariff[0]['rate']);
            setNightRate(response.data.tariff[1]['rate']);
            setGasRate(response.data.tariff[2]['rate']);
            setStandingCharge(response.data.tariff[3]['rate']);
        })
    }, []);
    
    console.log(lastBill[0]);
    // console.log(prevBill[0]);
    const calculateBill = (obill,nbill) => {
        const latestBill = nbill;
        const prevBill = obill;

        const readingDays = Math.abs(latestBill.elec_readings_day - prevBill['elec_readings_day']);
        const readingNight = Math.abs(latestBill['elet_reading_night'] - prevBill['elet_reading_night']);
        const readingGas = Math.abs(latestBill['gas_reading'] - prevBill['gas_reading']);

        const time1 = new Date(latestBill['submission_date']);
        const time2 = new Date(prevBill['submission_date']);
        const days = Math.ceil(Math.abs((time1.getTime() - time2.getTime()) / (1000 * 60 * 60 * 24)));

        const total = Math.ceil((dayRate*readingDays) + (nightRate * readingNight) + (gasRate * readingGas) + (days * standingCharge));
        // console.log(latestBill);
        return total;

    }

    // calculateBill(lastBill[0],prevBill[0]);
    const olderbill = prevBill[0];
    const newerbill = lastBill[0];
    const finalBill = calculateBill(newerbill,olderbill)
    // console.log(newerbill.submission_date);
    // const to = new Date(newerbill['submission_date']);
    // const todate = to.toLocaleDateString('en-CA');
    // const from = new Date(olderbill['submission_date']);
    // const fromdate = from.toLocaleDateString('en-CA');


    return (
        <div>
            <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
                <h3>View/Pay latest bill</h3>
                {/* <p>Period: {from}</p> */}
                <p>Amount: {finalBill}</p>
            </MDBContainer>
        </div>
    );
}

export default Bill;