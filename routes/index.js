//----
const flgOKValue = "00";
const flgNGValue = "01";
const configPath = './config.json';

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const app = express();

const conf = JSON.parse(fs.readFileSync(configPath), 'utf8');
const BC01 = conf.appinfo1;
const BC02 = conf.appinfo2;
const BC03 = conf.appinfo3;

app.use(bodyParser.urlencoded({ extended: true }));

var message = "";

/* GET login page. */
router.get('/', (req, res) => {
  res.render('./login.ejs', { message:"",aikotoba:"" });
});

/* post login page. */
router.post('/', (req, res) => {
  res.render('./login.ejs', { message:"",aikotoba:"" });
});

/* GET boccia page. */
router.get('/boccia', (req, res) => {

  if(req.body.aikotoba  == null){
    console.log("undefined");
    res.render('./login.ejs', { message:"",aikotoba:"" });
    return;
  }
  
  res.render('./index.ejs', {data: conf});
});

/* post boccia page. logincheck */
router.post("/boccia", (req, res) => {
  const appinfo = req.body.aikotoba;
  var confIn = JSON.parse(fs.readFileSync(configPath), 'utf8');

  //状態チェック
  if(appinfo == conf.aikotoba1 && confIn.flg01 == flgNGValue){
    　return reLogin(res);
  }
  if(appinfo == conf.aikotoba2 && confIn.flg02 == flgNGValue){
    　return reLogin(res);
  }
  if(appinfo == conf.aikotoba3&& confIn.flg03 == flgNGValue){
    　return reLogin(res);
  }
  
  //合言葉チェックしログイン
  if(appinfo == "" ){

    message = "合言葉を入力してね！";
    console.log("login　未入力");
    res.render('./login.ejs', {message});

  }else if(appinfo ==conf.aikotoba1 ){

    console.log("login成功01:" + appinfo);
    setLoginInfoFunction(confIn, res,appinfo);

  }else if(appinfo == conf.aikotoba2){ 

    console.log("login成功02:" + appinfo);
    setLoginInfoFunction(confIn, res,appinfo);
  }else if(appinfo == conf.aikotoba3){ 

    console.log("login成功03:" + appinfo);
    setLoginInfoFunction(confIn, res,appinfo);

  }else{
  
    message = "合言葉違います！" + appinfo;
    console.log("login失敗"+ appinfo);
    res.render('./login.ejs', {message});
  }
});

/* post logout page. */
router.post("/logout", (req, res) => {
  var appinfo1 = req.body.appinfo;
  var confOut = JSON.parse(fs.readFileSync(configPath), 'utf8');
  setLogoutInfoFunction(confOut, appinfo1);
  res.redirect('/');
});

//状態チェック
function reLogin(res) {
  console.log("loginしてる人がいます");
  message = "今は操作できません。しばらく待ってね！";
  res.render('./login.ejs', { message });
  return;
}

//login
function setLoginInfoFunction(confv, res,aikotoba) {
//状態の書き換え　
  if(aikotoba == BC01){
    confv.flg01 = flgNGValue;
  }
  if(aikotoba == BC02){
    confv.flg02 = flgNGValue;
  }
  if(aikotoba == BC03){
    confv.flg03 = flgNGValue;
  }

  fs.writeFileSync(configPath, JSON.stringify(confv));
  confv.appinfo = aikotoba;
  console.log("aikotoba:" + aikotoba);
  console.log("confv.flg01:" + confv.flg01);
  console.log("confv.flg02:" + confv.flg02);
  console.log("confv.flg03:" + confv.flg03);
  res.render('./index.ejs', { data: confv });
}

//logout
function setLogoutInfoFunction(confOut, appinfo) {
  //状態の書き換え
  if(appinfo == BC01){
    confOut.flg01 = flgOKValue;
  }
  if(appinfo == BC02){
    confOut.flg02 = flgOKValue;
  }
  if(appinfo == BC03){
    confOut.flg03 = flgOKValue;
  }
  console.log("appinfo:" + appinfo);
  console.log("confOut.flg01:" + confOut.flg01);
  console.log("confOut.flg02:" + confOut.flg02);
  console.log("confOut.flg03:" + confOut.flg03);
  fs.writeFileSync(configPath, JSON.stringify(confOut));
}

module.exports = router;
