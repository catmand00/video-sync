javascript: (function (exports) {
  const secretKey =
    localStorage.getItem("sync_SECRET_KEY") || prompt("Enter secret key");
  const serverUrl =
    localStorage.getItem("sync_server_url") || prompt("Enter server url");
  localStorage.setItem("sync_SECRET_KEY", secretKey);
  localStorage.setItem("sync_server_url", serverUrl);
  let sock = new WebSocket(`wss://${serverUrl}`, [secretKey, "pass"]);

  let sock_send_json = (json) => sock.send(JSON.stringify(json));

  ignorePlay = false;
  ignorePause = false;
  ignoreSeek = false;
  ignoreVolumechange = false;

  let play_video = () => {
    document.querySelector("video").play();
  };
  let pause_video = () => {
    document.querySelector("video").pause();
  };
  let seek_video = (timestamp) => {
    document.querySelector("video").currentTime = timestamp;
  };
  let volumechange_video = (volume) => {
    document.querySelector("video").volume = volume;
  };

  let sync_play = () => {
    if (ignorePlay) {
      ignorePlay = false;
      return;
    }
    sock_send_json({ action: "play" });
  };
  let sync_pause = () => {
    if (ignorePause) {
      ignorePause = false;
      return;
    }
    sock_send_json({ action: "pause" });
  };
  let sync_volumechange = (ev) => {
    if (ignoreVolumechange) {
      ignoreVolumechange = false;
      return;
    }
    sock_send_json({ action: "volumechange", volume: ev.target.volume });
  };
  let sync_seek = (ev) => {
    if (ignoreSeek) {
      ignoreSeek = false;
      return;
    }
    sock_send_json({ action: "seek", timestamp: ev.target.currentTime });
  };

  sock.onclose = () => alert("Video Sync is disconnected");
  sock.onopen = () => alert("Video Sync is connected");
  sock.onmessage = (m) => {
    let { action, volume, timestamp } = JSON.parse(m.data);
    if (action === "play") {
      ignorePlay = true;
      play_video();
    } else if (action === "pause") {
      ignorePause = true;
      pause_video();
    } else if (action === "seek") {
      ignoreSeek = true;
      seek_video(timestamp);
    } else if (action === "volumechange") {
      ignoreVolumechange = true;
      volumechange_video(volume);
    }
  };

  document.querySelector("video").onplay = sync_play;
  document.querySelector("video").onpause = sync_pause;
  document.querySelector("video").onseeking = sync_seek;
  document.querySelector("video").onvolumechange = sync_volumechange;

  exports.video_sync_socket = sock;
})(window);
