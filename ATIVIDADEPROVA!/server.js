const express = require('express');
const db = require('./database');
const app = express();

app.use(express.json());


app.post('/funcionarios', (req, res) => {
  const { nome, sobrenome, cargoId } = req.body;
  db.run(
    `INSERT INTO Funcionario (nome, sobrenome, cargoId) VALUES (?, ?, ?)`,
    [nome, sobrenome, cargoId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, message: 'Funcionário cadastrado com sucesso' });
    }
  );
});


app.post('/cargos', (req, res) => {
  const { nome, departamentoId } = req.body;
  db.run(
    `INSERT INTO Cargo (nome, departamentoId) VALUES (?, ?)`,
    [nome, departamentoId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, message: 'Cargo cadastrado com sucesso' });
    }
  );
});


app.post('/departamentos', (req, res) => {
  const { nome } = req.body;
  db.run(
    `INSERT INTO Departamento (nome) VALUES (?)`,
    [nome],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, message: 'Departamento cadastrado com sucesso' });
    }
  );
});


app.get('/departamentos/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM Departamento WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Departamento não encontrado' });
    res.json(row);
  });
});


app.get('/funcionarios/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT nome, sobrenome FROM Funcionario WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Funcionário não encontrado' });
    res.json(row);
  });
});


app.get('/cargos/:id', (req, res) => {
  const { id } = req.params;
  db.get(
    `SELECT Cargo.nome AS cargo, Departamento.nome AS departamento
     FROM Cargo 
     JOIN Departamento ON Cargo.departamentoId = Departamento.id 
     WHERE Cargo.id = ?`,
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Cargo não encontrado' });
      res.json(row);
    }
  );
});


app.put('/funcionarios/:id', (req, res) => {
  const { nome, sobrenome, cargoId } = req.body;
  const { id } = req.params;
  db.run(
    `UPDATE Funcionario SET nome = ?, sobrenome = ?, cargoId = ? WHERE id = ?`,
    [nome, sobrenome, cargoId, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Funcionário atualizado com sucesso' });
    }
  );
});


app.delete('/funcionarios/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM Funcionario WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Funcionário deletado com sucesso' });
  });
});


app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
