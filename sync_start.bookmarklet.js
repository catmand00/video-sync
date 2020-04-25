javascript: (function (exports) {
  const secretKey =
    localStorage.getItem("sync_SECRET_KEY") || prompt("Enter secret key");
  const serverUrl =
    localStorage.getItem("sync_server_url") || prompt("Enter server url");
  localStorage.setItem("sync_SECRET_KEY", secretKey);
  localStorage.setItem("sync_server_url", serverUrl);
  let sock = new WebSocket(`wss://${serverUrl}`, [secretKey, "pass"]);
  let video = document.querySelector("video");

  let play_video = () => {
    video.play();
  };
  let pause_video = () => {
    video.pause();
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

  video.onplay = sync_play;
  video.onpause = sync_pause;

  exports.sync_play = sync_play;
  exports.sync_pause = sync_pause;
  exports.sync_disconnect = sync_disconnect;
})(window);
