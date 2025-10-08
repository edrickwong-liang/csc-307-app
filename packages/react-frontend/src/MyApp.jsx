// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  // TODO: call fetch to make HTTP DELETE request to the right route
  function removeOneCharacter(index) {
    const character = characters[index];
    if (character == undefined) return;
    fetch(`http://localhost:8000/users/${character.id}`, {method: "DELETE"})
      .then((response) => {
        if (response.status === 204) {
          setCharacters((char) => char.filter((_, i) => i !== index));
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, []);


  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (response.status !== 201) {
          throw new Error("Unexpected status: " + response.status);
        }
        return response.json();
      })
      .then((createdUser) => {
          setCharacters((prevState) => [...prevState, createdUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
