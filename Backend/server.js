const express = require('express');
const mysql = require('mysql2')
const cors = require('cors')

const app = express()
app.use(cors())

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'melnykbdSQL2024',
    database: 'supermarket'
});


app.get('/', (re, res)=>{
    return res.json("From Backend Side");
})

app.get('/users', (req, res)=>{
    const sql = "SELECT id_employee, empl_surname, empl_name FROM employee";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.listen(8081, ()=> {
    console.log("listen");
})