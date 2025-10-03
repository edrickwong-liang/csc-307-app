// backend.js
import express from "express";

const app = express();
const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter((user) => user["name"] === name && user["job"] === job);
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  let result = users;
  if (name != undefined && job != undefined) {
    result = { users_list: findUserByNameAndJob(name, job) };
  } else if (name != undefined) {
    result = { users_list: findUserByName(name) };
  }
  res.send(result);
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.send();
});

const removeUser = (id) => {
  const index = users["users_list"].findIndex((user) => user["id"] === id);
  return index !== -1 && users["users_list"].splice(index, 1).length > 0; // short-circuit if index !== -1 isn't met, otherwise splice changes array
};

app.delete("/users/:id", (req, res) => {
  const userToDelete = req.params["id"];
  removeUser(userToDelete) ? res.sendStatus(204) : res.status(404).send("Resource not found.");
});
