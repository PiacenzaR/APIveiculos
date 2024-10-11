const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./empresa.db');

// Criação das tabelas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Departamento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Cargo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    departamentoId INTEGER,
    FOREIGN KEY(departamentoId) REFERENCES Departamento(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Funcionario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    sobrenome TEXT NOT NULL,
    cargoId INTEGER,
    FOREIGN KEY(cargoId) REFERENCES Cargo(id)
  )`);
});

module.exports = db;
