const ws = require("nodejs-websocket");
console.log("准备建立连接...");

var game1 = null,
  game2 = null,
  game1Ready = false,
  game2Ready = false;

const server = ws.createServer(function (conn) {
  // 后台监听接收信息
  conn.on("text", function (str) {
    console.log("收到的信息为: ", str);

    if (str === "game1-连接服务器成功") {
      game1 = conn;
      game1Ready = true;
    }

    if (str === "game2-连接服务器成功") {
      game2 = conn;
      game2Ready = true;
    }

    if (game1Ready && game2Ready) {
      game1.sendText(str);
      game2.sendText(str);
    } else {
      conn.sendText(str);
    }
  });

  conn.on("close", function (code, reason) {
    console.log("关闭连接", code, reason);
  });

  conn.on("error", function (code, reason) {
    console.log("异常关闭", code, reason);
  });
});
server.listen(1234, "127.0.0.2", () => {
  console.log("ok");
});
console.log("WebSocket建立完毕");
