javascript: (function () {
  const new_key = prompt("Enter secret key");
  window.SECRET_KEY = new_key;
  localStorage.setItem("sync_SECRET_KEY", new_key);
})();
