const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
const port = 3306;  // The port number you specified

app.post('/save', (req, res) => {
    const { name, code } = req.body;
    // Save code to a file or database
    fs.writeFileSync(`projects/${name}.txt`, code);
    res.send({ status: 'saved' });
});

app.get('/load', (req, res) => {
    const name = req.query.name;
    // Load code from a file or database
    const code = fs.readFileSync(`projects/${name}.txt`, 'utf8');
    res.send({ code });
});

app.listen(port, () => {
    console.log(`Server running at http://86.3.72.80:3306`);
});
