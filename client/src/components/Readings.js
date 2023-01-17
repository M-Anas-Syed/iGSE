import React, { useState } from 'react';
import {
    MDBContainer,
    MDBBtn,
    MDBInput
  }
  from 'mdb-react-ui-kit';
import Axios from 'axios';

function Readings() {

    Axios.defaults.withCredentials = true;

    const [subDate, setSubDate] = useState("");
    const [dayReading, setDayReading] = useState(0);
    const [nightReading, setNightReading] = useState(0);
    const [gasReading, setGasReading] = useState(0);

    const onSubDate = (ele) =>{
        setSubDate(ele.target.value);
        console.log(subDate);
    }

    const submitReadings = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:3001/readings",{
            submission_date: subDate,
            elec_readings_day: dayReading,
            elecs_reading_night: nightReading,
            gas_reading: gasReading
        }).then((response) => {
            console.log(response);
        });
    }

    return (
        <div>
            <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
                <form>
                    <MDBInput wrapperClass='mb-4' label='Submission date' type='date' value={subDate} onChange={onSubDate} required/>
                    <MDBInput wrapperClass='mb-4' label='Electricity Day Reading (kWh)' type='number' onChange={(e) => {setDayReading(e.target.value);}} required/>
                    <MDBInput wrapperClass='mb-4' label='Electricity Night Reading (kWh)' type='number' onChange={(e) => {setNightReading(e.target.value);}} required/>
                    <MDBInput wrapperClass='mb-4' label='Gas Reading (kWh)' type='number' onChange={(e) => {setGasReading(e.target.value);}} required/> 
                    <MDBBtn className="mb-4 w-100" onClick={submitReadings}>Submit</MDBBtn>
                </form>
            </MDBContainer>
        </div>
    );
}

export default Readings;