//----
const flgOKValue = "00";
const flgNGValue = "01";
const configPath = './config.json';

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const router = express.Router();
const app = express();

const baseConf = JSON.parse(fs.readFileSync(configPath), 'utf8');
const BC01 = baseConf.appinfo.no1;
const BC02 = baseConf.appinfo.no2;
const BC03 = baseConf.appinfo.no3;
const BC01OK = "BC01OK";
const BC01NG = "BC01NG";
const BC02OK = "BC02OK";
const BC02NG = "BC02NG";
var loginState1 = "";
var loginState2 = "";
var loginState3 = "";

app.use(bodyParser.urlencoded({ extended: true }));

var message = "";
/* GET admin page. */
router.get('/admin', (req, res) => {
  message = "";
  res.render('./admin.ejs',{ message});
});
/* GET login page. */
router.get('/', (req, res) => {
  var confLoginState = JSON.parse(fs.readFileSync(configPath), 'utf8');


  if(confLoginState.flg.no1 == flgOKValue){
    loginState1 = BC01OK;
    req.session.appsb = BC01;
  }
  if(confLoginState.flg.no1 == flgNGValue){
    loginState1 =BC01NG;
    req.session.appsb = "";
  }
  res.render('./login.ejs', {loginState1,loginState2,loginState3 });
});

/* post login page. */
router.post('/', (req, res) => {
  res.render('./login.ejs', { loginState1,loginState2,loginState3});
});


/* GET boccia page. */
router.get('/boccia', (req, res) => {

  if(req.session.appsb == undefined){
    console.log("appSb undefined");
    res.render('./login.ejs', {loginState1,loginState2,loginState3});
    return;
  }
  
  res.render('./index.ejs', {data: baseConf,appsb:req.session.appsb});
});

/* post boccia page. -----Login----- */
router.post("/boccia", (req, res) => {
  var confLoginState = JSON.parse(fs.readFileSync(configPath), 'utf8');
  var appsb = req.session.appsb;
  console.log("appsb:::" +appsb);
  //状態の書き換え　
  if(appsb == BC01){
    confLoginState.flg.no1 = flgNGValue;
  }
  if(appsb == BC02){
    confLoginState.flg.no2 = flgNGValue;
  }
  if(appsb == BC03){
    confLoginState.flg.no03 = flgNGValue;
  }
//状態書き込み　todo　tryを
  fs.writeFileSync(configPath, JSON.stringify(confLoginState));
  res.render('./index.ejs', { data: confLoginState,appsb });
});

/* post logout. */
router.post("/logout", (req, res) => {
  var confLogoutState = JSON.parse(fs.readFileSync(configPath), 'utf8');
  setLogoutInfoFunction(confLogoutState, req, req.session.appsb);
  res.redirect('/');
});

/* post admin:change. ------admin Logout-----*/
router.post("/change1", (req, res) => {
  var sb = BC01;
  var confChange = JSON.parse(fs.readFileSync(configPath), 'utf8');
  setLogoutInfoFunction(confChange,req, sb);
  message = BC01 + "解除しました。";
  res.render('./admin.ejs', { message });
});

router.post("/change2", (req, res) => {
  var sb = BC02;
  var confChange2 = JSON.parse(fs.readFileSync(configPath), 'utf8');
  setLogoutInfoFunction(confChange2, req,sb);
  message = BC02 + "解除しました。";
  res.render('./admin.ejs', { message });
});

router.post("/change3", (req, res) => {
  var sb = BC02;
  var confChange3 = JSON.parse(fs.readFileSync(configPath), 'utf8');
  setLogoutInfoFunction(confChange3, req,sb);
  message = BC02 + "解除しました。";
  res.render('./admin.ejs', { message });
});


//logout
function setLogoutInfoFunction(confOut, req,appinfo) {
  //状態の書き換え
  if(appinfo == BC01){
    confOut.flg.no1 = flgOKValue;
  }
  if(appinfo == BC02){
    confOut.flg.no2= flgOKValue;
  }
  if(appinfo == BC03){
    confOut.flg.no3= flgOKValue;
  }

  //session delete
  req.session.appsb = "";
  req.session.name = "";
  req.session.appid = 0;
  
 //todo try
  fs.writeFileSync(configPath, JSON.stringify(confOut));
}

module.exports = router;
