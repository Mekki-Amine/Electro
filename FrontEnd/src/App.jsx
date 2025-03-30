import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [publications, setPublications] = useState([]);
    const [newPublication, setNewPublication] = useState({
        title: '',
        description: '',
        type: 'repair',
        price: 0
    });

    useEffect(() => {
        axios.get('http://localhost:9090/api/pub')
            .then(response => setPublications(response.data))
            .catch(error => console.error('Error fetching publications:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPublication(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:9090/api/pub', newPublication)
            .then(response => {
                setPublications([...publications, response.data]);
                setNewPublication({ title: '', description: '', type: 'repair', price: 0 });
            })
            .catch(error => console.error('Error creating publication:', error));
    };

    return (
        <div>
            <h1>Electro Repair</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    value={newPublication.title}
                    onChange={handleChange}
                    placeholder="Title"
                    required
                />
                <textarea
                    name="description"
                    value={newPublication.description}
                    onChange={handleChange}
                    placeholder="Description"
                    required
                />
                <select name="type" value={newPublication.type} onChange={handleChange}>
                    <option value="repair">Repair</option>
                    <option value="sale">Sale</option>
                </select>
                <input
                    type="number"
                    name="price"
                    value={newPublication.price}
                    onChange={handleChange}
                    placeholder="Price"
                    required
                />
                <button type="submit">Publish</button>
            </form>
            <ul>
                {publications.map(publication => (
                    <li key={publication.id}>
                        <h2>{publication.title}</h2>
                        <p>{publication.description}</p>
                        <p>Type: {publication.type}</p>
                        <p>Price: {publication.price}€</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;