const express = require('express');
const pool = require('./db');
const app = express();
const port = 3000;

app.get('/videos', async (req, res) => {
    try {
        const [rows, fields] = await pool.query('SELECT * FROM videos');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar dados do MySQL:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.get('/videos/:id', async (req, res) => {
    const id = req.params.id
    try {
        const [rows, fields] = await pool.query('SELECT * FROM videos WHERE id = ?', [id]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send('Video não encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar video por id:', error);
        res.status(500).send('Erro interno do servidor');
    }
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
