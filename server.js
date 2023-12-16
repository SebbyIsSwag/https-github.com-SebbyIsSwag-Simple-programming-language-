const express = require('express');
const fs = require('fs');
const app = express();

const port = 3306;  // The port number

// Middleware to parse JSON bodies. This will help in parsing the bodies in POST requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.post('/save', (req, res) => {
    const { name, code } = req.body;
    // Save code to a file
    fs.writeFileSync(`projects/${name}.txt`, code);
    res.send({ status: 'saved' });
});

app.get('/load', (req, res) => {
    const name = req.query.name;
    // Load code from a file
    const code = fs.readFileSync(`projects/${name}.txt`, 'utf8');
    res.send({ code });
});

// Additional routes can be added here if needed

app.listen(port, () => {
    console.log(`Server running at http:///86.3.72.80:${port}`);
});
