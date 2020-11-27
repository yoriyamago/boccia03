
var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host)
//赤色
$('#red').click(async function () {
 ws.send("BC01TCOL1");
});

//青色
$('#blue').click(async function () {
ws.send("BC01TCOL2");
});

//テキストボックス
$("#showtime").on("click", function () {
    ws.send("BC01NAME" + $('#text').val());
    //alert($('#text').val());
});

//スイッチ１
$('#left').click(async function () {
  ws.send("BC01LROT");
});
//スイッチ２
$('#right').click(async function () {
  ws.send("BC01RROT");
});
//スイッチ３
$('#up').click(async function () {
  ws.send("BC01RISE");
});
//スイッチ４
$('#down').click(async function () {
  ws.send("BC01FALL");
});
//スイッチ４
$('#ignition').click(async function () {
  ws.send("BC01FIRE");
});

