// 接続先URI
var host = location.origin.replace(/^http/, 'ws');

// WebSocketオブジェクト
var webSocket = null;

const BC01OK = "BC01OK";
const BC01NG = "BC01NG";
const BC02OK = "BC02OK";
const BC02NG = "BC02NG";

// 初期処理
function init() {
    open();
   
}

// 接続
function open() {
    if (webSocket == null) {
        // WebSocket の初期化
        webSocket = new WebSocket(host);
        // イベントハンドラの設定
        webSocket.onopen = onOpen;
        webSocket.onmessage = onMessage;
        webSocket.onclose = onClose;
        webSocket.onerror = onError;
    }
}

// 接続イベント
function onOpen(event) {
    chat("接続しました。");
}


// エラーイベント
function onError(event) {
    chat("エラーが発生しました。");
}

// 切断イベント
function onClose(event) {
    chat("切断しました。3秒後に再接続します。(" + event.code + ")");
    webSocket = null;
    setTimeout("open()", 3000);
}

$('#change1').click(async function () {
    webSocket.send(BC01OK);
  });

// チャットに表示
function chat(message) {
    // 100件まで残す
    var chats = $("[data-name='chat']").find("div");
    while (chats.length >= 100) {
        chats = chats.last().remove();
    }
    // メッセージ表示
    var msgtag = $("<div>").text(message);
   if(message == "BC01"){
    $("#button").prop("disabled", true);
   }
    $("[data-name='chat']").prepend(msgtag);
}

// 初期処理登録
$(init);