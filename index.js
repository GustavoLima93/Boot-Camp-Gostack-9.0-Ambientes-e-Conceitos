const express = require("express");

const server = express();

server.use(express.json());

// Query params = ?teste=1  =>  const { nome } = req.query;
// Route params = /users/1
// Request body = { "name": "Gustavo", "email": "gustavo@gmail.com.br"}

const users = ["Diego", "Cláudio", "Victor"];

server.use((req, res, next) => {
  console.time("time");
  console.log(
    `O metodo chamado foi o ${req.method}, a URl chamada foi a ${req.url}`
  );

  next();
  console.timeEnd("time");
});

function checkUserExists(req, res, next) {
  if (!req.body.user) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User does not exists " });
  }
  req.user = user;

  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  return res.json(req.user);
});

server.post("/users", checkUserExists, (req, res) => {
  const { user } = req.body;
  users.push(user);
  return res.json(users);
});

server.put("/users/:index", checkUserInArray, checkUserExists, (req, res) => {
  const { user } = req.body;
  const { index } = req.params;
  users[index] = user;
  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.send();
});

server.listen(3000);
