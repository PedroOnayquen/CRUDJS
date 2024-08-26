const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

// Configuração do servidor
const app = express();
const port = 3000;

// Configuração do banco de dados
const db = new sqlite3.Database('./database.db');

// Middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); 

// Rota para a página inicial
app.get('/', (req, res) => {
  res.send('Bem-vindo ao CRUD com SQLite e Express!');
});

// Rota para obter todos os funcionários
app.get('/funcionarios', (req, res) => {
  db.all("SELECT * FROM funcionarios", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Rota para adicionar um funcionário
app.post('/funcionarios', (req, res) => {
  const { nome, funcao, salario } = req.body;
  db.run("INSERT INTO funcionarios (nome, funcao, salario) VALUES (?, ?, ?)", [nome, funcao, salario], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Rota para atualizar um funcionário
app.put('/funcionarios/:id', (req, res) => {
  const { nome, funcao, salario } = req.body;
  const { id } = req.params;
  db.run("UPDATE funcionarios SET nome = ?, funcao = ?, salario = ? WHERE id = ?", [nome, funcao, salario, id], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ updated: this.changes });
  });
});

// Rota para deletar um funcionário
app.delete('/funcionarios/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM funcionarios WHERE id = ?", id, function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ deleted: this.changes });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
