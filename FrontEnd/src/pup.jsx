
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "./shared/nav";

function Pup() {
  const [publications, setPublications] = useState([]);
  const [newPublication, setNewPublication] = useState({
    title: "",
    description: "",
    type: "repair",
    price: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/pub")
      .then((response) => setPublications(response.data))
      .catch((error) => console.error("Error fetching publications:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPublication((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:9090/api/pub", newPublication)
      .then((response) => {
        setPublications([...publications, response.data]);
        setNewPublication({
          title: "",
          description: "",
          type: "repair",
          price: 0,
        });
      })
      .catch((error) => console.error("Error creating publication:", error));
  };

  return (
    <div className="bg-yellow-300 text-black min-h-screen p-4">
      <Navbar />
      <h1 className="text-3xl mb-4 text-center">Publier votre article à Fixer</h1>
      <form onSubmit={handleSubmit} className="bg-yellow-300 p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <input
          type="text"
          name="title"
          value={newPublication.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full p-2 mb-4 border border-black rounded"
        />
        <textarea
          name="description"
          value={newPublication.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full p-2 mb-4 border border-black rounded"
        />
        <select
          name="type"
          value={newPublication.type}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-black rounded"
        >
          <option value="Reparation">Reparation</option>
          <option value="Achat">Achat</option>
          <option value="Vente">Vente</option>
          <option value="exchange">Echange</option>
          <option value="donation">Donation</option>
          <option value="other">Autre</option>
        </select>
        <input
          type="number"
          name="price"
          value={newPublication.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="w-full p-2 mb-4 border border-black rounded"
        />
        <button type="submit" className="bg-black text-yellow-500 p-2 rounded">
          Publish
        </button>
      </form>
      <ul className="mt-4 max-w-lg mx-auto">
        {publications.map((publication) => (
          <li key={publication.id} className="bg-yellow-300 p-4 mb-4 rounded shadow-md">
            <h2 className="text-2xl">{publication.title}</h2>
            <p>{publication.description}</p>
            <p>Type: {publication.type}</p>
            <p>Price: {publication.price}€</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pup;
