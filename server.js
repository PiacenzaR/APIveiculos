const express = require('express');
const db = require('./db'); 
const app = express();
app.use(express.json());
const port = 3000;


// CREATE TABLE veiculos (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     marca VARCHAR(50) NOT NULL,
//     modelo VARCHAR(50) NOT NULL,
//     ano INT NOT NULL,
//     cor VARCHAR(30),
//     preco DECIMAL(10, 2) NOT NULL
// );

// novo veículo
app.post('/inserir', (req, res) => {
    const { marca, modelo, ano, cor, proprietario } = req.body;
    db.query(
        `INSERT INTO veiculos (marca, modelo, ano, cor, proprietario) VALUES (?, ?, ?, ?, ?)`,
        [marca, modelo, Number(ano), cor, proprietario],
        function (err, results) {
            if (err) {
                console.error('Erro na inserção:', err);
                return res.status(500).send('Erro ao inserir veículo');
            }
            res.send(`Veículo inserido! ID: ${results.insertId}`);
        }
    );
});

// selecionar todos os veículos
app.get('/veiculos', (req, res) => {
    db.query(
        `SELECT * FROM veiculos`,
        function (err, results) {
            if (err) {
                console.error('Erro na consulta:', err);
                return res.status(500).json({ error: 'Erro ao consultar veículos' });
            }
            return res.json(results);
        }
    );
});

// atualizar por ID
app.put('/atualizar/:id', (req, res) => {
    const { id } = req.params;
    const { marca, modelo, ano, cor, proprietario } = req.body;

    db.query(
        `UPDATE veiculos SET marca = ?, modelo = ?, ano = ?, cor = ?, proprietario = ? WHERE id = ?`,
        [marca, modelo, Number(ano), cor, proprietario, id],
        function (err) {
            if (err) {
                console.error('Erro na atualização:', err);
                return res.status(500).send('Erro ao atualizar veículo');
            }
            res.send(`Veículo atualizado com ID: ${id}`);
        }
    );
});

// deletar por ID
app.delete('/deletar/id/:id', (req, res) => {
    const { id } = req.params;
    db.query(
        `DELETE FROM veiculos WHERE id = ?`,
        [id],
        function (err) {
            if (err) {
                console.error('Erro na deleção:', err);
                return res.status(500).send('Erro ao deletar veículo');
            }
            res.send('Veículo deletado com sucesso');
        }
    );
});

// deletar por modelo
app.delete('/deletar/modelo/:modelo', (req, res) => {
    const { modelo } = req.params;
    db.query(
        `DELETE FROM veiculos WHERE modelo = ?`,
        [modelo],
        function (err, results) {
            if (err) {
                console.error('Erro na deleção:', err);
                return res.status(500).send('Erro ao deletar veículos');
            }
            if (results.affectedRows > 0) {
                res.send(`${results.affectedRows} veículo(s) deletado(s) com sucesso`);
            } else {
                res.status(404).send('Nenhum veículo encontrado com esse modelo');
            }
        }
    );
});

// selecionar por ID
app.get('/veiculos/:id', (req, res) => {
    const { id } = req.params;
    db.query(
        `SELECT * FROM veiculos WHERE id = ?`,
        [id],
        function (err, results) {
            if (err) {
                console.error('Erro na consulta:', err);
                return res.status(500).send('Erro ao consultar veículo');
            }
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).send('Veículo não encontrado');
            }
        }
    );
});

// selecionar por ano
app.get('/veiculos/ano/:ano', (req, res) => {
    const { ano } = req.params;
    db.query(
        `SELECT * FROM veiculos WHERE ano = ?`,
        [ano],
        function (err, results) {
            if (err) {
                console.error('Erro na consulta:', err);
                return res.status(500).send('Erro ao consultar veículos');
            }
            if (results.length > 0) {
                res.json(results);
            } else {
                res.status(404).send('Nenhum veículo encontrado para o ano especificado');
            }
        }
    );
});

// selecionar todos os veículos da cor AZUL
app.get('/veiculos/cor/azul', (req, res) => {
    db.query(
        `SELECT * FROM veiculos WHERE LOWER(cor) = 'azul'`,
        function (err, results) {
            if (err) {
                console.error('Erro na consulta:', err);
                return res.status(500).send('Erro ao consultar veículos');
            }
            if (results.length > 0) {
                res.json(results);
            } else {
                res.status(404).send('Nenhum veículo encontrado da cor azul');
            }
        }
    );
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
