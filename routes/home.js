const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // res.send('Hello World');
  res.render('index', { title: 'My Express App', message: 'Hello World' });
});

router.get('/:year/:month', (req, res) => {
  res.send(req.params);    //Year can be accessed as request.params.year
  // res.send(req.query);   //Query string parameters can be accessed in this way
});

module.exports = router;