const express = require('express');


const app = express();
const port = 3000;

app.use(bodyParser.json());

let veiculos = [];

app.post('/veiculos', (req, res) => {
    const { marca, modelo, ano, proprietario, cor } = req.body;
    const novoVeiculo = { id: veiculos.length + 1, marca, modelo, ano, proprietario, cor };
    veiculos.push(novoVeiculo);
    res.status(201).json(novoVeiculo);
});


//atualizar!
app.put('/veiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const veiculo = veiculos.find(v => v.id === id);
    
    if (!veiculo) {
        return res.status(404).json({ message: 'Veículo não encontrado' });
    }
    
    const { marca, modelo, ano, proprietario, cor } = req.body;
    Object.assign(veiculo, { marca, modelo, ano, proprietario, cor });
    res.json(veiculo);
});

app.delete('/veiculos/modelo/:modelo', (req, res) => {
    const modelo = req.params.modelo;
    veiculos = veiculos.filter(v => v.modelo !== modelo);
    res.status(204).send();
});

app.get('/veiculos', (req, res) => {
    res.json(veiculos);
});

app.get('/veiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const veiculo = veiculos.find(v => v.id === id);
    
    if (!veiculo) {
        return res.status(404).json({ message: 'Veículo não encontrado' });
    }
    
    res.json(veiculo);
}); 

app.get('/veiculos/ano/:ano', (req, res) => {
    const ano = parseInt(req.params.ano);
    const veiculosPorAno = veiculos.filter(v => v.ano === ano);
    res.json(veiculosPorAno);
});

app.get('/veiculos/cor/azul', (req, res) => {
    const veiculosAzuis = veiculos.filter(v => v.cor.toLowerCase() === 'azul');
    res.json(veiculosAzuis);
});
app.listen(port, () => {
    console.log(`API de veículos rodando em http://localhost:${port}`);
});