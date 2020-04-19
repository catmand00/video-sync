javascript: (function () {
  const new_key = prompt("Enter secret key");
  localStorage.setItem("sync_SECRET_KEY", new_key);
})();
