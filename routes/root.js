const express = require('express');
const router = express.Router();

router.get('^/$|/index(.html)?', (req, res) => {
  //res.sendFile('../views/index.html');
  // TODO html welcome page with redirect to frontend
  //res.send('Welcome!');
  if (req.accepts('html')) {
    res.render('index', { title: 'Eatt Backend' });
  } else {
    res.json({ message: 'Welcome!' });
  }
});

module.exports = router;
