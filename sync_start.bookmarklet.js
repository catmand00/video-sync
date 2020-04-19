javascript: (function (exports) {
  const secretKey =
    localStorage.getItem("sync_SECRET_KEY") || prompt("Enter secret key");
  localStorage.setItem("sync_SECRET_KEY", secretKey);
  let sock = new WebSocket("wss://45.62.212.114:8765", [secretKey, "pass"]);

  let play_video = () => {
    document.querySelector("video").play();
  };
  let pause_video = () => {
    document.querySelector("video").pause();
  };

  sock.onclose = () => alert("Video Sync is disconnected");
  sock.onopen = () => alert("Video Sync is connected");
  sock.onmessage = (m) => {
    let msg = m.data;
    if (msg === "play") {
      play_video();
    } else if (msg === "pause") {
      pause_video();
    }
  };

  let sync_play = () => {
    sock.send("play");
  };
  let sync_pause = () => {
    sock.send("pause");
  };
  let sync_disconnect = () => {
    sock.close();
  };
  exports.sync_play = sync_play;
  exports.sync_pause = sync_pause;
  exports.sync_disconnect = sync_disconnect;
})(window);
