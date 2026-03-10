"use strict";

const hamburger = document.getElementById("js-hamburger");
const header = document.getElementById("header");
const overlay = document.getElementById("js-drawer-overlay"); // 追加

hamburger.addEventListener("click", () => {
  header.classList.toggle("is-active");
  overlay.classList.toggle("is-active"); // overlayにもクラスをつける
});

// 背景クリックで閉じる処理（これがあると親切！）
overlay.addEventListener("click", () => {
  header.classList.remove("is-active");
  overlay.classList.remove("is-active");
});
