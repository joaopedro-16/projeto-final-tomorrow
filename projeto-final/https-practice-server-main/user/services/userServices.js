const fs = require("fs");

exports.getAllUsers = (req, res) => {
  try {
    const db = require("../../db.json");

    res.status(200).send({
      message: "Exibindo todos os dados",
      response: db,
    });
  } catch (err) {
    res.status(500).send({
      message: "Um erro ocorreu!",
      error: err.message,
    });
  }
};

exports.createUser = (req, res) => {
  try {
    const db = require("../../db.json");

    const user = req.body;

    if (db.length > 0) {
      user.id = db[db.length - 1].id + 1;
    } else {
      user.id = 0;
    }

    db.push(user);

    fs.writeFileSync("./db.json", JSON.stringify(db, null, "\t"), (err) => {
      if (err) throw new Error(err);
    });
    res.status(201).send({
      message: "Usuário cadastrado com sucesso",
      response: user,
    });
  } catch (err) {
    res.status(500).send({
      message: "Não foi possível cadastrar o usuário",
      error: err.message,
    });
  }
};

exports.deleteUser = (req, res) => {
  try {
    const db = require("../../db.json");

    const id = parseInt(req.params.id);

    const index = db.findIndex((user) => user.id === id);

    if (index !== -1) {
      const deletedUser = db.splice(index, 1);

      fs.writeFileSync("./db.json", JSON.stringify(db, null, "\t"), (err) => {
        if (err) throw new Error(err);
      });
      res.status(201).send({
        message: "Usuário deletado com sucesso",
        response: deletedUser,
      });
    } else {
      res.status(404).send({
        message: "Usuário não encontrado!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Não foi possível deletar o usuário",
      error: err.message,
    });
  }
};

exports.updateUser = (req, res) => {
  try {
    const db = require("../../db.json");

    const newKeys = req.body;

    const id = parseInt(req.params.id);

    const index = db.findIndex((user) => user.id === id);

    if (index !== -1) {
      Object.assign(db[index], newKeys);

      db[index].id = id;

      fs.writeFileSync("./db.json", JSON.stringify(db, null, "\t"), (err) => {
        if (err) throw new Error(err);
      });
      res.status(200).send({ message: "Alterado com éxito", response: db[index] });
    } else {
      res.status(404).send({ message: "Usuário não encontrado!" });
    }
  } catch (err) {
    res.status(500).send({ message: "Não foi possível atualizar o usuário!", error: err.message });
  }
};
