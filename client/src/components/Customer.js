import React from 'react';
import Readings from './Readings';
import Bill from './Bill';

function Customer(props) {
    return (
        <div>
            <h1>Hello Customer!</h1>
            <Readings/>
            <Bill/>
        </div>
    );
}

export default Customer;