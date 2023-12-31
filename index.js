const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');
const { check, validationResult } = require('express-validator');

const app = express();
const port = 3000;

app.use(bodyParser.json());
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

app.post('/videos/', [
    check('titulo').isString().notEmpty(),
    check('descricao').isString().notEmpty(),
    check('url').isURL()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { titulo, descricao, url } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO videos (titulo, descricao, url) VALUES (?, ?, ?)', [titulo, descricao, url]);
        res.json({ result })
    } catch (error) {
        console.error('Erro ao inserir dados', error);
        res.status(500).send('Erro interno do servidor')
    }
})

app.put('/videos/', [
    check('id').isString().notEmpty(),
    check('titulo').isString().notEmpty(),
    check('descricao').isString().notEmpty(),
    check('url').isURL()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id, titulo, descricao, url } = req.body;
    try {
        const [result] = await pool.query('UPDATE videos SET titulo = ?, descricao = ? , url = ? WHERE id = ?', [titulo, descricao, url, id]);
        if (result.affectedRows > 0) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }

    } catch (error) {
        console.error('Erro ao editar dados', error);
        res.status(500).send('Erro interno do servidor')
    }
})

app.delete('/videos/:id', async (req, res) => {
    const id = req.params.id
    try {
        const [result] = await pool.query('DELETE from videos WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }

    } catch (error) {
        console.error('Erro ao deletar dados', error);
        res.status(500).send('Erro interno do servidor')
    }
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
