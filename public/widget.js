// public/widget.js
(function () {
  const button = document.createElement("button");
  button.innerHTML = "<svg>...</svg>";
  button.style.cssText =
    "position:fixed;bottom:20px;right:20px;background:#7c3aed;color:white;padding:16px;border-radius:50%;box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:9999;";
  document.body.appendChild(button);

  const iframe = document.createElement("iframe");
  iframe.src = location.origin + "/(widget)";
  iframe.style.cssText =
    "position:fixed;bottom:80px;right:20px;width:380px;height:600px;border:none;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.3);z-index:9998;display:none;";
  document.body.appendChild(iframe);

  button.onclick = () => {
    iframe.style.display = iframe.style.display === "none" ? "block" : "none";
  };
})();
