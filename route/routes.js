const express = require('express');
const router = express.Router();

router.get('/execute', (req, res) => {
    // Logic to handle code execution in your language
    res.send('Code executed');
});

module.exports = router;
