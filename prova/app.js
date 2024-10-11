const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, 'empresa.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados.');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS departamento (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela departamento:', err.message);
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS cargo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        departamentoId INTEGER,
        FOREIGN KEY (departamentoId) REFERENCES departamento(id)
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela cargo:', err.message);
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS funcionario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        sobrenome TEXT NOT NULL,
        cargoId INTEGER,
        FOREIGN KEY (cargoId) REFERENCES cargo(id)
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela funcionario:', err.message);
        }
    });
});

app.post('/funcionarios', (req, res) => {
    const { nome, sobrenome, cargoId } = req.body;
    db.run(`INSERT INTO funcionario (nome, sobrenome, cargoId) VALUES (?, ?, ?)`, [nome, sobrenome, cargoId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Funcionário cadastrado com sucesso' });
    });
});

app.post('/cargos', (req, res) => {
    const { nome, departamentoId } = req.body;
    db.run(`INSERT INTO cargo (nome, departamentoId) VALUES (?, ?)`, [nome, departamentoId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Cargo cadastrado com sucesso' });
    });
});

app.post('/departamentos', (req, res) => {
    const { nome } = req.body;
    db.run(`INSERT INTO departamento (nome) VALUES (?)`, [nome], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Departamento cadastrado com sucesso' });
    });
});

app.get('/departamentos/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM departamento WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Departamento não encontrado' });
        res.json(row);
    });
});

app.get('/funcionarios/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM funcionario WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Funcionário não encontrado' });
        res.json(row);
    });
});

app.get('/cargos/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM cargo WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Cargo não encontrado' });
        res.json(row);
    });
});

const PORT = 3000;
app.listen(3000, () => {
    console.log(`Servidor rodando na porta ${3000}`);
});
