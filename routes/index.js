let express = require('express');
let router = express.Router();
const fs = require('fs');
const path = require('path');
const conf = JSON.parse(fs.readFileSync('./config.json'), 'utf8');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {data: true});
});
module.exports = router;
