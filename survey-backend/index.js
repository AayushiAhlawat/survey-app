const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

const questions = [
    {
        id: 'name',
        title: 'Full Name',
        description: 'Enter your legal full name.',
        type: 'text',
    },
    {
        id: 'age',
        title: 'Age',
        description: 'Enter your age.',
        type: 'number',
    },
    {
        id: 'gender',
        title: 'Gender',
        description: 'Select your gender.',
        type: 'radio',
        options: ['Male','Female','Other'],
    },
    {
        id: 'health',
        title: 'Health Conditions',
        description: 'List any ongoing health conditions.',
        type: 'textarea',
    },
];

app.get('/survey',(req,res) => {
    res.json(questions);
});

app.post('/responses',(req,res) => {
    const {answers} = req.body;
    db.run(
        `INSERT INTO responses (answers) VALUES (?)`,
        [JSON.stringify(answers)],
        function(err){
            if(err) return res.status(500).send(err.message);
            res.json({id:this.lastID});
        }
    );
});

app.get('/responses/:id', (req,res) => {
    const id = req.params.id;
    db.get(`SELECT * from responses WHERE id = ?`,[id],(err,row) => {
        if(err) return res.status(500).send(err.message);
        if(!row) return res.status(404).send('Not Found');
        res.json({id:row.id, answers: JSON.parse(row.answers)});
    });
});

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`);
});