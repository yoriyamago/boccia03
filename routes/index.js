let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {data: 'BC01'});
});
module.exports = router;
