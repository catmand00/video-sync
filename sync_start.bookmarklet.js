javascript: (function (exports) {
  let sock = new WebSocket("wss://45.62.212.114:8765", [
    "TfM7a9lsQRBVhBTgklFUZ1Wz1a6qihoU2rGS49CmynMu4pLJQzNhGtHVKZBfBSRNaKEuJpsyHi3qt6DsIhBYwAfA9fcQGvJFpeotnGybKGxvIHH7CcVeaQle",
    "pass",
  ]);

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
