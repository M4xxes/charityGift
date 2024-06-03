import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [associations, setAssociations] = useState([]);
    const [donationAmount, setDonationAmount] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/associations')
            .then(response => setAssociations(response.data))
            .catch(error => console.error('Error fetching associations:', error));
    }, []);

    const handleDonate = (associationId) => {
        axios.post('http://localhost:3001/donate', {
            associationId,
            amount: donationAmount
        }).then(response => {
            alert(response.data.message);
        }).catch(error => console.error('Error making donation:', error));
    };

    return (
        <div>
            <h1>CharityGift</h1>
            <ul>
                {associations.map(association => (
                    <li key={association._id}>
                        <h2>{association.name}</h2>
                        <p>{association.cause}</p>
                        <p>{association.description}</p>
                        <a href={association.donationLink} target="_blank" rel="noopener noreferrer">Donate</a>
                        <br />
                        <input
                            type="number"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            placeholder="Donation amount"
                        />
                        <button onClick={() => handleDonate(association._id)}>Donate</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
