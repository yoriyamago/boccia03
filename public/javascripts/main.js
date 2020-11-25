
var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host)
var end = "\\0";


//赤色
$('#red').click(async function () {
 ws.send("BC01TCOL1"+ end);
});

//青色
$('#blue').click(async function () {
ws.send("BC01TCOL2"+ end);
});

//テキストボックス
$("#showtime").on("click", function () {
    ws.send("BC01NAME:" + $('#text').val() + end);
});

//スイッチ１
$('#left').click(async function () {
  ws.send("BC01LROT"+ end);
});
//スイッチ２
$('#right').click(async function () {
  ws.send("BC01RROT"+ end);
});
//スイッチ３
$('#up').click(async function () {
  ws.send("BC01RISE"+ end);
});
//スイッチ４
$('#down').click(async function () {
  ws.send("BC01FALL"+ end);
});
//スイッチ４
$('#ignition').click(async function () {
  ws.send("BC01FIRE"+ end);
});

