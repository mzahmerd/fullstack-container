const keys = require('./keys')

// server setup
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.json())

// Database client setup (postgres)
const {Pool} = require('pg')
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
})

// connect database
pgClient.on('connect', client => {
    client
        .query('CREATE TABLE IF NOT EXISTS values (number INT)')
        .catch(err => console.log('PG ERROR',err))
})


app.get('/' , (req, res, next) =>{
    res.send('Server is running')
})

app.get('/values', async(req, res, next) =>{
    const values = await pgClient.query('SELECT * FROM values')
    res.send(values);
})


app.post('/values', async (req, res) =>{

    if(!req.body.value) return res.status(400).send({success: false})
    const value =await  pgClient.query(`INSERT INTO values(number) VALUES($1)`, [req.body.value])
    
    res.status(200).send({success: true, data: value})
})


app.listen(5000, err =>{
    console.log('server listening on PORT: 5000')
})