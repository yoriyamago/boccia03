

var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);

//赤色
$('#red').click(async function () {
 ws.send("team:red");
});

//青色
$('#blue').click(async function () {
ws.send("team:blue");
});

//テキストボックス
$("#showtime").on("click", function () {
    ws.send("name:" + $('#text').val());
});

//スイッチ１
$('#left').click(async function () {
  ws.send("switch:left");
});
//スイッチ２
$('#right').click(async function () {
  ws.send("switch:right");
});
//スイッチ３
$('#up').click(async function () {
  ws.send("switch:up");
});
//スイッチ４
$('#down').click(async function () {
  ws.send("switch:down");
});
//スイッチ４
$('#ignition').click(async function () {
  ws.send("switch:ignition");
});

