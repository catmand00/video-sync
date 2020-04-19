javascript: (function () {
  const new_key = prompt("Enter secret key");
  localStorage.setItem("sync_SECRET_KEY", new_key);
  const new_server_url = prompt("Enter server url");
  localStorage.setItem("sync_server_url", new_server_url);
})();
