const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    // return res.json({ "message": "check" });
    const sql = `
        SELECT
            *
        FROM
            EmployeeSkills`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching EmployeeSkills:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

app.get('/EmployeeSkills/search', (req, res) => {
    const { q } = req.query;
    const sql = `
        SELECT
            *
        FROM
            EmployeeSkills
        WHERE
            employeeName LIKE ?
    `;

    db.query(sql, [`%${q}%`], (err, results) => {
        if (err) {
            console.error('Error fetching EmployeeSkills:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

app.put('/EmployeeSkills/:employeeName', (req, res) => {
    const { employeeName } = req.params;
    const { name, yearsOfExperience, proficiency, description } = req.body;
    const sql = "UPDATE employeeskills SET skill_name=?, yearsOfExperience=?, proficiency=?, description=? WHERE employeeName=?";

    db.query(sql, [name, yearsOfExperience, proficiency, description, employeeName], (err) => {
        if (err) {
            console.error('Error updating EmployeeSkills:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        console.log(employeeName);
        res.json({ message: 'EmployeeSkills updated successfully' });
    });
});

app.delete('/EmployeeSkills/:employeeName', (req, res) => {
    const { employeeName } = req.params;
    const sql = "DELETE FROM EmployeeSkills WHERE employeeName=?";

    db.query(sql, [employeeName], (err) => {
        if (err) {
            console.error('Error deleting EmployeeSkills:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'EmployeeSkills deleted successfully' });
    });
});

app.post('/EmployeeSkills', (req, res) => {
    const { skill_id, employeeName, name, yearsOfExperience, proficiency, description } = req.body;
    const sql = "INSERT INTO EmployeeSkills (skill_id, employeeName, skill_name, yearsOfExperience, proficiency, description) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [skill_id, employeeName, name, yearsOfExperience, proficiency, description], (err) => {
        if (err) {
            console.error('Error adding EmployeeSkills:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'EmployeeSkills added successfully' });
    });
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Patna@123',  // Caution: Avoid hardcoding sensitive information like passwords
    database: 'skillmapping'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to the database');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
