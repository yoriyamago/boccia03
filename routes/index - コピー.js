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

app.use(bodyParser.urlencoded({ extended: true }));

var message = "";
/* GET admin page. */
router.get('/admin', (req, res) => {
  message = "";
  res.render('./admin.ejs',{ message});
});
/* GET login page. */
router.get('/', (req, res) => {
  res.render('./login.ejs', { message:"",aikotoba:"",loginState:"" });
});

/* post login page. */
router.post('/', (req, res) => {
  res.render('./login.ejs', { message:"",aikotoba:"",loginState:"" });
});


/* GET boccia page. */
router.get('/boccia', (req, res) => {

  if(req.session.appsb == undefined){
    console.log("appSb undefined");
    res.render('./login.ejs', { message:"",aikotoba:"" });
    return;
  }
  
  res.render('./index.ejs', {data: baseConf,appsb:req.session.appsb});
});

/* post boccia page. login処理 */
router.post("/boccia", (req, res) => {

  var aikotoba = "";
  if (req.body.aikotoba!=undefined && req.body.aikotoba!= "") {aikotoba = req.body.aikotoba;}
  if (req.session.appsb!=undefined && req.session.appsb!= "") {aikotoba = req.session.appsb; }

  var confLoginState = JSON.parse(fs.readFileSync(configPath), 'utf8');
  console.log("aikotoba:::" + aikotoba);
  console.log("appid:::" +req.session.appid);
  if(aikotoba == baseConf.aikotoba.no1 ){
    if(confLoginState.flg.no1 == flgNGValue && confLoginState.appid.no1 != req.session.appid){
      return reLogin(res);
    } 　
  }
  if(aikotoba == baseConf.aikotoba.no2 && confLoginState.flg.no2 == flgNGValue){
    　return reLogin(res);
  }
  if(aikotoba == baseConf.aikotoba.n03 && confLoginState.flg.no3 == flgNGValue){
    　return reLogin(res);
  }
  
  //合言葉チェックしログイン
  if(aikotoba == "" ){

    message = "合言葉を入力してね！";
    console.log("login　未入力");
    res.render('./login.ejs', {message});

  }else if(aikotoba ==baseConf.aikotoba.no1 ){
    
    console.log("login成功01:" + aikotoba);
    setLoginInfoFunction(confLoginState, req, res,aikotoba);

  }else if(aikotoba == baseConf.aikotoba.n02){ 

    console.log("login成功02:" + aikotoba);
    setLoginInfoFunction(confLoginState,  req, res,aikotoba);
  }else if(aikotoba == baseConf.aikotoba.no3){ 

    console.log("login成功03:" + aikotoba);
    setLoginInfoFunction(confLoginState,  req, res,aikotoba);

  }else{
  
    message = "合言葉違います！" + aikotoba;
    console.log("login失敗"+ aikotoba);
    res.render('./login.ejs', {message});
  }
});

/* post logout. */
router.post("/logout", (req, res) => {
  var confLogoutState = JSON.parse(fs.readFileSync(configPath), 'utf8');
  setLogoutInfoFunction(confLogoutState, req, req.body.appSb);
  res.redirect('/');
});

/* post admin:change. */
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

//reLogin
function reLogin(res) {
  console.log("loginしてる人がいます");
  message = "今は操作できません。しばらく待ってね！";
  res.render('./login.ejs', { message });
  return;
}

//login
function setLoginInfoFunction(confInfo,  req, res,aikotoba) {
//状態の書き換え　
  if(aikotoba == BC01){
    var no = confInfo.currentno.no1;
    confInfo.flg.no1 = flgNGValue;
    confInfo.appid.no1 = no + 1;
    confInfo.currentno.no1 = no + 1;
    req.session.appid =  no + 1;
  }
  if(aikotoba == BC02){
    confInfo.flg.no2 = flgNGValue;
    confInfo.appid.no2 = confInfo.currentno.no2 + 1;
  }
  if(aikotoba == BC03){
    confInfo.flg.no03 = flgNGValue;
    confInfo.appid.no3 = confInfo.currentno.no3 + 1;
  }
//tryを
  fs.writeFileSync(configPath, JSON.stringify(confInfo));

  req.session.appsb = aikotoba;
  confInfo.appsb = aikotoba;
  res.render('./index.ejs', { data: confInfo,appsb:aikotoba });
}

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
