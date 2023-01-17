import React from 'react';
import Readings from './Readings';
import Bill from './Bill';
import Topup from './Topup';
import Accordion from 'react-bootstrap/Accordion';
import {
    MDBContainer,
    MDBBtn,
    MDBInput
  }
  from 'mdb-react-ui-kit';

function Customer(props) {
    return (
        <div>
            <h1>Hello Customer!</h1>
            <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Submit new meter readings</Accordion.Header>
                        <Accordion.Body>
                            <Readings/>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>View/Pay latest bill</Accordion.Header>
                        <Accordion.Body>
                            <Bill/>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Top up using Energy Voucher Code or scan QR code</Accordion.Header>
                        <Accordion.Body>
                            <Topup/>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </MDBContainer>

            
        </div>
    );
}

export default Customer;