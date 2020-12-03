
var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);

//configから値取得
var appinfo = $('#appinfo').val();
var appSb = $('#appSb').val();
var textName = $('#textName').val();
var teamRed = $('#teamRed').val();
var teamBlue = $('#teamBlue').val();
var teamWhite = $('#teamWhite').val();
var sRingh  = $('#sRingh').val();
var sLeft  = $('#sLeft').val();
var sUp = $('#sUp').val();
var sDown = $('#sDown').val();
var sIgnt = $('#sIgnt').val();
var flg = $('#flg').val();


/**
* @function HTMLElement.prototype.hold　要素の長押しを検知しメッセージ送信
*/
if(!HTMLElement.prototype.hold){
  Object.defineProperty(HTMLElement.prototype, 'hold', {
      configurable: true,
      enumerable: false,
      writable: true,
      /**
      * @function callback　長押し判定後に行われる何かの処理
      * @int holdtime 長押し判定時間のしきい値(ミリ秒)
      */
      value: function(callback,holdtime) {
          this.addEventListener('mousedown', function (event) {
              event.preventDefault();
              callback(); //event.preventDefaultでクリック等のイベントが解除されてしまうので、要素初タッチ時にも処理を行うようcallbackを設置しておく。
              let time = 0;
              const interval = setInterval(function(){
                time += 100;
                if(time > holdtime){
                  callback();
                }
              },100);
              this.addEventListener('mouseup', function (event) {
                event.preventDefault();
                clearInterval(interval);
              });
          });
      }
  });
}

//スイッチ左長押し対応
const btnLeft  = document.querySelector('#left');
btnLeft.hold(()=>{ws.send(appinfo + appSb + sLeft);},1000);


  //交代
  $('#change').click(async function () {
    $('#text').val("");
    $('#flg').val("false");
  });

//赤色
$('#red').click(async function () {
 ws.send(appinfo + appSb + teamRed);
});

//青色
$('#blue').click(async function () {
 ws.send(appinfo + appSb + teamBlue);
});

//テキストボックス
$("#showtime").on("click", function () {
  var name = $('#text').val();
  
   if(name==""){
     alert("名前を入力してね！");
   }else{
    ws.send(appinfo + appSb + textName + name);
    //alert($('#text').val());
   }
});

//スイッチ１
//$('#left').click(async function () {
//ws.send(appinfo + appSb + sLeft);
//});

//スイッチ２
$('#right').click(async function () {
  ws.send(appinfo + appSb + sRingh);
});
//スイッチ３
$('#up').click(async function () {
  ws.send(appinfo + appSb + sUp);
});
//スイッチ４
$('#down').click(async function () {
  ws.send(appinfo + appSb + sDown);
});
//スイッチ４
$('#ignition').click(async function () {
  ws.send(appinfo + appSb + sIgnt);
});


